+++

date = 2025-10-27T01:22:06+03:00
publishDate = 2025-10-27T01:22:06+03:00
lastmod = 2025-10-27T01:22:06+03:00
ShowReadingTime = true
ShowToc = true
TocOpen = true



draft = false 


title = "Achieving Seamless, System-Wide Dark Mode on Arch Linux with Sway (Wayland): The Definitive Terminal Guide"
author = "Murat Kurkoglu"
description = "A deep, terminal-focused guide on fixing persistent dark mode conflicts in Arch Linux/Sway (Wayland). Learn to unify GTK 2, 3, 4, and Firefox/LibreWolf themes perfectly."
summary = "A deep, terminal-focused guide on fixing persistent dark mode conflicts in Arch Linux/Sway (Wayland). Learn to unify GTK 2, 3, 4, and Firefox/LibreWolf themes perfectly."
slug = "sway-wayland-perfect-dark-mode-terminal-guide"
keywords = ["Arch Linux", "Sway", "Wayland", "Dark Mode", "GTK"]
tags = ["Arch Linux", "Sway", "Wayland"]
categories = ["Linux", "Wayland", "Configuration"]
series = ["Minimalist Optimization"]
images= "images/blog/2025/10/2025-10-26-sway-wayland-perfect-dark-mode-terminal-guide-watermarked.avif"
[cover]
    image = "images/blog/2025/10/2025-10-26-sway-wayland-perfect-dark-mode-terminal-guide-watermarked.avif"
    alt = "Two developers succeed in fixing a persistent Linux dark mode theme conflict using the terminal."
+++

**If you run a minimal Linux environment like Sway on Arch, getting a truly unified dark theme often feels like a never-ending battle. It stops now.**

---

👋 Hey everyone,

I've been running Arch Linux with the Sway Wayland compositor for a while now. I love the speed, the minimalism, and the raw control it gives me. My whole setup—the terminal, the panels, the editors—is meticulously configured for a consistent, deep dark mode. It’s what I prefer for focus, especially during those late-night coding sessions.

But, as any seasoned Linux tinkerer knows, there is always one lingering inconsistency that drives you absolutely mad: **the blinding white flash of an un-themed application or system dialog.**

This past week, that white flash became my obsession. It showed up in a few key places: the ubiquitous **system file chooser dialog** (the one that pops up when you save or open a file in your browser), and stubborn applications like **LibreWolf**. I'd look at my beautiful dark terminal, only to be momentarily blinded by a rogue white box. It was the last piece of light I needed to banish from my system.

I realized the problem wasn't a lack of trying; it was a lack of understanding the **layered complexity** of theme management in a modular Wayland environment. Unlike monolithic desktop environments (like GNOME or KDE) that manage themes centrally, Sway requires us to be explicit and forceful with our configurations across every single layer: GTK 2, GTK 3, GTK 4, Wayland Portals, and application-specific settings.

This guide documents the exact, terminal-focused process I used to achieve **100% Dark Mode consistency**. If you follow these precise steps, you will resolve your own theme conflicts and finally enjoy a truly unified dark aesthetic.

---

### My Goal This Week 🎯

My aim was simple: **eliminate all instances of the light theme on my Arch/Sway machine.**

This required me to confirm and enforce three distinct levels of theme application:
1.  **GTK Core:** Ensuring the GTK libraries (2, 3, and 4) read the `Adwaita:dark` preference. This handles the system dialogs.
2.  **Wayland Integration:** Verifying that the `xdg-desktop-portal-gtk` component—the bridge between Wayland apps and GTK dialogs—was installed and using the correct environment variables.
3.  **Stubborn Applications:** For applications that ignore system settings (like Firefox/LibreWolf), manually injecting the theme configuration into their user preference files.

---

### The Process & The Code 👨‍💻

The entire solution required a systematic, four-part terminal assault on configuration files and cache directories.

#### Step 1: Validating Core GTK Libraries (The Foundation)

Before setting the theme, I had to ensure the required GTK packages were installed.

**Terminal Check:**
~~~bash
pacman -Qs gtk2
pacman -Qs gtk3
pacman -Qs gtk4
pacman -Qs xdg-desktop-portal-gtk
~~~

**My Analysis:** My system analysis confirmed that **`gtk3`**, **`gtk4`**, and the critical **`xdg-desktop-portal-gtk`** package were all installed and up-to-date. This proved the necessary infrastructure was in place to render dark dialogs.

#### Step 2: Enforcing Dark Mode Across All GTK Versions

Theme settings must be explicitly defined for **every major GTK version** to catch all applications—old, current, and new.

**2.1. GTK 3 and GTK 4 Configuration (The Modern Core)**

I opened and verified/created the `settings.ini` files for both GTK 3 and GTK 4. This is where the magic parameter `gtk-application-prefer-dark-theme=1` lives.

~~~bash
# GTK 3 Configuration
nano ~/.config/gtk-3.0/settings.ini

# GTK 4 Configuration (Crucial for newer apps)
nano ~/.config/gtk-4.0/settings.ini
~~~

**File Content (Exact and clean, no extra characters!):**
~~~ini
[Settings]
gtk-theme-name=Adwaita
gtk-application-prefer-dark-theme=1
gtk-icon-theme-name=Adwaita
gtk-cursor-theme-name=Adwaita
gtk-font-name=Inter 10
~~~

**2.2. GTK 2 Configuration (The Legacy Catch)**

While rare, older applications like certain versions of GIMP or legacy utilities still use GTK 2. I created the `.gtkrc-2.0` file to ensure they also get a dark preference.

~~~bash
nano ~/.gtkrc-2.0
~~~

