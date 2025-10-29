+++

date = 2025-10-27T17:07:02+03:00
publishDate = 2025-10-27T17:07:02+03:00
lastmod = 2025-10-27T17:07:02+03:00
ShowReadingTime = true
ShowToc = true
TocOpen = true



draft = false 


title = "Arch/Sway: Manually Hacking the GTK File Chooser for Ultimate Workflow Speed"
author = "Murat Kurkoglu"
description = "Learn to manually configure the GTK File Chooser Dialog's bookmarks and settings in Arch Linux and Sway. Ditch the visual tools for ultimate workflow efficiency."
summary = "Learn to manually configure the GTK File Chooser Dialog's bookmarks and settings in Arch Linux and Sway. Ditch the visual tools for ultimate workflow efficiency."
slug = "arch-sway-gtk-file-chooser-bookmarks-config"
keywords = ["Linux", "Sway", "GTK", "Workflow", "Arch"]
tags = ["Linux", "Sway", "GTK"]
categories = ["Technical", "Linux Workflow"]
series = ["Minimalist Desktop Optimization"]
[cover]
    image = "images/blog/2025/10/2025-10-26-arch-sway-gtk-file-chooser-bookmarks-watermarked.avif"
    alt = "A minimalist desktop environment showing an optimized GTK File Chooser Dialog with custom bookmarks for fast navigation."
+++

**Arch/Sway: Manually Hacking the GTK File Chooser for Ultimate Workflow Speed**
**Forget click-heavy file managers. If you live in the terminal on Arch and Sway, your GTK dialogs should fly.**

---

👋 Hey everyone,

If you're reading this, chances are you’re like me: a dedicated minimalist running Arch Linux, probably under the tight, efficient control of **Sway** or another tiling window manager. We optimize *everything*. We tune our terminals, perfect our keybindings, and craft flawless configuration files. Yet, there’s one tiny, ubiquitous element that constantly breaks the flow: the **GTK File Chooser Dialog**.

That pop-up window, essential for saving files in Firefox or opening a project in a GTK-based IDE, often feels clunky. Why should I spend five seconds clicking through a deep directory structure when I can teleport there in my terminal? This week, I decided to apply my minimalist, configuration-file-first philosophy to this dialogue, specifically by mastering the **Bookmarks** feature to eliminate those wasted seconds.

---

### My Goal This Week 🎯
My goal was simple: to make file navigation in GTK applications *instant* by permanently pinning my most-used project directories, config folders (`.config`, `.local/share`), and work locations directly to the "Places" sidebar of the file chooser. I wanted to achieve this without installing or running a full desktop environment's bulky settings panel (like GNOME Settings or LXAppearance). The only way? Go straight to the source: the configuration files.

---

### The Process & The Code 👨‍💻
The beautiful thing about GTK applications, even when running in a standalone Wayland compositor like Sway, is that they rely on standard configuration paths. I knew my bookmarks had to be stored in my home directory's config space.

After a quick search (and some personal experience), I confirmed the existence of the holy grail: the **`bookmarks`** file inside the `gtk-3.0` directory.

#### Step 1: Locating and Opening the Bookmarks File

I started by ensuring the file existed. If it doesn't, you can simply create it.

~~~bash
# Navigate to the GTK configuration directory
cd ~/.config/gtk-3.0/

# Create or open the bookmarks file
nano bookmarks
~~~

#### Step 2: Understanding the URI Format

The `bookmarks` file is a plain text file, but it doesn't just take simple paths like `/home/murat/projects`. It requires the **File URI Scheme** format, starting with `file:///`.

* A standard path: `/home/murat/projects/my-latest-repo`
* The required URI format: `file:///home/murat/projects/my-latest-repo`

#### Step 3: Adding My Essential Project Folders

I meticulously listed every deep directory I frequently need to access. I highly recommend spending five minutes compiling your personal list of "Teleport Destinations."

Here is a snippet of my actual `bookmarks` file:

~~~text
file:///home/murat/git/personal/dotfiles
file:///home/murat/Documents/Invoices-2024
file:///home/murat/VirtualMachines/KVM-Images
file:///home/murat/Apps
file:///home/murat/.config/sway
file:///home/murat/.local/share/fonts
file:///media/storage/backups
~~~

