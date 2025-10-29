+++

date = 2025-10-27T16:19:33+03:00
publishDate = 2025-10-27T16:19:33+03:00
lastmod = 2025-10-27T16:19:33+03:00
ShowReadingTime = true
ShowToc = true
TocOpen = true



draft = false 


title = "Mastering Terminal GIF Screencasts on Arch Linux Sway"
author = "Murat Kurkoglu"
description = "I mastered creating high-quality, lightweight GIFs from screen recordings on my Arch Linux Sway/Wayland setup, using terminal tools `wf-recorder` and optimized `ffmpeg` commands."
summary = "I mastered creating high-quality, lightweight GIFs from screen recordings on my Arch Linux Sway/Wayland setup, using terminal tools `wf-recorder` and optimized `ffmpeg` commands."
slug = "mastering-terminal-gif-screencasts-arch-linux-sway"
keywords = ["Arch Linux", "Sway", "Wayland", "wf-recorder", "FFmpeg"]
tags = ["Arch Linux", "Sway", "Wayland"]
categories = ["Linux", "Wayland", "Programming"]  
series = ["Minimalist Workflow", "Arch Linux Tips"]
[cover]
    image = "images/blog/2025/10/2025-10-26-wayland-terminal-gif-mastery-watermarked.avif"
    alt = "Two developers proudly displaying a high-quality GIF screencast created via `wf-recorder` and `ffmpeg` on Arch Linux."
+++

**Achieve pixel-perfect, optimized, and lightweight animated GIFs directly from your Wayland compositor.**

---

👋 Hey everyone,

This week, my deep dive into minimalism took a technical turn. If you run a setup like mine—Arch Linux on Sway (a fantastic wlroots-based Wayland compositor)—you know the power of terminal-first workflows. I love sharing my quick tricks and code snippets, but sending a full video file is often overkill. What I needed was a way to create perfectly optimized, high-quality, and small GIF screen recordings of my terminal sessions or specific GUI interactions, all without touching a bloated application. I needed to do it the *Arch way*: efficiently, purely through the command line.

---

### My Goal This Week 🎯
My primary objective was simple but deceptively complex: design a single, robust shell script that could handle the entire process of **Wayland screen recording to optimized GIF conversion**.

This meant overcoming a few specific challenges:

1.  **Wayland Compatibility:** Unlike X11's easy global screen access, Wayland requires specific protocols (like `wlr-screencopy-unstable-v1`) to record. For Sway, `wf-recorder` is the correct tool.
2.  **Region Selection:** I needed to select a custom screen region on the fly, similar to a screenshot tool, but for video. This calls for `slurp`.
3.  **GIF Optimization:** Directly recording to GIF results in huge, poor-quality files. The solution is the famous two-pass `ffmpeg` method: generating a custom color palette first, then applying it to the final GIF for massive file size reduction and better color fidelity.

### The Process & The Code 👨‍💻

After assembling the necessary tools—`wf-recorder`, `slurp`, and the indispensable `ffmpeg`—I pieced together a single, highly efficient Bash script. I call it `waygif`.

#### 1. Installation (If not already installed on Arch)

Before anything, I made sure the dependencies were in place:

~~~bash
sudo pacman -S wf-recorder slurp ffmpeg
~~~

#### 2. The `waygif` Script: The Minimalist Workflow

I created the following script, which automates the entire two-step optimization process: recording and conversion. I placed this file in my `$PATH` (e.g., `~/bin/waygif`) and made it executable (`chmod +x ~/bin/waygif`).

~~~bash
#!/bin/bash

# --- Configuration ---
FPS=15
SCALE="800:-1" # Width 800px, auto-height. Change to desired size.
TEMP_DIR="/tmp/gif_record_$$"
TEMP_MP4="$TEMP_DIR/temp.mp4"
TEMP_PALETTE="$TEMP_DIR/palette.png"

# --- Main Logic ---

# 1. Select Region using slurp
GEOMETRY=$(slurp)
if [ -z "$GEOMETRY" ]; then
    echo "Recording cancelled by user."
    exit 1
fi

# 2. Define Output Filename
OUTPUT_FILE=$(zenity --file-selection --save --confirm-overwrite --text="Save GIF as..." --filename="screencast-$(date +%Y%m%d%H%M%S).gif")
if [ $? -ne 0 ] || [ -z "$OUTPUT_FILE" ]; then
    echo "Saving cancelled by user."
    exit 1
fi

# 3. Create temp directory
mkdir -p "$TEMP_DIR"

