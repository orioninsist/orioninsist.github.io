+++

date = 2025-11-07T21:41:17+03:00
publishDate = 2025-11-07T21:41:17+03:00
lastmod = 2025-11-07T21:41:17+03:00
ShowReadingTime = true
ShowToc = true
TocOpen = true



draft = false

title = "My Arch + Sway Workflow: Blazing-Fast PWA Keybindings"
author = "Murat Kurkoglu"
description = "A deep dive into my Arch Linux + Sway keybindings. Learn my Mod4 strategy and how I use a custom shell script to launch web apps like ChatGPT as PWAs."
summary = "A deep dive into my Arch Linux + Sway keybindings. Learn my Mod4 strategy and how I use a custom shell script to launch web apps like ChatGPT as PWAs."
slug = "my-arch-sway-workflow-pwa-keybindings"
keywords = ["Arch Linux", "Sway", "Wayland", "Workflow", "Productivity"]
tags = ["Arch Linux", "Sway", "Productivity"]
categories = ["Linux"]
series = ["Arch Linux Setup"]
[cover]
    image = "images/blog/2025/11/2025-11-07-my-arch-sway-workflow-pwa-keybindings-watermarked.avif"
    alt = "A focused developer's desk with two monitors showing a minimalist Arch Linux and Sway interface with code and web apps."
+++

**My Arch + Sway Workflow: Blazing-Fast PWA Keybindings**
**Tired of `Alt+Tab`? Here’s how I integrated web apps like ChatGPT directly into my keyboard-driven setup.**

---

👋 Hey everyone,

If you're like me, you chose Arch Linux and Sway for a reason. You crave a minimal, distraction-free environment where you are in complete control. You live in the terminal, you value performance, and you believe that the keyboard is always faster than the mouse.

I've spent countless hours refining my `~/.config/sway/config`, shaving milliseconds off my workflow, and ensuring every keypress has a purpose. But for the longest time, one thing felt... disconnected.

Web apps.

We all rely on them. For me, it's ChatGPT, Gemini, Spotify, and my project management tools. In a traditional desktop environment, these are just browser tabs, lost in a sea of other tabs. In my minimalist Sway setup, they were even more of an interruption. I’d have to `Alt+Tab` (or, in my case, `$mod+j`) to my browser, find the right tab, and then try to get back to my code. It felt clunky.

It broke the flow. And for a developer or cybersecurity analyst, flow state is everything.

---

### My Goal This Week 🎯
I set a simple goal: **Make web apps feel like native applications.**

I wanted to be able to launch ChatGPT, Gemini, or Spotify with a single key combination, just like I launch my terminal (`$mod+Return`) or VS Code. I wanted them to open in their own dedicated windows—no address bar, no bookmarks, no distractions.

And I absolutely did *not* want to install heavy, unofficial Electron wrappers for each service. I knew there had to be a cleaner way, using the tools I already had: Sway, a shell script, and `google-chrome-stable`.

---

### The Process & The Code 👨‍💻
My solution involved two distinct parts:

1.  **A Logical Keybinding Strategy:** Separating my keybindings by *purpose*.
2.  **A Reusable Shell Script:** A tiny, powerful script to "nativ-ize" any web app.

#### Part 1: The Keybinding Philosophy (Mod vs. Mod4)

First, I had to organize my keybindings. My Sway config was becoming a mess of `$mod+Shift+...` combinations. I needed a system.

Here’s the philosophy I landed on, which has changed everything for me:

* **`$mod` (Alt key):** This key is for **Sway Functions**. It controls the window manager itself. Things like moving focus (`$mod+h/j/k/l`), moving windows (`$mod+Shift+h/j/k/l`), changing layouts (`$mod+e`), and switching workspaces (`$mod+1/2/3`).
* **`Mod4` (Super/Windows key):** This key is for **Application Launching**. It’s purely for starting programs.

This separation is so clean. I never have to guess. If I'm manipulating windows, I use `Alt`. If I'm opening an app, I use `Super`.

With this logic, I added my standard native applications. This part is simple and probably familiar to you. I added these lines to my `~/.config/sway/config`:

