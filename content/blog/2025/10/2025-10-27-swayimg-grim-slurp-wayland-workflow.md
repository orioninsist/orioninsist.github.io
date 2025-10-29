+++

date = 2025-10-27T15:21:33+03:00
publishDate = 2025-10-27T15:21:33+03:00
lastmod = 2025-10-27T15:21:33+03:00
ShowReadingTime = true
ShowToc = true
TocOpen = true



draft = false 


title = "FEH to SWAYIMG: Mastering Visual Workflow on Sway/Wayland"
author = "Murat Kurkoglu"
description = "My deep dive into moving from X11's FEH to Wayland-native SWAYIMG on Arch Linux. Learn the Grim + Slurp terminal method for clean, fast screen capture."
summary = "My deep dive into moving from X11's FEH to Wayland-native SWAYIMG on Arch Linux. Learn the Grim + Slurp terminal method for clean, fast screen capture."
slug = "feh-to-swayimg-mastering-visual-workflow-on-sway-wayland"
keywords = ["Arch Linux", "Sway", "Wayland", "Terminal", "Linux Workflow"]
tags = ["Arch Linux", "Sway", "Wayland"]
categories = ["Linux", "Productivity"]
series = ["Wayland Deep Dive"]
[cover]
    image = "images/blog/2025/10/2025-10-27-swayimg-grim-slurp-wayland-workflow-watermarked.avif"
    alt = "Developers celebrating a functional Wayland terminal workflow with Sway, Grim, and Slurp."
+++

**FEH to SWAYIMG: Mastering Visual Workflow on Sway/Wayland**
**The definitive guide to achieving a 100% terminal-driven, visual workflow on modern Wayland compositors, ditching GUI clutter forever.**

---

👋 Hey everyone,

If you’re anything like me—a devout terminal user who lives inside Alacritty, prefers Vim, and treats their Linux desktop not as a graphical environment but as a highly optimized, keyboard-controlled canvas—you know the pain of dependency drift. For years, I was happy running **FEH** on my X11 setups. It was fast, simple, and perfectly scriptable. When I fully committed to **Arch Linux** and **Sway** on Wayland, I initially held onto my X11 tools, but the small incompatibilities, the reliance on Xwayland, and the faint feeling of technological debt started to grate on me. My goal wasn't just to *use* Wayland; it was to **master a native, terminal-first workflow** that didn't just *look* minimal but *was* minimal down to its core dependencies.

---

### My Goal This Week 🎯
I decided it was time to purge the last of the X11 artifacts from my visual pipeline. Specifically, I needed two things: a **pure Wayland image viewer** to replace `feh`, and a **keyboard-driven screen capture utility** that could accurately select and copy regions without resorting to heavy GTK or Qt applications. My ultimate aim was a workflow where I could analyze an image in **`swayimg`**, switch to my browser (**LibreWolf**), select a precise region with a keyboard shortcut, and have the resulting screenshot instantly available for pasting in my terminal-based text editor, all without touching a mouse for navigation or opening any file manager.

---

### The Transition: FEH vs. SWAYIMG 👨‍💻

The transition from **FEH** to **SWAYIMG** was more than just a name change; it was a shift in philosophy. While `feh` is legendary for its speed and simplicity, it fundamentally belongs to the X11 era. Running it on Sway means relying on the **Xwayland** compatibility layer. This introduces a slight overhead and, crucially, breaks the purity of a native Wayland session.

**SWAYIMG**, on the other hand, is built specifically for Wayland compositors like Sway. It retains the minimalist, keyboard-centric ethos I crave but operates directly with the Wayland protocols. It loads images instantaneously, supports all the basic navigation and full-screen modes, and feels inherently 'right' in the environment.

| Feature | FEH (X11 Legacy) | SWAYIMG (Wayland Native) |
| :--- | :--- | :--- |
| **Native Protocol** | X11 | Wayland |
| **Dependency** | Relies on Xwayland | Native Wayland protocols |
| **Performance** | Excellent (for X11) | Exceptional (Zero Xwayland lag) |
| **Workflow Alignment**| *Functional* but not *pure* | *Perfect* fit for minimal Wayland |

For a terminal purist, the choice is clear: **embrace the native Wayland tool.**

---

### The Process & The Code: The Grim + Slurp Method 👨‍💻

The biggest win came with replacing the X11 screenshot tool (`scrot`, `maim`, or the old `import` command from ImageMagick) with the Wayland trifecta: **`grim`**, **`slurp`**, and **`wl-clipboard`** (`wl-copy`).

* **`grim`**: A simple utility to take screenshots of Wayland surfaces. It’s the engine.
* **`slurp`**: A simple tool to select a region of the screen and output the coordinates to stdout. It’s the selector.
* **`wl-copy`**: The Wayland-native equivalent of `xclip` or `xsel`, used for managing the clipboard. It's the destination.

The magic is in chaining them together using the shell pipeline.