Notice that I added both local directories (`/home/murat/...`) and a mounted external drive directory (`/media/storage/backups`). The GTK File Chooser instantly reads these paths and pins them neatly under "Other Locations" or with the existing "Places" list on the sidebar.

#### Step 4: Fine-Tuning Display Settings

While the `bookmarks` file handles the shortcuts, I also wanted to manage some of the file list display settings shown in the second screenshot (like "Sort Folders before Files").

These general display preferences are typically managed by the `dconf` system, which GTK uses. Even without a full DE, you can adjust these settings from the command line using the **`gsettings`** utility.

* **Sort Folders Before Files:** This makes the dialogue instantly readable, just like a good file manager.

    ~~~bash
    gsettings set org.gtk.Settings.FileChooser sort-directories-first true
    ~~~

* **Showing Hidden Files:** I always want to see my dotfiles, so this setting is crucial for a power user.

    ~~~bash
    gsettings set org.gtk.Settings.FileChooser show-hidden true
    ~~~

These simple terminal commands are the equivalent of clicking those checkboxes in the GUI, but they are permanent, system-wide, and align perfectly with a config-first workflow.

---

### Hitting The Wall 🧱
My biggest challenge wasn't the *how*, but the **persistence of the settings**. Initially, I kept changing the `bookmarks` file, but the changes weren't immediately reflected in applications that were *already open*. For example, if I was already composing an email in Thunderbird (a GTK application) and added new paths, the "Attach File" dialog wouldn't update until I completely restarted Thunderbird.

This is a common "gotcha" in Linux: applications often read config files only once on startup. I learned to treat the `bookmarks` file like a `.bashrc` or `sway/config`: **edit it, save it, and then restart the target application** to see the changes applied. The dialogue itself isn't dynamic in real-time. This frustration taught me a valuable lesson about application lifecycle management in a minimal environment.

---

### The Breakthrough Moment ✨
The true breakthrough wasn't the successful edit; it was the **immediate change in my daily flow**. Once my project directories were pinned, saving a screenshot, opening a file for editing, or uploading a document became a two-click action (often achievable just by pressing a number key corresponding to the item in the list if the dialogue supports it).

The time saved isn't just a few seconds per action; it's the **mental context switch** that disappears. I no longer have to navigate away from my terminal mindset to visually hunt through a GUI. My most crucial locations are right there, ready for instant selection, making the GTK File Chooser an extension of my fast, terminal-based workflow, not an interruption to it.

### 📚 Recommended Resource

If you're diving this deep into customizing core components of your Linux desktop, you need a solid foundational understanding of how all these parts—GTK, Wayland, and Linux architecture—actually interact. I highly recommend **"The Linux Programming Interface" by Michael Kerrisk**. This massive, comprehensive book acts as the definitive user manual for the Linux kernel and glibc. Understanding *why* GTK uses a plain text file in `~/.config` and how system calls manage file I/O will elevate your Arch/Sway customization from guesswork to informed engineering. It’s an investment that pays dividends for any serious Linux user. [Amazon](https://www.amazon.com/Linux-Programming-Interface-System-Handbook/dp/1593272200)

---

### Key Takeaways 📚
1.  💡 **Config is King:** Even in a visual interface like the GTK File Chooser, the ultimate control lies in plain text configuration files. Directly editing `~/.config/gtk-3.0/bookmarks` is the fastest, most predictable way to manage your shortcuts.
2.  ⚙️ **Use URIs:** Remember that the `bookmarks` file requires the full `file:///` URI format, not just a standard Unix path. This is a small but critical detail for successful configuration.
3.  📚 **Restart to Apply:** Be aware that GTK applications read configuration settings (bookmarks, themes, etc.) only upon launch. Always close and restart the target application (Firefox, Thunar, etc.) after modifying your configuration files.

---

### Thanks for Following ☕
☕ If you found this guide helpful, you can [Buy Me a Coffee](https://buymeacoffee.com/orioninsist)!
[Medium](https://orioninsist.medium.com/subscribe)
[Etsy](https://www.etsy.com/shop/orioninsist)
[LinkedIn](https://www.linkedin.com/company/orioninsist/)
[Read More](https://orioninsist.org/blog/gui-less-screen-capture-wf-recorder-slurp-guide-sway-wayland/)

> What are the three most critical, deep-nested folders you've pinned to your GTK Bookmarks file for maximum efficiency?