+++

date = 2025-10-27T23:47:14+03:00
publishDate = 2025-10-27T23:47:14+03:00
lastmod = 2025-10-27T23:47:14+03:00
ShowReadingTime = true
ShowToc = true
TocOpen = true



draft = false 


title = "Supercharge Your Sway Workflow: Instant AI Hotkeys"
author = "Murat Kurkoglu"
description = "Learn how to create instant keyboard shortcuts in the Sway Wayland compositor for AI tools like ChatGPT and Gemini, maximizing productivity on Arch Linux."
summary = "Learn how to create instant keyboard shortcuts in the Sway Wayland compositor for AI tools like ChatGPT and Gemini, maximizing productivity on Arch Linux."
slug = "sway-ai-pwa-hotkeys-arch-linux-productivity"
keywords = ["Sway", "Wayland", "Arch Linux", "PWA", "ChatGPT"]
tags = ["Sway", "Wayland", "Arch Linux", "PWA", "ChatGPT"]
categories = ["Sway"]
series = ["Productivity"]
[cover]
    image = "images/blog/2025/10/2025-10-27-sway-ai-pwa-hotkeys-watermarked.avif"
    alt = "A successful demonstration of custom keyboard shortcuts launching dedicated AI web apps in the Sway Tiling Window Manager."
+++

**How to bind ChatGPT and Gemini to single keyboard shortcuts in Sway using a tiny Bash script and the power of Wayland.**

---

👋 Hey everyone,

My work life is lived almost entirely within two places: the **Alacritty terminal** and my **Sway Tiling Window Manager**. This setup provides unmatched speed and focus, but a new class of tools has emerged that threaten this perfect flow: **AI chat interfaces**. Jumping between a tiling terminal setup and a full browser window just to ask Gemini or ChatGPT a quick question completely breaks my concentration. I knew I needed a dedicated, zero-friction solution. I wasn't going to compromise my workflow for productivity tools; I was going to adapt my workflow to conquer them.

---

### My Goal This Week 🎯
My objective was simple yet specific: I wanted to hit a single, non-conflicting keyboard shortcut and have a **minimalist, dedicated app window** for either ChatGPT or Gemini appear instantly. No address bar, no tabs, just the chat interface—a true Progressive Web App (PWA) experience, tightly integrated into my Sway environment on Arch Linux. This wasn't just about saving seconds; it was about preserving **flow state**.

---

### The Process & The Code 👨‍💻

The solution required two key components: a **Bash script** to reliably launch the application and a **Sway key binding** (`bindsym`) to execute that script.

#### 1. The Power of the PWA Flag

My initial attempts failed because I was using the wrong executable name, `google-chrome`. After debugging, I discovered that on my Arch system, the executable was actually **`google-chrome-stable`**. This tiny detail, combined with Chrome’s powerful PWA launch flag, was the breakthrough.

The `--app` flag tells Chrome to launch a specific URL in a minimal, dedicated window frame, mimicking a native desktop application. The `exec setsid` command is crucial in Sway/Wayland; it ensures the browser process is detached from the shell that launched it, preventing the application from crashing if the launcher process dies.

I placed this script in my dotfiles `bin` directory for easy management:
**File:** `/home/murat/orion/10_projects/01-project-dotfiles/bin/launch-web-app`

~~~bash
#!/bin/bash

# Web uygulamasını (PWA) Google Chrome Stable ile açar.
# $1: URL (Örn: https://chat.openai.com/app)
# $2...: Diğer argümanlar

# setsid: Uygulamanın kabuktan ayrılmasını sağlar (Wayland ortamında kritik).
# google-chrome-stable --app="$1": Tarayıcıyı minimal uygulama modunda açar.
exec setsid google-chrome-stable --app="$1" "${@:2}"
~~~

After saving this, I made sure it was executable:
`chmod +x /home/murat/orion/10_projects/01-project-dotfiles/bin/launch-web-app`

#### 2. The Sway Key Bindings

Next, I turned to my Sway config file (`~/.config/sway/config`). Since my primary modifier, `$mod`, is set to **Alt (`Mod1`)**, I needed a combination that was free and intuitive. The **Super/Windows Key (`Mod4`)** is perfect for system-wide app launching and avoids collision with my tiling navigation.

I chose **Super (Mod4) + C** for ChatGPT and **Super (Mod4) + G** for Gemini.

