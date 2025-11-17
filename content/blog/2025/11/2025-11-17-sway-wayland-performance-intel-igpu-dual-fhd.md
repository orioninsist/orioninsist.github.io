+++

date = 2025-11-17T20:49:58+03:00
publishDate = 2025-11-17T20:49:58+03:00
lastmod = 2025-11-17T20:49:58+03:00
ShowReadingTime = true
ShowToc = true
TocOpen = true
ShowBreadCrumbs = true # PaperMod setting for navigation [36]
ShowPostNavLinks = true # PaperMod setting for post navigation [36]
ShowShareButtons = true # PaperMod setting to show share buttons [36]
ShowCodeCopyButtons = true # PaperMod setting for code copy buttons [36]
ShowWordCount = true # PaperMod setting to show word count [36]


draft = false 

title = "Optimize Sway on Wayland for Maximum Performance on Intel iGPU (Dual Full HD Setup)"
seo_title = "Sway Wayland Performance Guide for Intel iGPU (Dual FHD)"
description = "A complete, high-precision performance optimization guide for Sway on Wayland using Intel integrated graphics, dual Full HD monitors, Mesa tuning, tear-free rendering, kernel parameters, and advanced compositor tweaks."
slug = "sway-wayland-performance-intel-igpu-dual-fhd"
keywords = ["sway", "wayland", "intel gpu", "mesa", "linux performance", "sway config", "i915", "dual monitor", "arch linux", "wayland optimization"]
author = "Murat Kurkoglu"


summary = "A deep performance optimization guide for Sway on Wayland using Intel integrated graphics with a dual Full HD monitor setup."
series = ["Sway Wayland Performance Series"]
categories = ["Linux", "Wayland", "Sway", "Performance"]
tags = ["sway", "wayland", "intel gpu", "mesa", "linux performance", "dual monitor", "i915", "arch linux"]

[cover]
    image = "images/blog/2025/11/2025-11-17-sway-wayland-performance-intel-igpu-dual-fhd-watermarked.avif"
    alt = "Minimalistic Sway Wayland performance illustration"
    relative = true
+++    


## Introduction

If you're running **Sway on Wayland** with an **Intel integrated GPU**, **16GB RAM**, and a **dual Full HD (1920×1080) monitor setup**, you’re working with one of the most efficient, modern, and resource-friendly Linux environments possible.

But even with this optimal hardware and compositor combination, many users still experience:

- micro-stuttering  
- tearing  
- cursor latency  
- slow workspace transitions  
- high CPU usage on dual monitors  
- unstable frame pacing  
- poor video playback smoothness  

This guide solves all of that.

Welcome to the **definitive Sway + Wayland performance manual** — specifically tailored for:

- Intel UHD / Iris iGPUs  
- dual-monitor users  
- Arch Linux & derivative distros  
- Wayland-native workflows  
- lightweight, ultra-stable setups  

This is **Part 1** of a 3-part series, focused ONLY on **raw compositor + GPU performance**.

---

# 1. Understanding the Wayland + Sway Rendering Pipeline

Before optimizing anything, you must understand how Sway, Wayland, and Intel drivers cooperate.

### ✔ Sway does NOT repaint the whole screen  
Wayland compositors repaint **only the changed regions**.  
This is why Sway feels faster than GNOME/KDE on Intel hardware.

### ✔ Intel iGPU uses a tile-based architecture  
Meaning:  
Its real strength is **bandwidth efficiency and parallelism**, not raw power.

### ✔ Two Full HD monitors = 2X compositor workload  
3840×1080 total space  
→ requires careful tuning of:

- Mesa  
- i915 driver  
- kernel parameters  
- Sway configuration  

This guide optimizes all three layers.

---

# 2. Install All Essential Packages for Performance

These packages ensure GPU acceleration, decoding, and presentation stability.

~~~bash
sudo pacman -S --needed \
mesa \
mesa-utils \
mesa-vdpau \
vulkan-intel \
libva-intel-driver \
libvdpau-va-gl \
intel-media-driver \
ffmpeg \
qt6-wayland qt5-wayland \
libva-utils
~~~

### What each package fixes:

- **mesa + vulkan-intel** → core GPU acceleration  
- **intel-media-driver** → VAAPI hardware decoding  
- **libva-utils** → validation + debugging  
- **vdpau bridges** → stable video playback under Wayland  

---

# 3. Check Intel Hardware Acceleration

Verify GPU:

~~~bash
lspci | grep -i vga
~~~

Check VAAPI:

~~~bash
vainfo
~~~

Check Vulkan:

~~~bash
vulkaninfo | grep -i device
~~~

All of these must show **Intel**.

---

# 4. Critical Kernel Parameters (i915 Driver Optimization)

Edit GRUB:

~~~bash
sudo nano /etc/default/grub
~~~

Add to `GRUB_CMDLINE_LINUX_DEFAULT`:

```
i915.enable_fbc=1 i915.enable_psr=1 i915.fastboot=1 i915.enable_guc=3
```

### Explanation:

| Parameter | Benefit |
|----------|---------|
| `enable_fbc=1` | Framebuffer compression → lower VRAM usage |
| `enable_psr=1` | Panel Self Refresh → smoother animations |
| `fastboot=1` | Faster startup, better initial frame pacing |
| `enable_guc=3` | Required for newer Intel power management + scheduling |

Apply:

~~~bash
sudo grub-mkconfig -o /boot/grub/grub.cfg
~~~

Reboot.

---