#### The Core Code Block (For Direct Copy-Paste)

My `~/.config/sway/config` file now has this killer line bound to `$mod+Shift+s`:

~~~bash
# Take a screenshot of a selected region and immediately copy it to the clipboard
bindsym $mod+Shift+s exec grim -g "$(slurp)" - | wl-copy

# Take a screenshot of a selected region and save it with a timestamp
bindsym $mod+Shift+p exec grim -g "$(slurp)" ~/Screenshots/$(date +%Y%m%d_%H%M%S)_grim.png
~~~

The key insight here is the use of **`-g "$(slurp)"`**. The command substitution `$()` runs `slurp` first. I click and drag my selection rectangle with the mouse, `slurp` outputs the coordinates (e.g., `100,200 800x600`), and that output is fed directly into `grim` as the geometry (`-g`) argument. The `- | wl-copy` part pipes the resulting image data from `grim`'s standard output (`-`) directly to `wl-copy`, completely bypassing any need for a temporary file to hit the disk just for a quick copy-paste operation. This is efficient, elegant, and perfectly minimalist.

---

### Hitting The Wall: The SWAYIMG Artifact 🧱

Everything was perfect until I needed to take a highly precise screenshot *of a picture I had opened in* **`swayimg`**.

I’d open the image—say, a detailed diagram or a screenshot from a video I was watching in MPV. I’d run my `$mod+Shift+s` command, `slurp` would activate, and I'd select the area I wanted. But when I pasted the result, the top edge of the selection contained the **`swayimg` information bar**—the one displaying the filename, format, and size (e.g., `Image Format: PNG 32bit`).

This was infuriating! My beautiful, clean screenshot was ruined by meta-data that I didn't want. The very tool I adopted for its minimalism was creating visual clutter for my secondary workflow.

I briefly considered complex solutions: maybe I could use ImageMagick's `convert` to crop the top 20 pixels every time? But that violated the speed-first, minimal-steps philosophy. The problem was not the screenshot tool; the problem was my ignorance of the image viewer's internal settings.

---

### The Breakthrough Moment: 'i' for Information ✨

The solution, as is often the case in the terminal world, was remarkably simple and hidden behind a single keypress. I finally read the `swayimg` documentation and discovered the keybind:

* **Pressing `i` toggles the visibility of the status/information bar.**

That's it.

When I open an image now, my muscle memory first hits the **`i`** key to clear the metadata bar, ensuring a 100% clean canvas. *Then*, I execute my `grim -g "$(slurp)" - | wl-copy` command. The resulting image is pure, unadulterated content. This simple realization confirmed that the 'UNIX Way'—small tools doing one thing well, combined with deep knowledge of an application's keyboard shortcuts—is superior to relying on an all-in-one GUI application. I had solved a complex workflow problem with pure terminal logic and a single-key shortcut.

---

### 📚 Recommended Resource

For anyone diving deep into the world of Linux customization and keyboard-driven efficiency, I highly recommend **"The Linux Command Line: A Complete Introduction"** by **William Shotts Jr.** This book is not just a reference manual; it fundamentally changes how you think about interaction with your operating system. It solidifies the principles of piping, redirection, and shell scripting that make elegant solutions like the `grim`+`slurp` pipeline possible. Understanding the core tools and the shell itself is the foundation for mastering any environment, whether it's X11 or Wayland. [Amazon](https://www.amazon.com/Linux-Command-Line-Complete-Introduction/dp/1593273894)

---

### Key Takeaways 📚
1.  💡 **Choose Native Tools First:** For Wayland, prioritize native tools like **`swayimg`**, **`grim`**, **`slurp`**, and **`wl-clipboard`** over Xwayland-dependent applications like `feh` or `scrot` for maximum performance and stability.
2.  ⚙️ **Pipe it, Don't File it:** Master the shell pipeline (`|`). The command `grim -g "$(slurp)" - | wl-copy` is exponentially faster and cleaner than saving to a temporary file, then loading the file, then copying the file content. It embodies minimalist efficiency.
3.  📚 **Know Your Keys:** Before resorting to complex scripts, always check an application's help menu or man page. The single press of the **`i`** key in `swayimg` was the simplest, yet hardest-to-discover, solution to a major workflow blocker. This principle applies across all terminal utilities: deep knowledge of the core application is non-negotiable.

---

### Thanks for Following ☕
☕ If you found this guide helpful, you can [Buy Me a Coffee](https://buymeacoffee.com/orioninsist)!
[Medium](https://orioninsist.medium.com/subscribe)
[Etsy](https://www.etsy.com/shop/orioninsist)
[LinkedIn](https://www.linkedin.com/company/orioninsist/)
[Read More](https://orioninsist.org/blog/fedora-sway-vs-arch-wayland-stability-developer/)

> What is the most unconventional but effective terminal-only trick you've built into your daily workflow to avoid a GUI application?