**File Content (Different format for GTK 2):**
~~~ini
# GTK 2 Configuration - Forced Theme
include "/usr/share/themes/Adwaita/gtk-2.0/gtkrc"
style "user-font" {
    font_name="Inter 10"
}
widget_class "*" style "user-font"
gtk-theme-name="Adwaita"
gtk-icon-theme-name="Adwaita"
~~~

#### Step 3: Global Environment Variable and Cache Flush

This is often the step people miss. We must force the theme setting at the session level and wipe the old theme cache that sometimes overrides new settings.

**3.1. Session Environment Variable (Sway Zorlama)**

I added the environment variable to my `sway/config` file to ensure it loads with the highest priority, overriding any local application-specific theme settings that might load later.

~~~bash
# Add this near the TOP of your ~/.config/sway/config file
exec_always {
    export GTK_THEME="Adwaita:dark"
}
~~~

**3.2. GTK Cache Wipe (The Reset Button)**

I found that even with the correct settings, the GTK File Chooser stubbornly remained light. This was the result of a corrupted or outdated GTK theme cache. The fix is simple and decisive:

~~~bash
# Wiping the GTK cache is mandatory for changes to take effect
rm -rf ~/.cache/gtk-3.0/
~~~

After running this, I performed a **full system reboot** (not just `swaymsg reload`). This ensured the new environment variables and the fresh GTK cache loaded correctly. Upon logging back in, all system dialogs were finally dark. **Success at level one!**

---

### Hitting The Wall 🧱

After the reboot, my GTK dialogs were perfect. I opened Google Chrome, and its GTK dialogs were also dark. However, my beloved **LibreWolf** (a highly private Firefox fork) was still blazing white. Its file dialogs were light, and its menus were light.

This is the classic **Application-Specific Override** problem. Firefox/LibreWolf runs on its own engine (Gecko) and intentionally isolates itself from some operating system settings. It relies on its *own* preference files to decide whether to comply with a dark theme.

I realized that while my system theme was perfect, the browser needed to be explicitly told—in its own language—to listen to the GTK theme. This is where the real terminal detective work paid off.

---

### The Breakthrough Moment ✨

The breakthrough came from figuring out how to inject the preference directly into the browser's profile without touching the GUI (since I prefer to configure everything via text files).

#### The Fix: Injecting Preferences into LibreWolf's `prefs.js`

1.  **Identify the Profile Path:** I used `ls -a` to locate the active LibreWolf profile folder inside my home directory.
    ~~~bash
    ls -a ~/.librewolf/
    # I found the folder, let's call it 77o0jj71.default-default
    ~~~

2.  **Navigate and Inject:** **Crucially, I ensured LibreWolf was completely closed.** I navigated to the profile and used `nano` to add the theme preferences directly to the primary configuration file, `prefs.js`.

    ~~~bash
    # Navigate to the profile (use your actual folder name)
    cd ~/.librewolf/77o0jj71.default-default/

    # Open the preferences file
    nano prefs.js
    ~~~

    **The two magic lines I added to the very bottom of the file:**
    ~~~javascript
    // Forced the browser engine to use the dark GTK theme
    user_pref("widget.content.gtk-theme-override", "Adwaita:dark");

    // Told the browser's UI to comply with the dark mode preference
    user_pref("ui.systemUsesDarkTheme", 1);
    ~~~

I saved the file (`Ctrl + O`, Enter, `Ctrl + X`) and relaunched LibreWolf. The entire application—the menus, the scrollbars, the tabs, and yes, the file chooser—snapped instantly into a beautiful, seamless dark mode. **Mission accomplished!**

---

### 📚 Recommended Resource

When debugging theme issues or deeply customizing a minimalist setup like Sway, you need to understand the underlying Linux architecture, especially the role of GTK and the XDG standards. I highly recommend **The Linux Programming Interface** by **Michael Kerrisk**.

This monumental book is a comprehensive reference for the Linux system, covering everything from fundamental filesystems to inter-process communication (IPC) and system calls. While it doesn't talk about theming directly, understanding the environment variables, configuration paths, and how different processes interact will make debugging these obscure theme conflicts feel like a simple diagnostic rather than a desperate search. It’s an investment in true Linux expertise. [Amazon](https://www.amazon.com/Linux-Programming-Interface-System-Handbook/dp/1593272200)

---

### Key Takeaways 📚

1.  💡 **Layered Configuration is Key:** Never rely on one setting to manage everything in a modular Linux environment. You must explicitly configure **GTK 2, GTK 3, GTK 4, and your Wayland environment (Sway)** separately, because applications will only listen to the configuration that matches their compiled libraries.
2.  ⚙️ **Cache and Priority Matter:** If your settings look correct but fail, the problem is almost always the **cache (`rm -rf ~/.cache/gtk-3.0/`)** or **loading priority**. Using `exec_always { export GTK_THEME=... }` in your `sway/config` ensures the variable is set with high priority before any applications launch.
3.  📚 **Application Overrides Demand Terminal Injection:** For stubborn applications like Firefox/LibreWolf, the solution isn't a system setting—it's manual configuration file injection. You must speak the application’s language (`user_pref` in `prefs.js`) to force compliance with your system's aesthetic.

This journey from frustration to perfection taught me once again that in Linux, the terminal is the only place where you find absolute truth and absolute control.

---

### Thanks for Following ☕
☕ If you found this guide helpful, you can [Buy Me a Coffee](https://buymeacoffee.com/orioninsist)!
[Medium](https://orioninsist.medium.com/subscribe)
[Etsy](https://www.etsy.com/shop/orioninsist)
[LinkedIn](https://www.linkedin.com/company/orioninsist/)
[Read More](https://orioninsist.org/blog/neovim-more-than-a-code-editor/)

> What is the most frustrating theme or environment variable conflict you've ever had to solve on your Wayland setup? Let me know in the comments!