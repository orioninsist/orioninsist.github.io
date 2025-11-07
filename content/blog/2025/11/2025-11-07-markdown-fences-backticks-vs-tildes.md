+++

date = 2025-11-07T23:06:18+03:00
publishDate = 2025-11-07T23:06:18+03:00
lastmod = 2025-11-07T23:06:18+03:00
ShowReadingTime = true
ShowToc = true
TocOpen = true



draft = false 


title = "Markdown Fences: ``` vs. ~~~ — Which Do You Use?"
author = "Murat Kurkoglu"
description = "Ever wondered about ``` vs. ~~~ in Markdown? Discover the difference, which is standard, and the 'pro trick' for nesting code blocks you need to know."
summary = "Ever wondered about ``` vs. ~~~ in Markdown? Discover the difference, which is standard, and the 'pro trick' for nesting code blocks you need to know."
slug = "markdown-fences-backticks-vs-tildes"
keywords = ["Markdown", "Technical Writing", "CommonMark", "Static Site Generators", "Web Development"]
tags = ["Markdown", "Technical Writing", "CommonMark"]
categories = ["Development"]
series = ["Tech Explained"]
[cover]    image = "images/blog/2025/11/2025-11-07-markdown-fences-backticks-vs-tildes-watermarked.avif"
    alt = "A split-screen image showing broken Markdown rendering on one side and perfectly nested, clean code blocks on the other."
+++

**Markdown Fences: ``` vs. ~~~ — Which Do You Use?**

**It's the one Markdown "gotcha" that hits every technical writer. I finally figured out the difference, and it's not what you think.**

---

👋 Hey everyone,

I spent an embarrassing amount of time this week fighting with... Markdown. Yes, Markdown. The "simple" text-to-HTML language that's supposed to make our lives *easier*.

As a computer engineer who loves the terminal, I live in text files. My blog at `orioninsist.org` is built with Hugo, my notes are in Neovim, and I'm writing a book series about `pacman`—all in Markdown. I thought I knew it inside and out.

This week, I was humbled. And it all came down to a simple, frustrating question: what is the *actual* difference between ````bash` and `~~~bash` for creating a code block?

My immediate answer was "nothing." I've used them interchangeably for years.

I was wrong. Or at least, I was missing the one crucial, practical difference that can save you from a world of frustration.

---

