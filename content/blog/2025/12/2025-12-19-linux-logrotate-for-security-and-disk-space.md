+++
date = 2025-12-19T02:51:16+03:00
publishDate = 2025-12-19T02:51:16+03:00
lastmod = 2025-12-19T02:51:16+03:00
ShowReadingTime = true
ShowToc = true
TocOpen = true
ShowBreadCrumbs = true # PaperMod setting for navigation [36]
ShowPostNavLinks = true # PaperMod setting for post navigation [36]
ShowShareButtons = true # PaperMod setting to show share buttons [36]
ShowCodeCopyButtons = true # PaperMod setting for code copy buttons [36]
ShowWordCount = true # PaperMod setting to show word count [36]
author = "Murat Kurkoglu"


draft = false 


title = "Linux logrotate: Prevent Disk Full Outages Without Losing Logs"
description = "Learn how Linux logrotate prevents disk full incidents while preserving useful logs for security and troubleshooting, with safe configs and examples."
slug = "linux-logrotate-prevent-disk-full-outages-without-losing-logs"
keywords = ["linux logrotate", "log rotation"]
categories = ["Linux", "System Administration"]
tags = ["Linux", "Logging", "DevOps"]
[cover]
    image = "images/blog/2025/12/2025-12-19-linux-logrotate-for-security-and-disk-space.avif"
    alt = "A visual representation of Linux logrotate rotating logs to prevent disk full."
    relative = true
+++


## Featured snippet answer

Linux logrotate prevents disk full outages by automatically rotating, compressing, and deleting old log files on a schedule. The safe approach is to rotate frequently enough to match log volume, compress archives, keep a defined retention window, and reload services correctly so they keep writing to the new file. This keeps storage predictable without destroying forensic value.

## The problem: logs grow until they break your server

I broke this once by ignoring “small” log growth on a quiet VM, and it ended the same way it always does: the disk hit 100% and everything became weird. Package managers failed, services stopped writing state, and even SSH logins started timing out.

What changed was realizing that log growth is not linear in many environments. The real issue appears when a noisy component (reverse proxy, auth, container runtime, SIEM agent) flips into a loop and writes thousands of lines per minute.

If ignored, this usually results in a disk full incident and a longer recovery than you expect.

That solved the surface issue. The deeper problem appeared later.

## Why this happens (and why “just delete the logs” backfires)

Logs are not “junk files.” They are operational telemetry and often your only timeline during an incident. But Linux services will happily write logs forever unless you enforce limits.

Common triggers:
- Debug mode enabled during troubleshooting and never turned off
- Authentication attacks causing huge auth logs
- Misconfigured reverse proxy or API gateway spamming access logs
- Container logs accumulating under `/var/lib/docker/containers` or journald storage

In my experience, the worst failures happen when you delete a log file that a process still has open. The process keeps writing to the same inode, and you don’t regain space the way you expect.

This worked locally. Production was a different story.

## The common mistakes (what makes logrotate “not work”)

### Mistake 1: rotating the file but not the writer
If the service keeps writing to the old file descriptor, rotation happens but growth continues invisibly. This is why `copytruncate` exists, but it has trade-offs.

### Mistake 2: rotating too rarely
Weekly rotation is fine for small systems, but on busy hosts it’s a gamble. Over time, this increases the chance of one bad day filling the disk.

### Mistake 3: keeping too much, uncompressed
Retention without compression is expensive. Compression usually gives you the best “keep it for later” value.

### Mistake 4: mixing journald and file logs without a plan
Many systems use both `/var/log/*.log` and systemd journal. If you only rotate one side, you still lose.

At this point, the fix is simple—but details matter.

## People Also Ask

### How do I know if logrotate is running?
Most distros run logrotate via a daily cron job or a systemd timer. Check `systemctl list-timers | grep logrotate` or inspect `/etc/cron.daily/logrotate`. You can also run `sudo logrotate -d /etc/logrotate.conf` to simulate and see what would happen.

### What is the difference between copytruncate and postrotate?
`copytruncate` copies the current log to an archive and truncates the original file in place, which keeps the writer happy but can lose a few lines during high write rates. `postrotate` runs a command after rotation (often a service reload) so the process reopens the log file cleanly. In many cases, `postrotate` is safer for correctness, but it depends on the service.

