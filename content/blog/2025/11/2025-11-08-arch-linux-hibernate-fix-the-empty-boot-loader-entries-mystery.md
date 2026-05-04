+++

date = 2025-11-08T02:01:09+03:00
publishDate = 2025-11-08T02:01:09+03:00
lastmod = 2025-11-08T02:01:09+03:00
ShowReadingTime = true
ShowToc = true
TocOpen = true



draft = false 


title = "Arch Hibernate: My Empty /boot/loader/entries/ Fix"
author = "Murat Kurkoglu"
description = "Couldn't enable hibernate on Arch Linux with systemd-boot? My /boot/loader/entries/ was empty. Here’s the fix: Unified Kernel Images (UKI) and /etc/kernel/cmdline."
summary = "Couldn't enable hibernate on Arch Linux with systemd-boot? My /boot/loader/entries/ was empty. Here’s the fix: Unified Kernel Images (UKI) and /etc/kernel/cmdline."
slug = "arch-linux-hibernate-fix-empty-boot-loader-entries-uki"
keywords = ["Arch Linux", "systemd-boot", "Unified Kernel Image", "UKI", "Linux Hibernate", "BTRFS", "mkinitcpio"]
tags = ["Arch Linux", "systemd-boot", "UKI"]
categories = ["Linux"]
series = ["Arch Linux Deep Dives"]
[cover]
    image = "images/blog/2025/11/2025-11-08-arch-linux-hibernate-fix-the-empty-boot-loader-entries-mystery-watermarked.avif"
    alt = "A terminal screen on Arch Linux showing the steps to configure hibernation using Unified Kernel Images (UKI) and mkinitcpio by editing /etc/kernel/cmdline."
+++

**Arch Hibernate: My Empty /boot/loader/entries/ Fix**
**I couldn't enable hibernation on my Arch Linux system. The Arch Wiki's solution didn't work, and the reason why changed how I see modern boot processes.**

---

👋 Hey everyone,

I've spent the better part of this week chasing a ghost. I run a minimalist Arch Linux setup: `systemd-boot`, BTRFS on the root partition, and a terminal-centric workflow with Sway. It's fast, clean, and exactly how I like it. But it had one glaring, infuriating problem: I couldn't get `systemctl hibernate` to work.

For a laptop user, hibernation (suspend-to-disk) is non-negotiable. I want to be able to save my entire session, all my open `nvim` windows, browser tabs, and terminals, power down completely, and resume days later right where I left off.

So, I did what any Arch user does. I opened the bible: the Arch Wiki.

The instructions seemed clear enough. I had a BTRFS swapfile, so I knew I needed two kernel parameters: `resume=UUID=...` (to point to the disk *partition* holding the swapfile) and `resume_offset=...` (to point to the *exact location* of the file within that partition).

The wiki says to add these parameters to the `options` line in your `systemd-boot` entry file, located at `/boot/loader/entries/arch.conf`.

Simple enough. I opened my terminal, typed `sudo nvim /boot/loader/entries/`... and hit a brick wall.

The directory was empty.

---

### My Goal This Week 🎯
My goal was singular: to successfully run `systemctl hibernate` and have my system power off, then resume perfectly upon reboot.

I had already done the BTRFS-specific prep work. I had a 16GB swapfile (matching my RAM) correctly set up on a BTRFS subvolume. I'd even made sure to disable "Copy-on-Write" (CoW) for the file, which is a known 'gotcha' for BTRFS swap.

The *only* thing left was to tell the kernel where to find this swapfile during the earliest stages of the boot process. And the gateway to that was a configuration file that, on my system, didn't exist.

My first thought: is my system broken? Did I miss a fundamental step during installation? How does my computer even boot if it doesn't have an entry file telling it which kernel to load?

---

### The Process & The "Wrong" Code 👨‍💻
My entire troubleshooting process was fixated on this missing file. I searched for "systemd-boot entries directory empty" and found all sorts of theories. Maybe I should check `/boot/loader/loader.conf`? I did. It was basically empty, just a `timeout` setting.

I was stuck. I knew *what* I needed to do, but I didn't know *where* to do it.

The code I *wanted* to write was this. I wanted to find a file, *any* file, where I could add an `options` line like this:

