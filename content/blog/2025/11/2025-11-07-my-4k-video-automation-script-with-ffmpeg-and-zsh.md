+++

date = 2025-11-07T22:34:47+03:00
publishDate = 2025-11-07T22:34:47+03:00
lastmod = 2025-11-07T22:34:47+03:00
ShowReadingTime = true
ShowToc = true
TocOpen = true


draft = false 


title = "My 4K Video Automation Script with FFmpeg & Zsh"
author = "Murat Kurkoglu"
description = "Learn to automate your video workflow. This guide shows how to build a Bash script with FFmpeg to merge, 4K-upscale, and watermark vertical videos."
summary = "Learn to automate your video workflow. This guide shows how to build a Bash script with FFmpeg to merge, 4K-upscale, and watermark vertical videos."
slug = "my-4k-video-automation-script-with-ffmpeg-and-zsh"
keywords = ["ffmpeg", "bash", "zsh", "automation", "video"]
tags = ["ffmpeg", "bash", "automation"]
categories = ["Linux"]
series = ["Automation Scripts"]
[cover]
    image = "images/blog/2025/11/2025-11-07-my-4k-video-automation-script-with-ffmpeg-and-zsh-watermarked.avif"
    alt = "A Bash script for FFmpeg 4K video upscaling, merging, and watermarking is displayed in a terminal window."
+++

**My 4K Video Automation Script with FFmpeg & Zsh**
**Stop wasting hours in video editors. Let's build a single command to merge, 4K-upscale, and watermark all your videos in seconds.**

---

👋 Hey everyone,

This week, I fell down the rabbit hole of AI-generated video. I’ve been creating dozens of small, 5-10 second clips for YouTube Shorts and Instagram Reels. The process is fun, but the "post-production" was killing me. I had a folder full of `clip_01.mp4`, `clip_02.mp4`, etc., and my workflow looked like this:

1.  Open a GUI video editor (like Kdenlive or DaVinci Resolve).
2.  Wait for it to load.
3.  Import all 10... 20... 30 clips.
4.  Drag them onto a timeline in the correct order.
5.  Add my "Orioninsist" watermark text.
6.  Go to the render settings.
7.  Set the resolution to 4K (2160x3840 for vertical video).
8.  Set the codec, quality, and bitrate.
9.  Click "Render" and wait.
10. Realize I missed a clip.
11. Repeat.

This was tedious, error-prone, and, as a terminal lover, felt *wrong*. I live in Arch Linux, I use Sway, and my primary tools are Neovim and Zsh. There had to be a way to automate this.

---

### My Goal This Week 🎯
My mission was clear: create a single, reusable terminal command that could do all of that work for me.

I wanted to be able to `cd` into a directory of videos and type something like:

`merge4k clip_*.mp4 final_video.mp4`

And have it spit out a single, 4K, watermarked video file, ready for upload. No GUI, no dragging and dropping, no "Render" button. Just pure, unadulterated command-line power.

---

### The Process & The Code 👨‍💻
The obvious tool for this job is **FFmpeg**. It's the Swiss Army knife of media manipulation, but its syntax can be incredibly cryptic. My final script is the result of hours of digging through documentation and stack overflow posts.

First, I decided *not* to make this a Zsh function in my `.zshrc`. Why? Because my dotfiles are sacred. I prefer to keep my configuration clean and place my scripts in a dedicated `bin` folder (like `/home/murat/orion/10_projects/01-project-dotfiles/bin`), which is already in my `$PATH`. This makes them portable, easy to edit, and keeps my `.zshrc` from becoming a 1000-line monster.

So, I created a new file: `~/orion/10_projects/01-project-dotfiles/bin/merge4k`

Here is the complete Bash script. I'll break down every single line below.

~~~bash
#!/bin/bash
#
# merge4k: A script to merge multiple videos, upscale to 4K (2160x3840),
#          and add a professional "Orioninsist" watermark.
#

# --- 1. Validation ---
# First, check if ffmpeg is even installed.
if ! command -v ffmpeg &> /dev/null; then
  echo "Hata: ffmpeg kurulu değil."
  echo "Lütfen 'sudo pacman -S ffmpeg' ile kurun."
  exit 1
fi

# Check if we have enough arguments. We need at least
# one input file and one output file (total 2 arguments).
if [ "$#" -lt 2 ]; then
  echo "Kullanım: merge4k [girdi_1.mp4] [girdi_2.mp4] ... [cikti_dosyasi.mp4]"
  echo "Örnek:   merge4k video*.mp4 final_4k_filigranli.mp4"
  exit 1
fi

# --- 2. Argument Handling ---
# The magic of Bash parameter expansion.
# "${@: -1}" grabs the very last argument.
OUTPUT_FILE="${@: -1}"

# "${@:1:$#-1}" grabs everything from the first argument
# up to the second-to-last one.
INPUT_FILES=("${@:1:$#-1}")

# --- 3. The Concat Problem ---
# You can't just 'cat' videos together. FFmpeg needs a special
# list file to merge them safely, especially if they have
# slightly different encodings or metadata.
# We create a secure temporary file.
LIST_FILE=$(mktemp)

# 'trap' is a lifesaver. It ensures this command runs
# when the script EXITS, whether it succeeds or fails.
# This cleans up our temp file so it's not left behind.
trap 'rm -f "$LIST_FILE"' EXIT

