+++

date = 2025-11-08T12:56:33+03:00
publishDate = 2025-11-08T12:56:33+03:00
lastmod = 2025-11-08T12:56:33+03:00
ShowReadingTime = true
ShowToc = true
TocOpen = true



draft = false 


title = "Optimized Foot Config for Sway/Wayland Devs"
author = "Murat Kurkoglu"
description = "My complete, optimized foot.ini config for Sway/Wayland. Learn how to get the perfect minimalist terminal with JetBrains Mono, Dracula, and CSD disabled."
summary = "My complete, optimized foot.ini config for Sway/Wayland. Learn how to get the perfect minimalist terminal with JetBrains Mono, Dracula, and CSD disabled."
slug = "optimized-foot-config-for-sway-wayland"
keywords = ["Wayland", "Sway", "Foot Terminal", "Arch Linux", "Dotfiles", "Linux Configuration"]
tags = ["Wayland", "Sway", "Foot"]
categories = ["Linux"]
series = ["Dotfiles"]
[cover]
    image = "images/blog/2025/11/2025-11-08-optimized-foot-config-for-sway-wayland-watermarked.avif"
    alt = "A clear screenshot of the foot.ini configuration file, showing the [main], [csd], and [colors] sections with the Dracula theme and JetBrains Mono Nerd Font."
+++

**Optimized Foot Config for Sway/Wayland Devs**
**This isn't just a config file; it's a philosophy for a minimalist, native Wayland environment.**

---

👋 Hey everyone,

If you've been following my journey, you know I live in the terminal. I run Arch Linux with the Sway window manager, which means I've completely bought into the Wayland ecosystem. I've abandoned traditional desktop environments like GNOME or KDE in favor of a fast, keyboard-driven, and minimalist setup. But this philosophy creates a new challenge: finding tools that integrate *perfectly* with it.

The terminal emulator is the centerpiece of this entire workflow. It's my IDE, my file manager, my system monitor, and my writing tool. For a long time, the debate was dominated by giants like Alacritty and Kitty. Both are fantastic, GPU-accelerated terminals.

But I kept running into a small, philosophical friction. Alacritty is great, but it doesn't have a daemon mode, meaning every new window is a new process. Kitty is feature-rich, but it includes its *own* window management (tabs, splits), which is redundant when the entire *point* of Sway is to manage your windows for you.

Then I found **Foot**.

Foot is different. It's built from the ground up *for* Wayland. It's incredibly lightweight, starts instantly, and, most importantly, has a daemon (server) mode. This means I can launch one instance in the background and every subsequent terminal I open is just a new client, consuming almost no additional RAM. It’s the minimalist dream.

But getting it configured *just right* took some serious trial and error.

---

### My Goal This Week 🎯

My goal was to create the "perfect" `foot.ini`. This meant it had to satisfy several strict requirements:

1.  **Seamless Sway Integration:** It absolutely *must* let Sway control all window decorations. No double title bars, no weird borders.
2.  **Aesthetic Perfection:** It needed to look beautiful. This meant integrating my favorite font (JetBrainsMono Nerd Font) and my go-to color scheme (Dracula).
3.  **High Functionality:** It needed practical features for a developer, like a large scrollback buffer for reading logs and sensible padding for "breathing room."
4.  **Stability:** It had to be 100% error-free. My previous attempts were littered with `deprecated` warnings and errors from copying configs from newer versions. This one had to be clean.

I wanted a terminal that felt less like an *application* running on my OS and more like a *native part* of the OS itself.

---

### The Process & The Code 👨‍💻

After hours of reading the `man 5 foot.ini` pages, cross-referencing with my older, broken configs, and testing every single line, I landed on this file. This is my complete, stable, and optimized `foot.ini`, which I store in `~/.config/foot/foot.ini`.

Here is the final file in its entirety, followed by a detailed, line-by-line breakdown of *why* each choice was made.