# 4. Start Recording (wf-recorder to MP4)
echo "Starting recording for geometry: $GEOMETRY. Press Ctrl+C to stop..."
wf-recorder -g "$GEOMETRY" -f "$TEMP_MP4"
RECORD_STATUS=$?

if [ $RECORD_STATUS -ne 0 ]; then
    echo "wf-recorder failed or was stopped unexpectedly."
else
    # 5. FFmpeg Two-Pass Optimization
    echo "Starting optimized GIF conversion..."

    # Pass 1: Generate the optimal 256-color palette
    ffmpeg -i "$TEMP_MP4" -vf "fps=$FPS,scale=$SCALE:flags=lanczos,palettegen" -y "$TEMP_PALETTE"

    # Pass 2: Convert to GIF using the generated palette
    ffmpeg -i "$TEMP_MP4" -i "$TEMP_PALETTE" -filter_complex "fps=$FPS,scale=$SCALE:flags=lanczos[x];[x][1:v]paletteuse" -y "$OUTPUT_FILE"

    echo "Successfully created: $OUTPUT_FILE"
fi

# 6. Cleanup
rm -rf "$TEMP_DIR"

# Note: zenity is optional for GUI file selection; can be replaced with simple prompt.
~~~

### Hitting The Wall 🧱
My initial attempts were frustrating. I tried piping `wf-recorder` directly into an `ffmpeg` GIF conversion stream (`wf-recorder | ffmpeg ...`), but the complexity of Wayland's screen capture, combined with `ffmpeg`'s reliance on file-based optimization for the two-pass method, made it extremely unstable and slow. The biggest roadblock was, without a doubt, the quality. My first few "direct-to-gif" recordings were choppy, looked terrible with color banding, and yet somehow were 15MB for a 5-second clip. The initial temptation to find a single, magic command failed because GIF is not a video format; it requires meticulous post-processing to look good.

### The Breakthrough Moment ✨
The key was embracing the two-pass system and isolating the temporary MP4 file. Once I accepted that the brief stop-gap between recording and conversion was necessary for quality, everything clicked.

The two lines of `ffmpeg` (Palette Generation and Palette Usage) are the heroes:

1.  `palettegen`: This step analyzes every frame of the recorded MP4 and calculates the absolute best 256-color palette to represent the video's content.
2.  `paletteuse`: This step then converts the video into GIF, but *only* using the highly customized, clean 256 colors defined by the palette.

By incorporating these into the `waygif` script, I went from a 15MB, ugly GIF to a 1.5MB, crisp, and color-accurate GIF—all with a single command line call, `waygif`. It was a perfect blend of performance, quality, and terminal elegance.

### 📚 Recommended Resource

When dealing with video encoding, conversion, and optimization at the command line, no resource is more critical than the official guide to `ffmpeg`. I highly recommend the book **FFmpeg Basics** by Aurelien Derouineau. It provides an excellent, structured understanding of container formats, codecs, and, most importantly, the complex filter graphs (like the `palettegen`/`paletteuse` chain) that make advanced conversions possible. For any Linux enthusiast committed to terminal mastery, this book is an invaluable investment in understanding the media pipeline. [Amazon](https://www.amazon.com/FFmpeg-Basics-Multimedia-handling-encoder/dp/1479327832)

---

### Key Takeaways 📚
1.  💡 **GIFs Are Not Videos:** Never trust a single-pass, direct-to-GIF conversion. GIF's 256-color limit *demands* the two-pass `ffmpeg` optimization process (`palettegen` -> `paletteuse`) for professional quality and minimal size.
2.  ⚙️ **Tool Specificity is King:** On Wayland/Sway, abandon X11 tools like `byzanz` or `x11grab`. The correct, modern terminal stack is **`wf-recorder`** for capturing and **`slurp`** for region selection.
3.  📚 **Automate the Complex:** Even when using advanced terminal tools, complexity should be hidden. Wrapping the multi-step capture, palette generation, and final conversion into a single, clean Bash script (`waygif`) transforms a tedious task into a one-command solution.

---

### Thanks for Following ☕
☕ If you found this guide helpful, you can [Buy Me a Coffee](https://buymeacoffee.com/orioninsist)!
[Medium](https://orioninsist.medium.com/subscribe)
[Etsy](https://www.etsy.com/shop/orioninsist)
[LinkedIn](https://www.linkedin.com/company/orioninsist/)
[Read More](https://orioninsist.org/blog/ditch-the-gui-mastering-pipewire-audio-in-arch-cli/)

> What is the most complex video filter chain you've successfully automated in a single shell script?