~~~bash
# -----------------------------------------------------------------
# YAPAY ZEKA WEB UYGULAMASI KISAYOLLARI (launch-web-app script'i ile)
# Kısayol: Mod4 (Super/Windows) + Tuş
# -----------------------------------------------------------------

# Super (Windows/Meta) + c -> ChatGPT (Chrome App)
bindsym Mod4+c exec /home/murat/orion/10_projects/01-project-dotfiles/bin/launch-web-app "https://chat.openai.com/app"

# Super (Windows/Meta) + g -> Gemini (Chrome App)
bindsym Mod4+g exec /home/murat/orion/10_projects/01-project-dotfiles/bin/launch-web-app "https://gemini.google.com/app"
~~~

Finally, I reloaded my config using **$mod+Shift+c**, and the shortcuts were live. The speed is instantaneous—a single press, and the AI is ready.

---

### Hitting The Wall 🧱

The initial setup was a nightmare of trial and error. My first attempts to launch the script failed silently within Sway, offering no error output. When I ran it from the terminal, I was met with the cryptic but ultimately telling error:

> `setsid: failed to execute google-chrome: No such file or directory`

This is a classic Linux-on-Arch scenario. While I *knew* Chrome was installed, I was calling the wrong executable name. My initial assumption was that any Google Chrome installation would respond to `google-chrome`. The realization that the binary was specifically named **`google-chrome-stable`** was the "Aha!" moment that separated failure from success. Debugging silently failing `exec` commands in a minimal window manager requires patience and a systematic check of dependencies and file paths outside the WM environment first.

---

### The Breakthrough Moment ✨

The true breakthrough wasn't just finding the correct executable name; it was realizing the elegant simplicity of the final solution. The entire, robust PWA launcher is just **one line of Bash**.

By correctly combining:
1.  The right binary path (`google-chrome-stable`).
2.  The correct daemonizing command (`exec setsid`).
3.  The PWA launch flag (`--app="$1"`).
4.  A conflict-free Sway binding (`Mod4+c`).

I achieved a seamless, native-feeling AI application experience that perfectly respects the tiling philosophy of Sway. The minimal window doesn't require unnecessary mouse interactions and maintains focus—exactly what I needed to eliminate digital distractions and keep my code flow intact.

---

### 📚 Recommended Resource

When you're diving this deep into customizing your Linux environment, especially around productivity and system optimization, having a solid foundation in Linux scripting is invaluable. I highly recommend **"The Linux Command Line: A Complete Introduction" by William E. Shotts, Jr.** This book goes beyond simple shell commands, providing a comprehensive understanding of the entire Linux landscape, from the kernel to advanced Bash scripting. It demystifies tools like `sed` and `awk` and is essential for anyone wanting to truly master their environment, making complex tweaks like the one described here second nature. [Amazon](https://www.amazon.com/Linux-Command-Line-2nd-Introduction/dp/1593279523)

---

### Key Takeaways 📚

1.  💡 **Verify Your Executable Name First:** Never assume the command is simple. Always run `which <program-name>` (e.g., `which google-chrome` vs. `which google-chrome-stable`) in your terminal to find the absolute truth about your binary's name before embedding it in a script or configuration file. This is the single biggest time-saver in Linux customization.
2.  ⚙️ **`setsid` is Your Wayland Best Friend:** When using a minimal Window Manager like Sway, always prepend `exec setsid` to any long-running application launched from your config. It ensures the launched program is detached from the parent process, preventing silent failures and guaranteeing the app stays alive even if the launching shell process terminates unexpectedly.
3.  📚 **Utilize the PWA `--app` Flag:** The `--app="URL"` flag is a game-changer for productivity in Tiling WMs. It transforms any web service (AI, project management, email) into a distraction-free application window, maximizing screen real estate and improving focus by hiding all browser chrome.

---

### Thanks for Following ☕

This tiny script has made a massive difference in how I interact with AI, turning a disruptive tool into a perfectly integrated productivity hack.

☕ If you found this guide helpful, you can [Buy Me a Coffee](https://buymeacoffee.com/orioninsist)!
[Medium](https://orioninsist.medium.com/subscribe)
[Etsy](https://www.etsy.com/shop/orioninsist)
[LinkedIn](https://www.linkedin.com/company/orioninsist/)
[Read More](https://orioninsist.org/blog/a100-power-browser-simplicity-ollama-on-colab-web-ui/)

> Do you use a Tiling Window Manager, and what is your favorite hack for integrating web-based tools into your native desktop workflow?