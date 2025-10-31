+++

date = 2025-10-31T21:48:23+03:00
publishDate = 2025-10-31T21:48:23+03:00
lastmod = 2025-10-31T21:48:23+03:00
ShowReadingTime = true
ShowToc = true
TocOpen = true



draft = false 


title = "Stop Linux Auto-Creating a ~/Downloads Folder"
author = "Murat Kurkoglu"
description = "Tired of the Downloads folder reappearing on your minimalist Arch Linux + Sway setup? This guide shows how to edit the XDG user-dirs.dirs file to permanently set your home directory as the default."
summary = "Tired of the Downloads folder reappearing on your minimalist Arch Linux + Sway setup? This guide shows how to edit the XDG user-dirs.dirs file to permanently set your home directory as the default."
slug = "stop-linux-auto-creating-downloads-folder"
keywords = ["Linux", "Arch Linux", "Sway", "Wayland", "XDG", "Dotfiles", "Minimalism"]
tags = ["Linux", "Arch Linux", "Sway", "Dotfiles"]
categories = ["Linux"]
series = ["Dotfiles"]
[cover]
    image = "images/blog/2025/10/2025-10-30-stop-linux-auto-creating-downloads-folder-watermarked.avif"
    alt = "A developer's terminal showing the configuration file ~/.config/user-dirs.dirs being edited to change the default download path, preventing automatic folder creation on a minimalist Linux system."
+++

**Stop Linux Auto-Creating a ~/Downloads Folder**
**A deep dive into XDG user directories for the terminal-centric minimalist.**

---

👋 Hey everyone,

I've spent the last few weeks obsessing over perfecting my Arch Linux and Sway environment. My goal is absolute minimalism—a clean, terminal-centric setup where every file and configuration has a purpose. No clutter, no unnecessary folders, just a pure, controlled space. But a small, recurring annoyance kept disrupting my digital zen: the phantom `~/Downloads` folder. Every time I'd download a file in my browser, even if I saved it to `$HOME`, this empty directory would magically reappear. It felt like my system was fighting against my philosophy.

---

### My Goal This Week 🎯
My mission was clear: I had to understand why this was happening and stop it for good. This wasn't just about deleting a folder; it was about reclaiming full control over my environment. I wanted to find the root cause, not just apply a temporary fix. I needed to ensure that my system respected my decision to have a flat, clean home directory, where I decide what gets created and where. It was a matter of principle for anyone who believes in a truly minimalist setup.

---

### The Process & The Code 👨‍💻
My first instinct was to blame the browser. Maybe there was a hidden setting in its `about:config` page? I dug around but found nothing. Then I wondered if it was a Sway or Wayland quirk. My investigation led me down a rabbit hole, but the real culprit wasn't a single application; it was a desktop standard that most applications, graphical or not, adhere to: the **XDG User Directories** specification from freedesktop.org.

This standard aims to create a consistent file system structure for user-specific files (`Documents`, `Music`, `Pictures`, etc.). Even on a minimal system without a full desktop environment like GNOME or KDE, this specification is often respected by applications to know where to save certain types of files.

The logic is simple:
1.  An application (like a web browser) needs to know where to suggest saving downloads.
2.  Instead of hardcoding a path, it asks the system for the "standard" download location.
3.  The system provides this information by reading a simple configuration file: `~/.config/user-dirs.dirs`.

A typical `user-dirs.dirs` file looks something like this:

~~~ini
# This file is written by xdg-user-dirs-update
# If you want to change or add directories, just edit the line you're
# interested in. All local changes will be preserved.
XDG_DESKTOP_DIR="$HOME/Desktop"
XDG_DOWNLOAD_DIR="$HOME/Downloads"
XDG_TEMPLATES_DIR="$HOME/Templates"
XDG_PUBLICSHARE_DIR="$HOME/Public"
XDG_DOCUMENTS_DIR="$HOME/Documents"
XDG_MUSIC_DIR="$HOME/Music"
XDG_PICTURES_DIR="$HOME/Pictures"
XDG_VIDEOS_DIR="$HOME/Videos"
~~~

When my browser asked, "Where should downloads go?" the system dutifully replied, "`$HOME/Downloads`". And if that directory didn't exist, the browser would helpfully create it for me before saving the file. The mystery was solved. The behavior wasn't a bug; it was a feature I hadn't configured.

The solution, then, was beautifully simple. I just needed to tell the XDG system that my designated download directory is my home folder itself.

**Step 1: Edit the Configuration File**

