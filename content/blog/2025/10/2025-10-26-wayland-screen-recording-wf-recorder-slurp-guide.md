+++

date = 2025-10-27T16:41:48+03:00
publishDate = 2025-10-27T16:41:48+03:00
lastmod = 2025-10-27T16:41:48+03:00
ShowReadingTime = true
ShowToc = true
TocOpen = true



draft = false 


title = "GUI-less Screen Capture: The wf-recorder/slurp Guide for Sway"
author = "Murat Kurkoglu"
description = "Dive into the terminal-only method for perfect screen recording on Arch Linux and Sway/Wayland. Learn to use wf-recorder and slurp for selected-area video capture."
summary = "Dive into the terminal-only method for perfect screen recording on Arch Linux and Sway/Wayland. Learn to use wf-recorder and slurp for selected-area video capture."
slug = "gui-less-screen-capture-wf-recorder-slurp-guide-sway-wayland"
keywords = ["Wayland", "Sway", "Arch Linux", "CLI", "wf-recorder"]
tags = ["Wayland", "Sway", "Arch Linux"]
categories = ["Linux", "Productivity"]
series = ["Wayland Deep Dive"]
[cover]
    image = "images/blog/2025/10/2025-10-26-wayland-screen-recording-wf-recorder-slurp-guide-watermarked.avif"
    alt = "Two developers successfully using wf-recorder and slurp to capture a specific area of a Sway/Wayland desktop from the terminal."
+++

**The definitive command-line approach to recording selected screen areas in a Wayland environment.**

---

👋 Hey everyone,

If you’re anything like me, you came to **Sway** on **Arch Linux** because you crave speed, control, and a beautifully minimal setup. The tiling window manager philosophy is about maximizing efficiency by living almost entirely in the terminal. But then comes the moment you need to record a specific, custom-sized region of your screen—a bug reproduction for a client, a quick tutorial for a colleague, or a polished clip for a GitHub issue. Suddenly, I found myself thinking: *Do I really have to install a huge, X11-era, bloat-filled GUI application just for this?* The answer, thankfully, is a resounding **no**.

The journey to find a truly native, terminal-only Wayland screen recorder that allows mouse-based area selection led me down a fascinating rabbit hole. I wanted a solution that was efficient, entirely free of graphical pop-ups, and perfectly integrated with the `wlroots` compositor used by Sway. The resulting combination of tools is pure command-line poetry.

---

### My Goal This Week 🎯

My mission was clear: Achieve a single, elegant, runnable command that performs **area selection screen recording with audio** in a Wayland/Sway session. This command needed to:
1.  Be initiated from a terminal (like **Alacritty** or **Foot**).
2.  Allow me to dynamically select the recording area using the mouse.
3.  Record the screen (video).
4.  Capture microphone audio.
5.  Save the output to a common, high-quality video format.
6.  Be stoppable cleanly without leaving rogue processes behind.

This wasn't just about recording; it was about upholding the **minimalist, terminal-first ethos** of the Sway environment.

---

### The Process & The Code 👨‍💻

The solution lies in combining two powerful, purpose-built Wayland utilities: **`wf-recorder`** and **`slurp`**.

* **`wf-recorder`**: This is a screen recording utility specifically built for Wayland compositors that use the `wlr-screencopy-unstable-v1` protocol, which includes Sway. It uses **FFmpeg** for encoding, meaning you get access to all the video codecs and file formats you could ever need.
* **`slurp`**: This simple but essential tool is a Wayland counterpart to the old X11 `xrectsel`. It allows you to interactively select a rectangular region of the screen using your mouse and, crucially, it prints the selected area's geometry (e.g., `x,y WxH`) to standard output.

#### **Step 1: Installation**

Assuming you're on Arch or an Arch-based distribution, installation is straightforward:

~~~bash
sudo pacman -S wf-recorder slurp ffmpeg
~~~
*(Note: `ffmpeg` provides the codecs for `wf-recorder` to function.)*

#### **Step 2: The Core Command**

The magic happens when you nest the `slurp` command inside the `wf-recorder` command using shell substitution (`$()`):

~~~bash
wf-recorder -g "$(slurp)" --audio -f my_perfect_screencast-$(date +%Y%m%d_%H%M%S).mp4
~~~

**Breaking Down the Command:**