~~~
# This is what I THOUGHT I needed to write
# in a file like /boot/loader/entries/arch.conf

title   Arch Linux
linux   /vmlinuz-linux-zen
initrd  /intel-ucode.img
initrd  /initramfs-linux-zen.img
options root=UUID=... rw resume=UUID=... resume_offset=...
~~~

But there was no file. My `ls -a /boot/loader/entries/` command just returned `.` and `..`. Nothing.

This was the "wall."

---

### Hitting The Wall 🧱
This wasn't just a technical problem; it was a crisis of confidence. Arch Linux is all about building a transparent system where you control every config file. The fact that my system was booting *magically*, with no apparent configuration, felt like a betrayal of that philosophy.

How could `systemd-boot` find my `vmlinuz-linux-zen` kernel? How did it know to load `intel-ucode.img`?

I was completely baffled. I even considered reinstalling my bootloader, a risky move that I was glad I didn't attempt. I went to bed, frustrated, thinking my system was some weird, non-standard anomaly.

---

### The Breakthrough Moment ✨
The breakthrough came, as it often does, by accident.

I was running a system update and my `zen-kernel` package was upgraded. The post-install hooks ran, and I saw a line in my terminal that I'd seen a hundred times before but never truly *read*:

`==> Creating unified kernel image: '/boot/EFI/Linux/arch-linux-zen.efi'`

Wait. A **Unified Kernel Image**?

A lightbulb went off. I'd heard of UKIs but never dug into them. A quick search confirmed my suspicion.

My system wasn't broken. It was just *modern*.

A Unified Kernel Image (UKI) is a single `.efi` file that bundles the Linux kernel, the `initramfs`, CPU microcode, and—most importantly—the **kernel command-line parameters** all into one package.

This is why `/boot/loader/entries/` was empty. My system doesn't *need* an entry file. `systemd-boot` is configured to just find these `.efi` files in `/boot/EFI/Linux/` and boot them directly. The "options" are no longer separate text; they are *baked into* the bootable file itself.

This is a brilliant design for security and simplicity. You can sign the single `.efi` file for Secure Boot, and your boot process is atomic.

But it completely changes where you need to apply configuration.

So, the new question was: if the kernel parameters are *baked into* the `.efi` file, what's the *source* for those parameters? Where does `mkinitcpio` (the tool that builds the UKI) look when it's "baking" them?

The answer: **`/etc/kernel/cmdline`**

---

### The *Real* Fix: My UKI Hibernate Guide

This discovery changed everything. I wasn't looking for a `.conf` file anymore. I was looking for the *source* file for my kernel's command line.

Here is the exact, step-by-step process that finally worked for my BTRFS + `systemd-boot` + UKI setup.

#### Step 1: Find the BTRFS Swapfile Offset

This is a critical BTRFS-specific step. Because BTRFS is a complex, extent-based filesystem, you can't just point the kernel at the swapfile's *path*. You have to give it the *exact physical block offset* on the disk.

The standard `filefrag` tool does **not** work for this on BTRFS. You must use the `btrfs-inspect-internal` command.

~~~bash
# The file path must be the exact path to your swapfile.
# Mine was /btrfs/swapfile (as I mount my root subvol to /btrfs)
# Yours might be /swapfile or similar.
sudo btrfs inspect-internal map-swapfile -r /btrfs/swapfile
~~~

This command spits out a single, large number. This is your `resume_offset`. Mine was `12068096`. **Do not copy mine; run the command to find yours.**

#### Step 2: Edit `/etc/kernel/cmdline`

This was the file I was missing. On my system, it already existed and had my `root=...` parameters. If it doesn't exist for you, you can simply create it.

This file should contain your *entire* kernel command line, on a **single line**.

~~~bash
# I used nvim, but use nano or whatever you prefer
sudo nvim /etc/kernel/cmdline
~~~

This is what my file looked like **before**:
`# Example:
root=PARTUUID=DEMO-UUID-1234-ABCD-5678 zswap.enabled=0 rw rootfstype=btrfs`

And this is what it looks like **after**. I added my `resume=` and `resume_offset=` parameters to the end of the line:

`root=PARTUUID=DEMO-0000-1111-2222-333333333333 zswap.enabled=0 rw rootfstype=btrfs resume=UUID=FAKE-4444-5555-6666-777777777777 resume_offset=0`

