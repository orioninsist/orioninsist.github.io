+++
date = 2025-12-02T12:28:57+03:00
publishDate = 2025-12-02T12:28:57+03:00
lastmod = 2025-12-02T12:28:57+03:00
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


title = "Creating a Professional Favicon Pipeline on Arch Linux"
description = "How I built a clean, reliable favicon workflow using ImageMagick, OptiPNG, and Hugo PaperMod on Arch Linux."
summary = "A practical, experience-driven guide to generating perfect favicons using ImageMagick, OptiPNG, and Hugo PaperMod."
slug = "favicon-pipeline-arch-linux-imagemagick"
keywords = ["favicon","arch linux","imagemagick","hugo","papermod","linux workflow"]
series = ["linux-dev-tools"]
categories = ["Linux"]
tags = ["linux","hugo","papermod","developer-tools"]
[cover]
    image = "images/blog/2025/12/25-12-02-favicon-pipeline-arch-linux-imagemagick.avif"
    alt = "A minimalist illustration of a Linux terminal generating multiple favicon sizes"
    relative = true
+++

## Creating a Professional Favicon Pipeline on Arch Linux (orioninsist Method)

I never expected that something as small as a 16×16 icon could break the visual consistency of an entire website, but it did. It bothered me enough that I finally sat down and built a complete, reliable favicon workflow on Arch Linux—one that produces perfect PNGs, Apple icons, and a multi-size ICO file that works everywhere.  

This guide comes from real trial-and-error. Every line is based on commands I actually run on my own Hugo PaperMod setup.

---

## Why I Needed a Real Favicon Workflow
I’ve used Linux long enough to know that simple things break when you rely on shortcuts. A favicon seems trivial, but browser inconsistencies, compression issues, manifest icons, and Apple Touch requirements make it surprisingly easy to get wrong.

I wanted a single workflow that produced:

- Clean, optimized PNGs  
- A single ICO file with multiple sizes  
- Output compatible with modern browsers, older browsers, and mobile devices  
- Files that Hugo and PaperMod can pick up automatically  

So I turned my Arch Linux tools—ImageMagick and OptiPNG—into a reliable mini-pipeline.

---

## Install the Required Tools
On Arch Linux it takes only a second to get the essentials:

```bash
sudo pacman -S imagemagick optipng
```

- **ImageMagick** handles resizing, centering, and transparent backgrounds.  
- **OptiPNG** makes sure everything stays lightweight without losing quality.

---

## The 512×512 Master Favicon
This is the most important size. Modern browsers look for it first, and it acts as the foundation for everything else.

```bash
magick logo.png \
  -resize 512x512 \
  -gravity center \
  -background none \
  -extent 512x512 \
  -define png:compression-level=9 \
  -define png:compression-filter=5 \
  favicon-512.png

optipng -o7 favicon-512.png
```

I always start from a vector or a high-resolution PNG to avoid edge artifacts.

---

## The 192×192 Icon (Android / Chrome)
Android Chrome and web app manifests both refer to this size. Without it, your site looks incomplete on mobile.

```bash
magick logo.png \
  -resize 192x192 \
  -gravity center \
  -background none \
  -extent 192x192 \
  -define png:compression-level=9 \
  -define png:compression-filter=5 \
  favicon-192.png

optipng -o7 favicon-192.png
```

---

## Apple Touch Icon (180×180)
Safari and iOS use this for the home-screen shortcut. If you skip it, Apple devices will try to upscale your smaller favicon—and it never looks clean.

```bash
magick logo.png \
  -resize 180x180 \
  -gravity center \
  -background none \
  -extent 180x180 \
  apple-touch-icon.png

optipng -o7 apple-touch-icon.png
```

---

## 16×16 — The Tiny One
This one still matters. It’s the classic browser tab icon and gets rendered everywhere.

```bash
magick logo.png \
  -resize 16x16 \
  -gravity center \
  -background none \
  -extent 16x16 \
  -define png:compression-level=9 \
  -define png:compression-filter=5 \
  favicon-16.png

optipng -o7 favicon-16.png
```

---

## A Professional Multi-Size ICO (16→256 px)
The ICO format is old, but still required for Windows and many desktop browsers. I prefer generating all sizes inside one file.

These are the included dimensions:  
**16, 24, 32, 48, 64, 128, 256**

```bash
magick logo.png \
  \( -clone 0 -resize 16x16  -extent 16x16 \) \
  \( -clone 0 -resize 24x24  -extent 24x24 \) \
  \( -clone 0 -resize 32x32  -extent 32x32 \) \
  \( -clone 0 -resize 48x48  -extent 48x48 \) \
  \( -clone 0 -resize 64x64  -extent 64x64 \) \
  \( -clone 0 -resize 128x128 -extent 128x128 \) \
  \( -clone 0 -resize 256x256 -extent 256x256 \) \
  -delete 0 \
  -gravity center \
  -background none \
  favicon.ico
```

You can verify everything quickly:

```bash
mediainfo favicon.ico
```

---

### Hugo + PaperMod Integration
Once the icons are generated, Hugo makes the process simple. Just drop them in:

```
/your-hugo-site/static/
```

For example:

```bash
cp favicon.ico /path/to/hugo-site/static/favicon.ico
cp favicon-512.png /path/to/hugo-site/static/favicon.png
cp favicon-192.png /path/to/hugo-site/static/favicon-192.png
cp apple-touch-icon.png /path/to/hugo-site/static/apple-touch-icon.png
```

PaperMod automatically detects these.  
If you prefer explicit config:

```toml
[params.assets]
  favicon = "favicon.png"
  favicon16 = "favicon-16.png"
  favicon32 = "favicon.ico"
  favicon192 = "favicon-192.png"
  apple_touch_icon = "apple-touch-icon.png"
```

---

### My Recommended Minimal Set
After trying many combinations, I settled on a clean, long-term set that works everywhere:

- `favicon.ico`  
- `favicon.png` (512×512)  
- `favicon-192.png`  
- `apple-touch-icon.png`  

This covers modern browsers, legacy environments, mobile devices, and iOS home-screen icons.

---

### Final Thoughts
A small icon shouldn’t break the identity of a website. By turning this into a repeatable Linux workflow, I never worry about favicon quality again. Everything is versioned, predictable, and integrated directly into my Hugo + PaperMod workflow.

If you're building your own developer blog or portfolio, a clean favicon pipeline is one of those small details that makes the whole experience feel complete.

> If you enjoyed this article, consider subscribing for future posts. 
https://orioninsist.medium.com/subscribe
---