# 5. Sway Performance Environment Variables (Essential)

Create:

~~~bash
sudo nano /etc/environment
~~~

Add:

```
WLR_DRM_NO_MODIFIERS=1
WLR_RENDERER=vulkan
WLR_NO_HARDWARE_CURSORS=1
```

### Why?

- **NO_MODIFIERS=1** → Removes unstable tiling formats → stutter disappears  
- **Vulkan renderer** → More efficient than GLES  
- **NO_HARDWARE_CURSORS=1** → GPU cursor flicker / lag fixes  

Reboot after changes.

---

# 6. Sway Config Performance Block

Open:

~~~bash
nano ~/.config/sway/config
~~~

Add this block at the top:

```
# Performance Boost Block
unfocused_floating_opacity 0.95
default_border pixel
default_floating_border pixel
focus_follows_mouse yes

# Rendering
output * render_direct_scanout on
output * adaptive_sync on
output * max_render_time 6

# Input latency improvements
seat * repeat_delay 200
seat * repeat_rate 60

# Damage tracking (super critical)
damage tracking incremental
```

### Key improvements:

- **pixel borders** → faster repaints  
- **direct scanout** → reduces compositing overhead  
- **adaptive_sync** → prevents micro stutter  
- **max_render_time=6** → stable frame times  
- **incremental damage tracking** → avoids repainting both monitors  

---

# 7. Dual Monitor Optimization

List outputs:

~~~bash
swaymsg -t get_outputs
~~~

Then define each output:

Example:

```
output HDMI-A-1 resolution 1920x1080 position 0,0 scale 1
output eDP-1     resolution 1920x1080 position 1920,0 scale 1
```

**Rule:**  
Never use fractional scaling on Intel Wayland.  
→ it destroys GPU performance.

---

# 8. Fix Screen Tearing (Wayland Edition)

Wayland already prevents tearing — BUT Intel sometimes misbehaves.

Add to sway config:

```
output * max_render_time 6
output * adaptive_sync on
output * render_direct_scanout on
```

Also verify with:

~~~bash
sudo intel_gpu_top
~~~

GPU render ring must be stable.

---

# 9. VAAPI Video Playback Fix

Install:

~~~bash
sudo pacman -S mpv
~~~

Create:

~~~bash
nano ~/.config/mpv/mpv.conf
~~~

Add:

```
hwdec=vaapi
vo=gpu-next
gpu-api=vulkan
```

This gives:

- smoother video playback  
- reduced CPU load  
- stable frame pacing  

---

# 10. Power Management for Longer Battery & Lower Heat

Install:

~~~bash
sudo pacman -S tlp
sudo systemctl enable tlp --now
~~~

Add Intel power tuning:

```
sudo nano /etc/tlp.conf
```

Make sure:

```
CPU_ENERGY_PERF_POLICY_ON_AC=performance
CPU_ENERGY_PERF_POLICY_ON_BAT=power
```

---

# ⭐ AMAZON PRODUCT PICK (Relevant & Helpful)

While optimizing a lightweight Wayland desktop, a **silent, compact, high-quality wireless keyboard** dramatically improves the minimalist Sway workflow.  
One excellent option is the **Logitech MX Keys Mini**, known for:

- quiet laptop-style keys  
- reliable multi-device pairing  
- exceptional typing comfort  
- long battery life  
- ideal for clutter-free Wayland setups  

It's perfect if you're aiming for a **clean, distraction-free Sway environment**.

**If you’d like to check the product, here is the link:**  
[Amazon — Insert your link here](https://www.amazon.com/Logitech-Minimalist-Illuminated-Bluetooth-Compatible/dp/B098JPSVKY)

---

# 11. Swap & ZRAM Optimization (Intel iGPU Loves This)

Enable ZRAM:

~~~bash
sudo pacman -S zram-generator
~~~

Create:

~~~bash
sudo nano /etc/systemd/zram-generator.conf
~~~

Add:

```
[zram0]
zram-size = ram / 2
compression-algorithm = zstd
```

Enable:

~~~bash
sudo systemctl daemon-reload
sudo systemctl start /dev/zram0
~~~

---

# 12. Check Real-Time GPU Load for Tuning

Use intel GPU monitor:

~~~bash
sudo pacman -S intel-gpu-tools
sudo intel_gpu_top
~~~

Check:

- render busy %  
- power states  
- memory pressure  

This shows whether your changes fixed bottlenecks.

---

# 13. FINAL PERFORMANCE CHECKLIST

### ✔ Must Have
- Mesa + Vulkan + VAAPI stack  
- i915 driver tuning  
- Sway incremental damage  
- direct scanout  
- adaptive sync  
- NO fractional scaling  
- Vulkan renderer  
- ZRAM enabled  

### ✔ Should Have
- minimal Sway config  
- thin borders  
- no heavy background blurring  
- efficient video playback setup  

### ✔ Optional but Recommended
- tlp power tuning  
- lightweight apps (foot, kitty, mpv)  
- gammastep instead of redshift  
- PipeWire for audio stability  

---

# Conclusion

With the optimizations above, your Intel-powered Sway setup will run:

- smoother  
- cooler  
- faster  
- more stable  
- more responsive  
- more battery-efficient  

…and you’ll fully unlock the real potential of Wayland + Sway + Intel iGPU — even with **dual Full HD monitors**.

This is **Part 1** of the 3-part Wayland performance optimization series.  
Next:  
**“The Ultimate Sway Config (Part 2)”**