echo "Videolar hazırlanıyor..."
for video in "${INPUT_FILES[@]}"; do
  # We write "file '/path/to/video.mp4'" to the temp file.
  # 'realpath' converts relative paths (like video1.mp4)
  # to absolute paths (like /home/murat/videos/video1.mp4),
  # which makes ffmpeg's '-safe 0' flag happy.
  echo "file '$(realpath "$video")'" >> "$LIST_FILE"
done

# --- 4. The FFmpeg Command ---
echo "İşlem başlıyor: Birleştirme, 4K Yükseltme ve Filigran Ekleme..."
echo "Çıktı Dosyası: $OUTPUT_FILE"

ffmpeg -f concat -safe 0 -i "$LIST_FILE" \
       -vf "scale=2160:3840:flags=lanczos, \
            drawtext=text='Orioninsist':fontcolor=white:fontsize=80:x=(w-text_w)/2:y=h-th-50:alpha=0.7" \
       -c:v libx264 -preset slow -crf 18 \
       -c:a aac -b:a 192k \
       "$OUTPUT_FILE"

# --- 5. Success or Failure ---
if [ $? -eq 0 ]; then
  echo "🎉 İşlem başarıyla tamamlandı: $OUTPUT_FILE"
else
  echo "❌ Hata: ffmpeg işlemi başarısız oldu."
  exit 1
fi

exit 0
~~~

After saving this file, I had to make it executable:
`chmod +x ~/orion/10_projects/01-project-dotfiles/bin/merge4k`

And finally, to make it super easy to call, I added a simple `alias` to my `~/.zshrc` file:
`alias merge4k='/home/murat/orion/10_projects/01-project-dotfiles/bin/merge4k'`

After a quick `source ~/.zshrc`, the command was live.

---

### Hitting The Wall 🧱
This script looks simple now, but it took me *hours* to perfect. The biggest challenge was, without a doubt, the `-vf` (video filter) flag.

FFmpeg's filter system is astonishingly powerful, but it's a nightmare to debug. My first problem was chaining filters. I knew how to `scale` a video and I knew how to `drawtext`, but how do you do both at the same time?

The answer is to separate them with a comma, all inside one giant string:
`-vf "scale=... , drawtext=..."`

My next "wall" was the watermark placement. The `drawtext` filter is a beast.
* **`x=(w-text_w)/2`**: This is the magic for horizontal centering. It means "take the video width (w), subtract the text's width (text_w), and divide by 2." This puts it perfectly in the middle.
* **`y=h-th-50`**: This places it vertically. "Take the video's height (h), subtract the text's height (th), and then move it up 50 more pixels." This anchors the text to the bottom with a 50px padding.
* **`alpha=0.7`**: This was the final touch. A solid white watermark is ugly and distracting. Setting the alpha (transparency) to `0.7` (or 70%) makes it look professional and subtle.

Finally, the quality settings.
* **`-preset slow`**: This tells the `libx264` encoder to take its time. A slower preset means better compression and higher quality for the same file size. For a final render, `slow` or `veryslow` is perfect.
* **`-crf 18`**: This is the Constant Rate Factor. It's a quality setting, not a bitrate. A lower number is higher quality. `18` is considered visually lossless or "production quality" for H.264.

---

### The Breakthrough Moment ✨
The real "Aha!" moment was seeing it all come together. I `cd`'d into a folder with 10 test clips. I ran my new command:

`merge4k *.mp4 4K_TEST.mp4`

My terminal lit up with the `ffmpeg` progress output. About 30 seconds later, it finished. I typed `mpv 4K_TEST.mp4`.

It was perfect. The clips were merged seamlessly. The video was crisp 4K. And right at the bottom, in beautiful, semi-transparent white, was my "Orioninsist" watermark.

I had condensed a 15-minute, mouse-heavy, frustrating process into a single 30-second command. This is why I love the terminal. It gives you the power to build your *own* tools, perfectly tailored to your workflow.

---

### 📚 Recommended Resource
If this script inspires you but the `ffmpeg` command looks like ancient hieroglyphs, you are not alone. The official documentation is dense. The one resource I wish I had from the start is a practical book.

I highly recommend the **"Quick Start Guide to FFmpeg" by V. Subhash**. It's an incredible resource that breaks down the complexity. It doesn't just list flags; it teaches you the *concepts* behind media containers, codecs, and, most importantly, the filtergraph system. It's the perfect guide for turning `ffmpeg` from a tool you fear into a tool you master.

[Amazon](https://www.amazon.com/Quick-Start-Guide-FFmpeg-Multimedia-Processing/dp/1484287002)

---

### Key Takeaways 📚
1.  💡 **Automate the Tedious.** If you do a repetitive task more than twice, write a script for it. The time you invest in building the tool will be paid back tenfold.
2.  ⚙️ **Embrace Specific Tools.** Don't try to force a Zsh function to do a complex script's job. Using a separate script file in your `bin` directory is cleaner, more portable, and easier to maintain.
3.  📚 **Don't Fear the Flags.** Tools like `ffmpeg` are deep, but you only need to learn a few flags to be incredibly productive. `scale`, `drawtext`, and `concat` can solve 90% of a content creator's problems.

---

### Thanks for Following ☕
☕ If you found this guide helpful, you can [Buy Me a Coffee](https://buymeacoffee.com/orioninsist)!
[Medium](https://orioninsist.medium.com/subscribe)
[Etsy](https://www.etsy.com/shop/orioninsist)
[LinkedIn](https://www.linkedin.com/company/orioninsist/)
[Read More](https://orioninsist.org/blog/my-arch-sway-workflow-pwa-keybindings/)

> What's one repetitive task in your workflow that you could automate with a shell script?