Open the file in your favorite text editor. I use Neovim, of course.

~~~bash
nvim ~/.config/user-dirs.dirs
~~~

**Step 2: Change the Download Path**

Find the line for `XDG_DOWNLOAD_DIR` and change its value to point directly to `$HOME`.

Change this:
`XDG_DOWNLOAD_DIR="$HOME/Downloads"`

To this:
`XDG_DOWNLOAD_DIR="$HOME"`

While I was at it, I decided to go full minimalist and point all the other standard directories to my home folder as well, since I don't use them. This prevents other applications from creating `~/Pictures` or `~/Documents` down the line.

My final configuration looked like this:

~~~ini
XDG_DESKTOP_DIR="$HOME"
XDG_DOWNLOAD_DIR="$HOME"
XDG_TEMPLATES_DIR="$HOME"
XDG_PUBLICSHARE_DIR="$HOME"
XDG_DOCUMENTS_DIR="$HOME"
XDG_MUSIC_DIR="$HOME"
XDG_PICTURES_DIR="$HOME"
XDG_VIDEOS_DIR="$HOME"
~~~

**Step 3: Save and Clean Up**

Save the file and exit your editor. Now, you can safely and permanently remove the `~/Downloads` folder, knowing it won't be resurrected.

~~~bash
rm -rf ~/Downloads
~~~

With this change, applications now default to saving files directly in my home directory. No more rogue folders, no more clutter. My system now behaves exactly as I designed it to.

---

### Hitting The Wall 🧱
Before I discovered the XDG standard, I was genuinely stumped. I kept deleting the folder, and it kept coming back. It felt like a ghost in the machine. My first attempts were crude hacks. I thought about making a `cron` job that would run `rm -rf ~/Downloads` every minute. Then I considered creating a file named `~/Downloads` instead of a directory, hoping it would cause an error and prevent its creation. These were signs of desperation. The real "wall" wasn't a technical barrier; it was a knowledge gap. I was treating a symptom—the reappearing folder—instead of diagnosing the underlying cause. The frustration came from feeling like I had lost control over my own hand-built system.

---

### The Breakthrough Moment ✨
The breakthrough came when I shifted my search query from "firefox creates downloads folder" to "linux standard user directories." This simple change in perspective led me straight to the Freedesktop.org standards and the XDG documentation. Suddenly, everything clicked into place. It wasn't one application's fault; it was a system-wide standard that I was unaware of. The moment I saw the `user-dirs.dirs` file, I knew I had found the answer. It was a powerful reminder that in Linux, there's almost always a configuration file somewhere that holds the key. The solution wasn't a hack or a workaround; it was using the system as it was intended to be used.

---

### 📚 Recommended Resource
If you enjoy diving into the "why" behind how Linux works, I can't recommend **"How Linux Works: What Every Superuser Should Know" by Brian Ward** enough. It doesn't just give you commands to copy and paste; it explains the concepts behind them—from boot processes and networking to the very shell scripting and system standards we've discussed here. It's an invaluable resource for anyone looking to move from being a Linux user to a Linux power user. It helped me build the foundational knowledge that made solving this XDG issue possible. [Amazon](https://www.amazon.com/How-Linux-Works-Brian-Ward/dp/1718500408)

---

### Key Takeaways 📚
1.  💡 **It's a Feature, Not a Bug:** The automatic creation of folders like `~/Downloads` is intentional behavior, guided by the XDG User Directories standard to create consistency across applications.
2.  ⚙️ **Control Lies in Configuration:** The definitive solution is to edit `~/.config/user-dirs.dirs`. By changing the paths here, you tell the entire system how to behave, achieving a permanent and elegant fix.
3.  📚 **Understand the "Why":** The biggest lesson for me was the importance of understanding the underlying standards that govern a Linux system. Chasing symptoms is frustrating; understanding the architecture is empowering.

---

### Thanks for Following ☕
I hope this guide helps other minimalists out there regain full control of their home directories. Every little tweak brings us closer to our perfect, personalized environment.

☕ If you found this guide helpful, you can [Buy Me a Coffee](https://buymeacoffee.com/orioninsist)!
[Medium](https://orioninsist.medium.com/subscribe)
[Etsy](https://www.etsy.com/shop/orioninsist)
[LinkedIn](https://www.linkedin.com/company/orioninsist/)
[Read More](https://orioninsist.org/blog/a-modern-gnu-screen-setup-on-arch-linux/)

> What's the one small, persistent annoyance in your own setup that you've been meaning to fix? Let me know!