~~~sway
# -----------------------------------------------------------------
# NATIVE UYGULAMA KISAYOLLARI (Mod4 + Tuş)
# -----------------------------------------------------------------

# Super (Windows/Meta) + l -> LibreWolf
bindsym Mod4+l exec librewolf

# Super (Windows/Meta) + e -> VS Code (Editor)
bindsym Mod4+e exec code

# Super (Windows/Meta) + s -> Spotify
bindsym Mod4+s exec spotify
~~~

This was a great start. `Super+e` launches VS Code. `Super+l` launches my browser. `Super+s` launches Spotify. Simple, fast, and logical.

But what about ChatGPT? What about Gemini? This is where the real magic comes in.

#### Part 2: The `launch-web-app` Script

I didn't want to hardcode long `exec` commands in my Sway config. It's messy and hard to maintain. Instead, I created a simple, reusable shell script called `launch-web-app` and placed it in my local `bin` directory (`/home/murat/orion/10_projects/01-project-dotfiles/bin/`).

Here is the *entire* script. It's tiny, but it's the core of this entire workflow.

~~~bash
#!/bin/bash

# Web uygulamasını (PWA) Google Chrome Stable ile açar.
# $1: URL
# $2...: Diğer argümanlar

# exec setsid google-chrome-stable komutunu kullanıyoruz.
exec setsid google-chrome-stable --app="$1" "${@:2}"
~~~

Let's break this down line by line, because every part is critical.

* `#!/bin/bash`
    The standard "shebang." It tells the system to execute this file using the Bash shell.

* `exec setsid google-chrome-stable ...`
    This line has two key commands.
    1.  **`exec`**: This command *replaces* the current shell process (the script itself) with the command that follows. This is more efficient. Instead of the script *waiting* for Chrome to close, the script *becomes* the Chrome process and then exits when Chrome does.
    2.  **`setsid`**: This is the real hero. `setsid` runs a program in a new session, completely detached from the terminal or process that launched it. **This is critical for Sway.** Without `setsid`, Sway (or your application launcher, like `wmenu-run`) might "hang" or think the keybinding is still "in progress." `setsid` makes the launch clean and independent.

* `google-chrome-stable`
    The dependency. This script relies on `google-chrome-stable`. You could easily change this to `chromium` or `brave`, but this is what I use. On Arch Linux, you'll need to install it from the AUR: `yay -S google-chrome-stable`.

* `--app="$1"`
    This is the PWA magic. This flag tells Chrome to launch the URL in "app mode." This means:
    * No address bar.
    * No tabs.
    * No bookmarks bar.
    * It gets its own window, which Sway can tile and manage like any other native app.
    * It uses the site's `favicon.ico` as the window icon.
    `"$1"` is the first argument passed to the script (which will be our URL).

* `"${@:2}"`
    This is just good, defensive shell scripting. It means "take all the other arguments passed to this script (from the 2nd one onwards) and pass them along to the `google-chrome-stable` command." This lets me future-proof the script. If I ever need to add another flag, like `--profile-directory`, I can just add it to my Sway config without editing the script.

#### Part 3: Tying It All Together in Sway

Now that I have my `Mod4` (Super) key strategy and my `launch-web-app` script, putting it all together in my Sway config is beautifully simple.

I just added these lines right below my native app keybindings:

~~~sway
# -----------------------------------------------------------------
# YAPAY ZEKA WEB UYGULAMASI KISAYOLLARI (launch-web-app script'i ile)
# -----------------------------------------------------------------

# Super (Windows/Meta) + c -> ChatGPT (Chrome App)
bindsym Mod4+c exec /home/murat/orion/10_projects/01-project-dotfiles/bin/launch-web-app "https://chat.openai.com/app"

# Super (Windows/Meta) + g -> Gemini (Chrome App)
bindsym Mod4+g exec /home/murat/orion/10_projects/01-project-dotfiles/bin/launch-web-app "https://gemini.google.com/app"
~~~

The result is pure bliss.

I press `Super+g`. `exec` fires the script. `setsid` detaches it. `google-chrome-stable --app` launches Gemini in a clean, minimal, native-feeling window. Sway tiles it perfectly next to my terminal.