A quick breakdown of the new parts:
* **`resume=UUID=...`**: This is the UUID of the *partition* (`/dev/sda2` in my case) that contains my BTRFS filesystem.
* **`resume_offset=12345678`**: This is the magic number I got from Step 1.

I saved the file and exited.

#### Step 3: Rebuild the Unified Kernel Images

This is the final, crucial step. The parameters in `/etc/kernel/cmdline` are just sitting there as text. They don't *do* anything until you "bake" them into the `.efi` boot file.

The command to do this is the same one that gave me my "Aha!" moment:

~~~bash
# This -P flag rebuilds images for all kernel presets
sudo mkinitcpio -P
~~~

I watched the output carefully. This time, I knew exactly what it was doing. It was reading my `vmlinuz-linux-zen`, gathering the `initramfs` modules, and then reading `/etc/kernel/cmdline` to embed those parameters. Finally, it packaged it all up into `/boot/EFI/Linux/arch-linux-zen.efi`.

#### Step 4: Reboot and Test

With the new UKI built, I crossed my fingers and rebooted.

`sudo reboot`

Once my Sway session loaded, I opened a terminal and typed the magic words:

`systemctl hibernate`

My screen went blank. My laptop's disk light flickered for about 10 seconds.

And then... silence. The machine powered off completely.

I let it sit for a minute, took a deep breath, and pressed the power button. The `systemd-boot` menu appeared. I hit Enter.

Instead of a clean boot, my screen flashed a "Resuming from disk..." message. A moment later, I was looking at my Sway desktop, *exactly* as I had left it. All terminals, all code, all browser tabs, perfectly restored.

It worked.

---

### 📚 Recommended Resource
This entire journey was a deep dive into the guts of the Linux boot process. When you get to this level, you start to realize how much is abstracted away. If you, like me, feel the need to understand *what* is happening when you see terms like `initramfs`, filesystems, and kernel parameters, you need a proper guide.

I wholeheartedly recommend **[How Linux Works, 3rd Edition: What Every Superuser Should Know](https://www.amazon.com/How-Linux-Works-Superuser-Should/dp/1718500408/)** by Brian Ward.

This book is not a tutorial for a single distribution. It's a fundamental breakdown of the Linux operating system itself. It explains *why* the boot process is structured the way it is, *what* the kernel actually does, and *how* tools like `systemd` and `mkinitcpio` fit into the larger picture. My breakthrough with UKIs made so much more sense after I'd read the chapters on booting and kernel initialization. It’s an essential manual for any serious terminal user.

---

### Key Takeaways 📚
1.  💡 **An Empty `/boot/loader/entries/` Is Not a Bug.** If you're using a modern Arch setup, you might be using Unified Kernel Images (UKI). This is a feature, not an error. Your boot files are likely in `/boot/EFI/Linux/`.
2.  ⚙️ **With UKIs, Config Is "Baked In."** The *source* for your kernel parameters is `/etc/kernel/cmdline`. This is the file you must edit. The old `.conf` files are irrelevant.
3.  📚 **`mkinitcpio -P` Is Your "Compile" Button.** Changes to `/etc/kernel/cmdline` (or your `initramfs` hooks) do nothing until you run `sudo mkinitcpio -P` to rebuild your UKIs. This command is what applies your changes.
4.  **BTRFS Has Its Own Rules.** When hibernating to a BTRFS swapfile, `filefrag` is the wrong tool. You *must* use `btrfs inspect-internal map-swapfile -r` to get the correct `resume_offset`.

---

### Thanks for Following ☕
This was a frustrating but incredibly rewarding problem to solve. It reminded me why I love Arch Linux: it doesn't just let you build your own system; it *forces* you to understand it.

☕ If you found this guide helpful, you can [Buy Me a Coffee](https://buymeacahoffee.com/orioninsist)!
[Medium](https://orioninsist.medium.com/subscribe)
[Etsy](https://www.etsy.com/shop/orioninsist)
[LinkedIn](https://www.linkedin.com/company/orioninsist/)
[Read More](https://orioninsist.org/blog/wayland-broke-my-scripts-meet-wtype-your-new-xdotool/)

> Have you ever been stumped by a "modern" Linux feature that changed the rules you thought you knew? What was your "UKI" moment?