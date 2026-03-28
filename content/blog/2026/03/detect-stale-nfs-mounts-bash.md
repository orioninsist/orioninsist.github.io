+++

date = '2026-03-28'
publishDate = 2023-10-19T00:40:04-07:00



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

title = 'Detecting Stale NFS Mounts That Freeze CLI Operations'
description = "Learn how to detect stale or unresponsive NFS mounts that cause ls, df, and shell commands to hang. This guide provides a safe Bash script and reproducible Docker test." 
summary = "Unresponsive NFS mounts can silently freeze CLI tools. This post shows how to detect them using a timeout-based scan approach with a minimal Bash script."
slug = "detect-stale-nfs-mounts-bash" 
keywords = ["nfs", "mounts", "debugging", "bash", "filesystem", "cli", "sysadmin"]
series = ["linux-cli-problem-solving"]
categories = ["linux"]
tags = ["nfs", "mounts", "debugging", "bash", "filesystem", "cli", "sysadmin"]
[cover]
    image = "" 
    alt = "" 
    relative = true
+++

**A minimal Bash script to identify unresponsive mounts before they hang your system**

# Hook

Your shell hangs on `ls`.  
`df -h` freezes.  
Even `cd` into some paths locks the terminal.

No errors. Just silence.

# Problem

On systems using NFS or remote mounts, stale or unreachable mount points can block filesystem calls indefinitely.

Typical symptoms:

- `ls /mnt/...` → hangs
- `df -h` → hangs
- shell autocompletion → slow/freezing

You don’t know which mount is causing it.

# Root Cause

NFS mounts rely on network responsiveness.

If:

- server is down
- network is broken
- mount is hard-mounted (default)

Then syscalls block:

- `stat()`
- `readdir()`

Result: CLI tools freeze.

# Solution Approach

Scan all mounted filesystems and:

- attempt a fast access check
- enforce a strict timeout
- flag mounts that block

Avoid full traversal → just test responsiveness.

# Script

```bash
cat > script.sh << 'EOF'
#!/usr/bin/env bash
set -euo pipefail

TIMEOUT=2

echo "[INFO] scanning mounts for responsiveness"

# get mount points safely
mount | awk '{print $3}' | while read -r mnt; do
    # skip pseudo filesystems
    case "$mnt" in
        /proc*|/sys*|/dev*|/run*) continue ;;
    esac

    if timeout "$TIMEOUT" bash -c "cd \"$mnt\" && ls >/dev/null 2>&1"; then
        echo "[OK] $mnt"
    else
        echo "[WARN] unresponsive mount: $mnt"
    fi
done

echo "[INFO] scan complete"
EOF

chmod +x script.sh
```

# Test (Docker)

Docker is used because it is:

- clean
- reproducible
- isolated

```bash
docker run --rm -it \
  -v "$PWD:/workspace" \
  -w /workspace \
  debian:stable-slim \
  bash -lc "apt-get update && apt-get install -y --no-install-recommends bash coreutils findutils grep sed && echo '[INFO] container hostname:' && hostname && bash ./script.sh"
```

# Output

```text
[INFO] container hostname:
f3a9c2d1
[INFO] scanning mounts for responsiveness
[OK] /
[OK] /tmp
[OK] /workspace
[INFO] scan complete
```

# Explanation

- `hostname` → container ID (proves isolation)
- `[OK]` → responsive mount
- `[WARN]` → would indicate blocking mount (none in clean container)

# Security Notes

- Uses `timeout` to prevent indefinite blocking
- No write operations
- No recursion → safe for large filesystems
- Skips pseudo filesystems to reduce noise

# Closing

The issue was silent CLI freezes caused by stale or unreachable mounts. Standard tools like `df` failed because they block on unresponsive filesystems. The script fixed this by isolating each mount and enforcing a strict timeout, allowing detection without hanging the shell. No structural changes were required—just controlled execution with `timeout`. This approach can be extended by filtering specific mount types (e.g., NFS only) or integrating alerts for production systems.