I press `Super+c`. ChatGPT pops up in its own window.

No mouse. No browser tabs. Just pure, fast, keyboard-driven flow.

---

### Hitting The Wall 🧱
This setup feels perfect now, but I did hit a few small snags that are worth mentioning.

1.  **Script Permissions:** The most classic "oops" moment. After writing the script, I pressed `Super+g` and... nothing. I'd forgotten to make the script executable. A quick `chmod +x /path/to/my/launch-web-app` fixed it instantly.

2.  **Dependencies:** As mentioned, this entire workflow *requires* `google-chrome-stable`. If you're a `firefox` purist, this *won't* work, as Firefox's "app mode" (SSB, or Site-Specific Browsers) is not as simple to call from the command line as Chrome's `--app` flag. For me, having one browser installed specifically for this PWA functionality is a trade-off I'm willing to make.

3.  **Wayland & Electron:** In the past, apps like VS Code (`code`) and Spotify (`spotify`) were notorious for being blurry or not scaling correctly on Wayland. Thankfully, those days are mostly behind us. Both apps now run beautifully on Wayland out of the box (or by detecting it automatically). I no longer need to pass in special Ozone flags (`--enable-features=UseOzonePlatform --ozone-platform=wayland`) in my `exec` commands, which keeps the config even cleaner.

---

### The Breakthrough Moment ✨
The real "aha!" moment wasn't just the `--app` flag. It was the `setsid` command.

Before I added `setsid`, launching an app from `wmenu-run` (my `$menu`) or even from a keybinding would sometimes cause `wmenu` to stay open until the app was closed. It felt janky. I realized that Sway was keeping the launcher process alive because it was still "attached" to the child process (Chrome).

`setsid` severs that link completely. It tells Sway, "Hey, I've launched this thing. It's on its own now. My job is done." That single command is what makes the whole system feel robust, clean, and professional.

---

### 📚 Recommended Resource
If you love living in the terminal and want to master the shell scripting that makes workflows like this possible, I cannot recommend one book enough: **"The Linux Command Line: A Complete Introduction" by William Shotts**.

This book is the bible for truly understanding *how* the shell works. It's not just a list of commands. It teaches you the *philosophy* of the command line, from simple file manipulation to writing complex shell scripts like the one I use. It’s what gave me the confidence to move beyond just editing config files and start writing small, powerful tools to extend my environment. It’s an essential part of any Arch Linux user’s library. [Amazon](https://www.amazon.com/Linux-Command-Line-2nd-Introduction/dp/1593279523)

---

### Key Takeaways 📚
1.  💡 **Separate Your Keybinding Concerns:** This is my biggest takeaway. Use one modifier key (`$mod`/Alt) for *controlling your environment* (window management) and another (`Mod4`/Super) for *launching applications*. This mental model is simple, scalable, and eliminates conflicts.
2.  ⚙️ **A Small Script is Better Than a Big Config:** Don't clutter your `sway/config` with complex, hard-to-read `exec` lines. Offload that logic to a simple, reusable shell script. It's easier to maintain, debug, and reuse.
3.  📚 **Embrace PWA "App Mode":** Chrome's `--app` flag is one of its most underrated features for minimal setups. It bridges the gap between the web and the desktop, allowing you to integrate essential tools like ChatGPT and Gemini as first-class citizens in your workflow.

This system has fundamentally changed how I work. It keeps me in the flow, keeps my hands on the keyboard, and, most importantly, it feels *fast*.

I hope this detailed breakdown helps you optimize your own setup!

---

### Thanks for Following ☕
☕ If you found this guide helpful, you can [Buy Me a Coffee](https://buymeacoe.com/orioninsist)!
[Medium](httpss://orioninsist.medium.com/subscribe)
[Etsy](httpss://www.etsy.com/shop/orioninsist)
[LinkedIn](httpss://www.linkedin.com/company/orioninsist/)
[Read More](https://orioninsist.org/blog/fix-sway-keyboard-layout-switching/)

> What's your number one workflow hack in Sway or your favorite window manager? Share it in the comments!