~~~ini
# ===========================================================
#  foot configuration — SWAY/WAYLAND UYUMLU VE HATASIZ SÜRÜM
#  Sürüm uyumluluğu için hatalı ve 'deprecated' ayarlar silindi.
# ===========================================================

[main]
# Font ve DPI (Ayarlarınız korundu)
font=JetBrainsMono Nerd Font:size=12
dpi-aware=yes

# Terminal davranışı
term=xterm-256color
shell=/bin/zsh
app-id=foot
title=foot terminal

# Pencere içi kenar boşlukları (padding)
pad=8x8

# Artık [main] bölümünde olmayan ayarlar, bu nedenle silindi:
# scrollback-lines (artık [scrollback] altında)
# notify-on-focus-lost (silindi, ayarı bulunmuyor)

# === SCROLLBACK (Geri Kaydırma) ===
[scrollback]
# Kaydırma tamponu satır sayısı (Hata verdiği için buraya taşınmıştır)
lines=10000

# === SWAY ENTEGRASYONU ===
[csd]
# Sway kullanıcısı için en önemli ayar: Pencere yönetimini Sway'e bırakır.
preferred=none

# === İMLEÇ (CURSOR) ===
[cursor]
# İmleç stili (Hata verdiği için 'color' ayarı [colors] altına taşındı)
style=beam
blink=yes

# === FARE (MOUSE) ===
[mouse]
# Hata verdiği için 'paste-on-middle-click' ayarı silindi.
# Bu özellik genellikle varsayılan olarak zaten açıktır.

# === KISAYOLLAR (KEY BINDINGS) ===
[key-bindings]
# 'copy' ve 'paste' komutları hata verdiği için silindi.
# Alternatif olarak 'keyboard-quit' ve 'search-start' gibi desteklenen komutlar kullanılabilir.
# Genellikle Sway ortamında kısayollar (Ctrl+C, Ctrl+V hariç) pencere yöneticisi tarafından yapılır.

# Hata veren satırlar (copy, paste, zoom-in/out) kaldırıldı.
# Desteklediği kesin olan bir örnek kısayol:
# search-start=Control+r

# === RENKLER ===
[colors]
# Hata veren 'cursor.color' yerine, doğru adlandırma olan 'cursor' kullanıldı.
# Dracula renk teması:
foreground=F8F8F2
background=282A36
cursor=8C8C8C FFFFFF # İmleç rengi (foreground ve background)

regular0=000000  # black
regular1=FF5555  # red
regular2=50FA7B  # green
regular3=F1FA8C  # yellow
regular4=BD93F9  # blue
regular5=FF79C6  # magenta
regular6=8BE9FD  # cyan
regular7=BFBFBF  # white
bright0=545454   # bright black
bright1=FF6E67   # bright red
bright2=5AF78E   # bright green
bright3=F4F99D   # bright yellow
bright4=CAA9FA   # bright blue
bright5=FF92D0   # bright magenta
bright6=9AEDFE   # bright cyan
bright7=FFFFFF   # bright white

# Seçim (selection) renkleri
selection-foreground=F8F8F2
selection-background=44475A
~~~

#### Code Breakdown: Section by Section

Let's dig into *why* this config works so well.

**`[main]` Section**

This is the control center for the terminal's core behavior.

* `font=JetBrainsMono Nerd Font:size=12`: This is more than just a font choice.
    * **`JetBrainsMono`**: It's a font designed for developers, with clear distinctions between characters like '0' (zero) and 'O' (letter O), or '1' (one) and 'l' (letter L).
    * **`Nerd Font`**: This is the critical part. I use tools like `lsd` (a modern `ls`), `zsh` with Powerlevel10k, and `ranger`. These tools use icons (like folder icons , file icons , Git branch icons ). A Nerd Font patches popular fonts with thousands of these glyphs. Without it, my terminal would be full of broken "missing character" boxes.
    * **`size=12`**: This is a personal preference, balancing readability on my 1080p external monitor without making things feel too "clownish."