### My Goal This Week 🎯
My goal was simple: write a new blog post, a tutorial on how I manage my [dotfiles](https://orioninsist.org/tags/dotfiles/) (my Arch Linux configuration files). This is a common topic, and I wanted to do it right. A good dotfiles tutorial *must* show examples of code.

I needed to show my readers:
1.  A sample `.zshrc` alias.
2.  A small Bash script they could save and use.
3.  The *exact* Markdown text I use in my *own* `README.md` file, which *itself* contains code blocks.

And that... that last part is where my entire week went off the rails.

---

### The Process & The Code 👨‍💻
I fired up Neovim and started writing. I got to the part where I wanted to show my readers what my `README.md` looked like.

So, naturally, I tried to write this in my `index.md` file:

> "Your README should include instructions, like this:"
> 
> ```markdown
> ## My Awesome Dotfiles
> 
> Here is my prompt:
> 
> ```bash
> # This is my .zshrc alias
> alias ll='ls -alF'
> ```
> ```

I saved the file, my Hugo server rebuilt, and I checked the browser.

It was a disaster.

The page rendered the "## My Awesome Dotfiles" part, but then the code block ended prematurely. The `alias ll='ls -alF'` was inside a block, but the final ```` was just... sitting there, rendered as plain text. It looked amateur, broken, and confusing.

---

### Hitting The Wall 🧱
I stared at the screen. Why was it broken?

The "why" was obvious if I slowed down:
1.  My outer block started with ````markdown`.
2.  The Markdown parser (Goldmark, in Hugo's case) started reading, looking for the *next* ```` it could find.
3.  It found the ````bash` line and thought, "Oh, this is just text inside the 'markdown' block. Fine."
4.  It found the `alias` line and thought, "More text. Fine."
5.  It found the *closing* ```` (the one I intended to close the *inner* block).
6.  The parser screamed, "AHA! I found it!" and promptly closed my *outer* block.

The final ```` from my original *outer* block was now "outside" and rendered as plain text.

I was stuck. How do you tell a story about a "house" from *inside* the "house"? How could I *show* a code block without *using* a code block?

My first instinct was to try escaping the characters: `\`\`\``. This is a common developer instinct. It's also, in this case, a terrible idea. It made the raw Markdown file completely unreadable, and different parsers handle escaped backticks in different, "creative" ways. It wasn't a stable solution.

I was frustrated. This is a core part of technical writing. How could it be this hard?

---

### The Breakthrough Moment ✨
I took a break, made some coffee, and stared at my keyboard. My eyes drifted to the `~` key. Tilde.

I remembered seeing `~~~` in some older repositories on GitHub. I always chalked it up to a different "style," like spaces vs. tabs.

"What if..."

On a hunch, I went back to my post and changed the *outer* fence from ```` to `~~~`.

Here is the *exact* text I wrote in my `index.md` file:

~~~markdown
"Your README should include instructions, like this:"
~~~
~~~markdown
## My Awesome Dotfiles

Here is my prompt:
~~~
```bash
# This is my .zshrc alias
alias ll='ls -alF'
```

I saved. Hugo rebuilt. I refreshed the browser.

It. Was. Perfect.

It rendered exactly as I intended: a single, large code block showing my sample README, with its own nested, syntax-highlighted code block inside.

This wasn't a style choice. This was a superpower.

This sent me down a rabbit hole. I pulled up the official CommonMark specification (the "standard" for most modern Markdown). And there it was, in section 4.5: "Fenced Code Blocks."

The spec clearly states:

> A code fence is a sequence of at least three consecutive backtick characters (`) or tilde characters (~).

They are officially, 100% interchangeable.

* ` ``` ` is a code fence.
* ` ~~~ ` is a code fence.
* ` ``````` ` (7 backticks) is a code fence.
* ` ~~~~~~~~~ ` (10 tildes) is a code fence.

The only rule for closing a fence is that the closing fence must use the same character and *at least as many* characters as the opening fence.

The "magic" I'd stumbled upon was simply this: the parser that starts with `~~~` is *only* looking for `~~~` to close it.

It sees the ` ``` ` characters inside and just treats them as regular text. It's not magic, it's just a rule. But when you're a writer staring at a broken page, it feels like magic.

### The "Pro" Method
As I dug deeper, I found there's another way to solve this, which many "spec" purists prefer. You don't have to switch to tildes. You just have to use *more backticks*.

This also works perfectly:

```markdown
## My Awesome Dotfiles

Here is my prompt:
```

```bash
# This is my .zshrc alias
alias ll='ls -alF'
```


By using four backticks (` ``` `) for the outer fence, the parser is now only looking for a closing fence of four backticks. It completely ignores the three-backtick fences (` ``` `) inside.

### 📚 Recommended Resource
This whole experience hammered home a lesson: the tools we use every day are often deeper than we imagine. We "know" Markdown, but we don't *know* it. If you're serious about technical writing, whether for a blog, documentation, or even just your personal notes, having a solid reference is invaluable.

For that, I highly recommend **Markdown for Dummies** by Janine Warner.

Don't let the "Dummies" title fool you. This book is a clear, concise, and comprehensive guide that covers everything from the basics of syntax to more advanced topics like tables, a/b testing with Markdown, and different "flavors" of Markdown (like CommonMark vs. GFM). Honestly, if I'd had this on my desk, it would have saved me an hour of frustrated Googling. It’s a perfect reference to keep handy. [Amazon](https://www.amazon.com/Markdown-Dummies-Janine-Warner/dp/1119933580)

---

### So, ``` vs. ~~~: Which Should You Use?
After all this, I've come to a very strong conclusion. I now have a firm, personal rule for this.

**1. For 99% of my writing: I use ``` (Backticks).**
It's the most common, most recognized, and most expected standard. When I'm just writing a normal post with a simple code block, I use backticks. It's the community default.

**2. When I am writing *about* code: I use ~~~ (Tildes).**
The moment I need to write a tutorial, a "how-to," or any post that *shows a code block as an example*, I immediately use tildes for my outer fences.

**Why not just use more backticks (like ` ``` `)?**
Because `~~~` is **visually distinct**. When I'm scanning my raw `index.md` file, the tildes are a "sign" to my future self. They shout, "Hey! This block is special! This is a meta-block that probably contains other blocks." It's a personal preference, but I find it makes my raw text far more readable.

---

### Key Takeaways 📚
💡 **` ``` ` and ` ~~~ ` are functionally identical.** The CommonMark spec treats them as the same thing: a "code fence." Neither is "better" or "more correct" than the other for a simple code block.

⚙️ **Their difference is their superpower.** Because a `~~~` fence ignores ` ``` ` (and vice-versa), you can use one to "wrap" the other. This is the key to nesting code blocks for tutorials.

📚 **You can also use *more* fences.** An alternative to tildes is to use ` ``` ` (four backticks) to wrap ` ``` ` (three). This also works perfectly. My preference for `~~~` is purely for visual readability in my source files.

Don't be like me. Don't fight the tool. Learn the one simple trick that separates a "broken" tutorial from a "pro" one.

---
Thanks for Following ☕

[☕ If you found this guide helpful, you can Buy Me a Coffee!](https://www.buymeacoffee.com/muratkurkoglu)
[Medium](https://medium.com/@muratkurkoglu)
[Etsy](https://www.etsy.com/shop/orioninsist)
[LinkedIn](https://www.linkedin.com/in/murat-kurkoglu/)
[Read More](https://orioninsist.org/)

> What's your preferred method for code blocks? And have you ever been 'bitten' by this exact nesting problem? Let me know.