1.  **`wf-recorder`**: Starts the screen recorder.
2.  **`-g "$(slurp)"`**: This is the key. `wf-recorder`'s `-g` flag expects a geometry string. When the shell executes this, it first runs **`slurp`**. The screen dims, you use your mouse to select the area, and when you release the mouse button, `slurp` prints the area coordinates. This output is then immediately passed as the geometry argument to `wf-recorder`.
3.  **`--audio`**: Tells `wf-recorder` to also capture audio from your default source (usually your microphone via **PipeWire** or **PulseAudio**).
4.  **`-f my_perfect_screencast...`**: Specifies the output file name and format. I included `$(date +%Y%m%d_%H%M%S)` to ensure every recording has a unique, time-stamped file name, preventing accidental overwrites.
5.  **Stopping the Recording**: Once the command is running, you simply press **`Ctrl + C`** in the terminal where you launched it. The recording will finalize and the file will be saved.

---

### Hitting The Wall 🧱

My initial attempts often resulted in massive video files or noticeable performance hitches, which completely defeated the purpose of using a minimalist Wayland setup. The default settings were functional but not optimal for modern hardware.

I realized the default codec (`libx264`) wasn't being utilized efficiently. The problem wasn't the core `wf-recorder`/`slurp` concept; it was the **encoding parameters**. Without GPU acceleration, even a small region recording can max out a CPU.

On my Intel/AMD system, I needed to leverage **VAAPI** (Video Acceleration API) for hardware encoding.

---

### The Breakthrough Moment ✨

The real performance breakthrough came by explicitly defining the codec and providing a few key parameters, directly piping them into `wf-recorder`.

#### **The Hardware-Accelerated Command (For Intel/AMD using VAAPI):**

~~~bash
wf-recorder -g "$(slurp)" --audio \
  -c h264_vaapi -d /dev/dri/renderD128 \
  -p quality=5 \
  -f vaapi_screencast-$(date +%Y%m%d_%H%M%S).mp4
~~~

* **`-c h264_vaapi`**: Selects the VAAPI-accelerated H.264 encoder.
* **`-d /dev/dri/renderD128`**: Specifies the GPU device to use for encoding (this path may vary, check your system with `ls /dev/dri/`).
* **`-p quality=5`**: Passes a codec parameter for video quality. A lower number means higher quality (for VAAPI, 5 is often a great balance between size and quality).

This single adjustment reduced my CPU load from 90% to under 15% during recording and produced a smaller, smoother, and higher-quality video. The lesson? A command-line tool is only as good as the **parameters** you feed it. Never settle for the defaults when hardware is involved!

---

### 📚 Recommended Resource

When you spend this much time optimizing your terminal environment and workflow, the next logical step is to master the tools you use every day. I highly recommend **"The Linux Command Line" by William E. Shotts, Jr.** This book isn't just a manual; it's a deep dive into the philosophy of the terminal. It provides the foundational knowledge necessary to understand why commands like `wf-recorder -g "$(slurp)"` work and how to leverage shell substitution, pipes, and I/O redirection to create your own bespoke, minimalist workflows. It’s invaluable for anyone building a system like a Sway/Arch desktop. [Amazon](https://www.amazon.com/Linux-Command-Line-Complete-Introduction/dp/1593273894)

---

### Key Takeaways 📚

1.  💡 **The Power of Synergy**: The Wayland ecosystem thrives on small, single-purpose tools. The `wf-recorder` (video capture) + `slurp` (geometry selection) combo exemplifies this modular, Unix philosophy perfectly.
2.  ⚙️ **Hardware Acceleration is Not Optional**: For modern video encoding, always investigate your GPU's capabilities (`h264_vaapi`, `h264_nvenc`, etc.) and explicitly include them with the `-c` and `-d` flags to save your CPU and guarantee smooth frame rates.
3.  📚 **Master the Shell**: The ability to nest commands using **shell substitution** (`$()`) is what makes this entire GUI-less workflow possible. It removes the need for intermediary scripts or GUIs by feeding one command's output directly as an argument to another.

---

### Thanks for Following ☕
☕ If you found this guide helpful, you can [Buy Me a Coffee](https://buymeacoffee.com/orioninsist)!
[Medium](https://orioninsist.medium.com/subscribe)
[Etsy](https://www.etsy.com/shop/orioninsist)
[LinkedIn](https://www.linkedin.com/company/orioninsist/)
[Read More](https://orioninsist.org/blog/mastering-terminal-gif-screencasts-arch-linux-sway/)

> What is your favorite two-tool combination that solves a complex task with a single, elegant terminal command?