* `dpi-aware=yes`: A simple but crucial line for high-resolution screens. It tells Foot to respect the system's DPI settings, ensuring fonts are crisp and not blurry or pixelated.
* `term=xterm-256color`: Foot has its own terminfo (`foot-256color`), but I've found that `xterm-256color` is universally recognized. When I SSH into older servers or use multiplexers like `tmux` or `zellij`, this setting guarantees that all my colors and text-based UIs (like `htop` or `neovim`) render correctly without me having to copy terminfo files around. It's the "just works" option.
* `shell=/bin/zsh`: I use Zsh, not Bash. This line tells Foot to launch `zsh` by default. If you use `fish`, you'd change this to `/usr/bin/fish`.
* `app-id=foot`: This is a Wayland-specific setting. In Sway, you can set rules for windows based on their `app-id`. For example, in my Sway config, I have a line that says `for_window [app_id="foot"] floating enable`. This allows me to use a hotkey to toggle my terminal between tiling and floating modes. This ID is the hook that lets Sway identify Foot windows.
* `pad=8x8`: This is purely aesthetic, but it has a huge impact on usability. It adds an 8-pixel border of "padding" *inside* the window, between the window edge and the text. Without this, your text (like your `zsh` prompt) slams right up against the edge of the screen, which feels cluttered and claustrophobic. This gives it room to breathe.

**`[scrollback]` Section**

* `lines=10000`: By default, many terminals only save 1,000 or 2,000 lines. As a developer and cybersecurity student, I am constantly
    reviewing massive outputs. This could be a long `pacman` update, a `git log`, build errors from a Rust program, or system logs from `journalctl`. Setting this to 10,000 lines means I can scroll back and find an error that happened 20 minutes ago without the output having been truncated.

**`[csd]` Section: The Most Important Part**

* `preferred=none`: This. This is the entire reason to use a native tool in a tiling window manager. `csd` stands for Client-Side Decorations. This is the title bar, minimize/maximize buttons, and window border that an application *draws for itself*.
* Think about a traditional application like Firefox or VSCode. They draw their own title bar. In Sway, this is a *nightmare*. It results in two title bars: the one the app drew, and the one *Sway* draws.
* By setting `preferred=none`, I am telling Foot: "Do not, under any circumstances, draw your own title bar or borders. You are just a box of text. I trust my window manager (Sway) to handle all of that."
* This is what provides the seamless, minimalist look where the terminal is nothing but a font on a background, perfectly integrated into my Sway grid.

**`[key-bindings]` Section: The Wall I Hit**

* You'll notice this section is... empty. This is intentional.
* My old configs had lines like `copy=Control+Shift+C` and `zoom-in=Control+plus`. When I ran my config, I got a long list of errors: `not a valid action: copy`.
* This was my "Hitting The Wall" moment. I realized the Foot configuration syntax had changed, or that these actions were named differently (e.g., `scrollback-up-page` instead of a simple `scroll-up`).
* I also realized... why am I trying to make the *terminal* handle zoom? My window manager, Sway, already has keybindings for zooming the *entire* window. I was duplicating effort.
* For copy-paste, I use the standard Linux terminal method: select text with the mouse to copy, and middle-click to paste (which works by default without any config). Or, I use `wl-clipboard` for system-wide copy/paste.
* **The Breakthrough:** I deleted all of them. The terminal shouldn't manage window zoom. It shouldn't need complex keybindings. It should just render text. This simplification was the key.

**`[colors]` Section: The Dracula Theme**