### Where is the logrotate configuration on Linux?
Global settings live in `/etc/logrotate.conf`, and per-service rules usually live in `/etc/logrotate.d/`. If a service ships a logrotate rule, it will typically be a file named after the service in that directory.

## The correct approach: predictable retention + safe reopen

A practical logrotate strategy is:
1) Rotate often enough for your peak volume  
2) Compress quickly  
3) Keep a defined retention window  
4) Ensure the service writes to the new file

### Start with a sane baseline in /etc/logrotate.conf

Here’s a conservative baseline (your distro may already have something similar):

```conf
# /etc/logrotate.conf
weekly
rotate 4
create
compress
delaycompress
missingok
notifempty
```

This is fine for low-volume systems, but for many servers you’ll want per-service overrides.

That solved the surface issue. The deeper problem appeared later.

## Practical example: rotate nginx logs safely

Create or edit `/etc/logrotate.d/nginx`:

```conf
/var/log/nginx/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    sharedscripts
    postrotate
        # Reload so nginx reopens log files
        [ -s /run/nginx.pid ] && kill -USR1 `cat /run/nginx.pid` 2>/dev/null || true
    endscript
}
```

Why this works:
- `daily` matches typical access log volume
- `rotate 14` keeps two weeks (adjust to your needs)
- `compress` + `delaycompress` avoids compressing the newest rotated file immediately (useful if something still reads it)
- `postrotate` ensures nginx reopens logs without relying on truncation

If you’ve ever watched a simple “temporary fix” become technical debt, this will sound familiar.

## Practical example: rotating app logs when you can’t reload cleanly

Sometimes you can’t reliably signal the process, or it’s a custom binary. That’s where `copytruncate` can help:

```conf
/var/log/myapp/myapp.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
    copytruncate
}
```

Trade-off: `copytruncate` can drop lines under heavy write rates. It’s not always a deal breaker, but it’s not “free.”

This is where things improved once I measured real write volume.

## Don’t forget journald: the hidden disk consumer

If your system uses systemd, journald can consume disk in `/var/log/journal` (persistent) or under `/run/log/journal` (volatile).

To cap journald storage, set limits in `/etc/systemd/journald.conf`:

```conf
# /etc/systemd/journald.conf
SystemMaxUse=500M
SystemKeepFree=1G
MaxRetentionSec=14day
```

Then restart journald:

```bash
sudo systemctl restart systemd-journald
```

What changed was that disk usage stabilized even when one service got noisy.

## Benefits & results you can expect

When logrotate is tuned correctly, you usually get:
- Fewer disk full incidents and fewer “mystery outages”
- Faster incident response because logs exist when you need them
- Better security posture because you can keep a reasonable forensic window
- Lower operational stress during spikes and attacks

A single configuration file can prevent a weekend of recovery work.

## Limitations & considerations

Log rotation is not a substitute for observability. If you need long-term analytics, you may want centralized logging (SIEM, log shipping, object storage). Also consider:
- Compliance requirements may force longer retention
- Compression saves space but costs CPU during rotation windows
- Some applications don’t reopen logs without explicit reload signals
- Aggressive retention can hide slow-burning issues if you rotate away evidence too quickly

The right balance depends on your environment and risk profile.

## Conclusion

Linux logrotate is one of those “boring” tools that quietly saves you from real downtime. If you rotate based on real log volume, compress and retain predictably, and make sure services reopen their logs correctly, you can avoid disk full outages without deleting the evidence you’ll need later.

You may also find useful: a deeper guide on journald storage limits and a checklist for disk usage alerts.

## Soft CTA & Community Links

If this was useful and you’d like to follow along, it’s optional:
- Medium Subscription: https://orioninsist.medium.com/subscribe
- YouTube: https://www.youtube.com/@orioninsist-official
- GitHub: https://github.com/orioninsist
- Buy Me a Coffee: https://buymeacoffee.com/orioninsist
- Etsy: https://www.etsy.com/shop/orioninsist
- Website: https://orioninsist.org/
- Read More: https://orioninsist.org/blog/7-life-saving-bash-commands-linux/