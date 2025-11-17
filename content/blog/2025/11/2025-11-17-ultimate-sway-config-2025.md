+++

date = 2025-11-17T22:01:01+03:00
publishDate = 2025-11-17T22:01:01+03:00
lastmod = 2025-11-17T22:01:01+03:00
ShowReadingTime = true
ShowToc = true
TocOpen = true
ShowBreadCrumbs = true # PaperMod setting for navigation [36]
ShowPostNavLinks = true # PaperMod setting for post navigation [36]
ShowShareButtons = true # PaperMod setting to show share buttons [36]
ShowCodeCopyButtons = true # PaperMod setting for code copy buttons [36]
ShowWordCount = true # PaperMod setting to show word count [36]


draft = false 


author = "Murat Kurkoglu"
title = "The Ultimate Sway Config for a Fast and Stable Wayland Setup (2025 Edition)"
seo_title = "Sway Config Performance Guide for Wayland (2025)"
description = "A complete, production-grade Sway configuration optimized for performance, stability, and minimalism on Wayland. Includes best practices, recommended packages, environment variables, and a full ready-to-use config."
slug = "ultimate-sway-config-2025"
summary = "A fully optimized Sway configuration guide for fast, stable, and minimal Wayland setups, including essential packages, environment variables, and a complete config file."
series = ["Sway Wayland Performance Series"]
categories = ["Linux", "Wayland", "Sway", "Configuration"]
tags = ["sway", "wayland", "sway config", "linux", "performance", "intel gpu", "arch linux", "window manager"]

[cover]
    image = "images/blog/2025/11/2025-11-17-ultimate-sway-config-2025-watermarked.avif"
    alt = "Minimalistic flat illustration representing Sway configuration on Wayland"
    relative = true
+++

## Introduction

Sway is one of the fastest, leanest, and most reliable window managers on Linux.  
But to unlock its **full potential**, especially on **Wayland**, you need a carefully designed configuration that balances:

- performance  
- stability  
- responsiveness  
- minimal resource usage  
- dual monitor correctness  
- Wayland-native tooling  

If you're running Sway with **Intel integrated graphics**, **16GB RAM**, and **Full HD dual monitors**, a well-optimized configuration file becomes even more important.

This guide delivers exactly that.

Welcome to the **Ultimate Sway Config for 2025** — a production-grade setup built for developers, power users, and performance-oriented Linux enthusiasts.

This is **Part 2** of the Sway + Wayland optimization series.

---

# 1. Why Configuration Matters More on Sway Than GNOME/KDE

GNOME and KDE ship with pre-tuned defaults.  
Sway does **not**.

This is both a blessing and a responsibility.

### ✔ No unnecessary background services  
Sway runs almost nothing unless you configure it.

### ✔ You define the performance envelope  
Everything from animation timing to GPU usage depends on settings in:

- your sway/config  
- your environment variables  
- your compositor flags  
- your monitor definitions  
- your input device settings  

### ✔ Performance tuning = configuration tuning  
A good Sway config can feel as responsive as i3, but smoother and more modern thanks to Wayland.

---

# 2. Essential Wayland-Native Packages (Install These First)

Before building the config, install the full ecosystem:

~~~bash
sudo pacman -S --needed \
sway \
swaybg \
swayidle \
swaylock \
waybar \
foot \
grim \
slurp \
wl-copy wl-clipboard \
mako \
kanshi \
gammastep \
playerctl \
xdg-desktop-portal-wlr \
pipewire \
wireplumber \
pavucontrol \
polkit-gnome
~~~

### Why these matter:

| Package | Role |
|--------|------|
| swaybg | Fast, stable background renderer |
| swayidle/swaylock | Power management + lock screen |
| foot | Wayland-native terminal (fastest option) |
| grim/slurp | Screenshots |
| wl-copy | Clipboard (mandatory) |
| mako | Notifications |
| kanshi | Auto monitor profiles |
| pipewire/wireplumber | Best audio stack for Wayland |
| gammastep | Wayland-native redshift alternative |
| xdg-desktop-portal-wlr | Screensharing (browser + OBS) |

---

# 3. Wayland Rendering Environment (Very Important)

Create or edit:

~~~bash
sudo nano /etc/environment
~~~

Add:

```
WLR_DRM_NO_MODIFIERS=1
WLR_RENDERER=vulkan
XDG_CURRENT_DESKTOP=sway
MOZ_ENABLE_WAYLAND=1
QT_QPA_PLATFORM=wayland
CLUTTER_BACKEND=wayland
SDL_VIDEODRIVER=wayland
```

These ensure:

- Vulkan rendering path  
- Firefox, Qt apps, Electron apps use Wayland  
- No legacy X11 compatibility paths  
- No unstable DRM modifier formats  

---

# 4. The Ultimate Sway Config (2025 Version)

Create:

~~~bash
mkdir -p ~/.config/sway
nano ~/.config/sway/config
~~~

Paste this **fully optimized config**:

```
# ============================================================
#  SWAY CONFIG — 2025 PERFORMANCE & STABILITY EDITION
# ============================================================

# ------------------------------------------------------------
# 1. Environment Basics
# ------------------------------------------------------------
set $mod Mod4
set $term foot
set $menu wofi --show drun

# ------------------------------------------------------------
# 2. Performance Tweaks
# ------------------------------------------------------------
damage tracking incremental
focus_follows_mouse yes
default_border pixel
default_floating_border pixel
unfocused_floating_opacity 0.95

output * render_direct_scanout on
output * adaptive_sync on
output * max_render_time 6

# ------------------------------------------------------------
# 3. Monitors (example for dual 1080p)
# ------------------------------------------------------------
output HDMI-A-1 resolution 1920x1080 position 0,0 scale 1
output eDP-1     resolution 1920x1080 position 1920,0 scale 1

# Lock scaling
output * scale_filter nearest

# ------------------------------------------------------------
# 4. Input Devices
# ------------------------------------------------------------
input * {
    xkb_options caps:escape
    repeat_delay 200
    repeat_rate 60
}

# ------------------------------------------------------------
# 5. Keybindings
# ------------------------------------------------------------
bindsym $mod+Return exec $term
bindsym $mod+d exec $menu
bindsym $mod+Shift+e exec "swaynag -t warning -m 'Exit Sway?' -b 'Yes' 'swaymsg exit'"

# Workspaces
bindsym $mod+1 workspace number 1
bindsym $mod+2 workspace number 2
bindsym $mod+3 workspace number 3
bindsym $mod+4 workspace number 4
bindsym $mod+5 workspace number 5

# Resizing
bindsym $mod+Ctrl+h resize shrink width 20px
bindsym $mod+Ctrl+l resize grow width 20px
bindsym $mod+Ctrl+j resize shrink height 20px
bindsym $mod+Ctrl+k resize grow height 20px

# ------------------------------------------------------------
# 6. Autostart
# ------------------------------------------------------------
exec_always swaybg -i ~/Pictures/wallpaper.png -m fill
exec_always waybar
exec_always mako
exec_always kanshi
exec_always gammastep -l manual -t 6500:3500
exec_always wl-paste --type text --watch cliphist store
exec_always wl-paste --type image --watch cliphist store

# ------------------------------------------------------------
# 7. Idle / Lock
# ------------------------------------------------------------
exec_always swayidle -w \
    timeout 600 'swaylock -f' \
    timeout 1200 'systemctl suspend'

# ------------------------------------------------------------
# 8. Scratchpads (Useful for Devs)
# ------------------------------------------------------------
for_window [title="scratchpad-term"] move to scratchpad
bindsym $mod+minus scratchpad show

# ------------------------------------------------------------
# 9. Notifications
# ------------------------------------------------------------
exec_always mako

# ------------------------------------------------------------
# END OF FILE
# ------------------------------------------------------------
```

This configuration is:

- fast  
- stable  
- fully Wayland-native  
- no GPU-heavy effects  
- dual-monitor friendly  
- optimized for Intel iGPU  
- developer-oriented  

---

# 5. Why This Config Is Extremely Fast

### ✔ No heavy animations  
Sway has no animations → zero overhead.

### ✔ Incremental damage tracking  
Only changed areas are repainted.

### ✔ Direct scanout  
Your GPU bypasses the compositor whenever possible.

### ✔ No blur, shadows, transparency  
Each of these kills Intel GPU performance.

### ✔ Vulkan renderer + no modifiers  
This eliminates micro stutter.

---

# 6. Recommended Status Bar (Waybar)

Waybar is:

- lightweight  
- Wayland-native  
- extremely customizable  

Install:

~~~bash
sudo pacman -S waybar
~~~

Create config:

~~~bash
mkdir -p ~/.config/waybar
nano ~/.config/waybar/config
~~~

Add a simple minimal setup:

```json
{
    "layer": "top",
    "position": "top",
    "modules-left": ["sway/workspaces"],
    "modules-center": ["clock"],
    "modules-right": ["memory", "cpu", "network", "pulseaudio", "battery"]
}
```

---

# ⭐ Amazon Product Recommendation (AdSense Friendly)

A strong Sway environment deserves a **precise, responsive, quiet mouse**.  
The **Logitech M650 L** is a great fit because:

- extremely smooth cursor movement  
- silent switches  
- perfect for long coding sessions  
- works flawlessly on Linux  
- excellent battery life  

Ideal for a minimal Wayland workflow.

**If you’d like to check the product, here is the link:**  
[Amazon — Insert your link here](https://www.amazon.com/Logitech-Signature-M650-Wireless-Mouse/dp/B09KX9P829?th=1)

---

# 7. Autostart Recommendations

Your Sway config should start only what is essential.

Recommended:

- waybar  
- mako  
- kanshi  
- gammastep  
- clipboard watcher  
- swayidle + swaylock  

Avoid heavy apps at startup.  
The whole point of Sway is **minimal cold-start overhead**.

---

# 8. Developer Workflow Integration

This config is perfect for:

### ✔ Neovim  
Super fast — zero compositor overhead.

### ✔ VSCode (Wayland mode)  
Launch with:

~~~bash
code --enable-features=UseOzonePlatform --ozone-platform=wayland
~~~

### ✔ tmux  
Terminal-native → fastest possible combination.

### ✔ Browsers  
Use Wayland flags:

- Firefox: enabled automatically  
- Chrome/Chromium:  
  ~~~bash
  chromium --enable-features=WaylandWindowDecorations --ozone-platform=wayland
  ~~~

---

# Conclusion

This Sway configuration is built for:

- speed  
- stability  
- clean layout  
- predictable behavior  
- Intel iGPU optimization  
- dual monitor setups  
- Wayland-native applications  

It’s a perfect starting point for a **modern, high-performance Linux workstation**.

Up next:  
**Part 3 — Essential Wayland Tools for a Rock-Solid Sway Workflow**