* This is a complete, manual implementation of the Dracula color scheme.
* `foreground=F8F8F2`: The main text color (a soft, off-white).
* `background=282A36`: The deep, purple-grey background.
* `cursor=8C8C8C FFFFFF`: This fixed a `deprecated` warning. My old config had `[cursor].color`. The new standard is to put the cursor colors *inside* the `[colors]` block. This sets the cursor's color (grey) and the color of the text *under* the cursor (white).
* `regular0` - `bright7`: These are the 16 standard terminal colors. Tools like `neofetch`, `htop`, and `lsd` use these (e.g., "red," "green," "blue") to display their output. By defining them here, I ensure that *any* command-line application automatically follows my Dracula theme.
* `selection-background=44475A`: This is the color of the text I highlight with my mouse, a slightly lighter purple-grey.

---

### Hitting The Wall 🧱

As I mentioned in the `[key-bindings]` section, my biggest challenge was version rot. I had pieced together my first `foot.ini` from various blogs and dotfiles I found on GitHub. When I updated Foot via `pacman -Syu`, my config suddenly started throwing errors.

`[main].scrollback-lines: not a valid option`
`[cursor].color: use colors.cursor instead`
`[key-bindings].copy: not a valid action: copy`

I was frustrated. The terminal worked, but the errors on launch (which I saw *in* the terminal) were infuriating. It felt sloppy. I was blindly copying and pasting without *understanding*.

---

### The Breakthrough Moment ✨

The breakthrough came from humility. Instead of searching for "foot.ini dracula theme" on Google, I just typed `man 5 foot.ini` into my terminal.

I read the manual. All of it.

I discovered that `scrollback-lines` had been moved from `[main]` to its own `[scrollback]` section and renamed `lines`. I saw that `cursor.color` was now `colors.cursor`. I saw the *real* list of valid `key-bindings` and realized `copy` and `paste` weren't the simple commands I thought they were.

This led me to the bigger realization: I was forcing Foot to do things that weren't its job. Sway handles zoom. My clipboard manager handles copying. The terminal should render text.

By deleting the broken keys and moving the deprecated ones, I built a config file that was not only error-free but also *philosophically* cleaner. I wasn't fighting my tools anymore; I was letting each one do what it did best.

---

### 📚 Recommended Resource

If you, like me, live in the terminal, your power is only limited by your knowledge of the shell. I can't recommend a book more highly than **"The Linux Command Line" by William Shotts**.

It doesn't just teach you *commands*. It teaches you the *philosophy* of the shell, I/O redirection, shell scripting, and process management. It’s the foundational text that takes you from someone who *uses* a terminal to someone who *controls* their system with it. It’s an essential part of any developer's library. [Amazon](https://www.amazon.com/Linux-Command-Line-2nd-Introduction/dp/1593279523)

---

### Key Takeaways 📚

1.  💡 **`[csd].preferred=none` is Non-Negotiable.** For any Wayland-native app on Sway, this is the most important setting. It's the key to true, seamless integration.
2.  ⚙️ **Let Tools Do Their Job.** Don't make your terminal manage windows (zoom, placement). That's Sway's job. Don't make your terminal manage system-wide copy/paste. That's `wl-clipboard`'s job. Simplicity wins.
3.  📚 **Read The Man Page (`man 5 foot.ini`).** Configurations evolve. Blog posts and dotfiles get outdated. The `man` page is the *source of truth*. My errors were a symptom of ignoring the documentation.

---

### Thanks for Following ☕

This config is the result of a lot of tweaking, and I'm incredibly happy with it. It's fast, beautiful, and feels completely integrated with my system.

☕ If you found this guide helpful, you can [Buy Me a Coffee](https://buymeacoffee.com/orioninsist)!
[Medium](https://orioninsist.medium.com/subscribe)
[Etsy](https://www.etsy.com/shop/orioninsist)
[LinkedIn](https://www.linkedin.com/company/orioninsist/)
[Read More](https://orioninsist.org/blog/arch-linux-hibernate-fix-empty-boot-loader-entries-uki/)

> What's the one "non-negotiable" setting in your terminal configuration that you can't live without?