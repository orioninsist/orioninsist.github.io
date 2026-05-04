+++

date = 2025-11-16T16:57:38+03:00
publishDate = 2025-11-16T16:57:38+03:00
lastmod = 2025-11-16T16:57:38+03:00
ShowReadingTime = true
ShowToc = true
TocOpen = true
ShowBreadCrumbs = true # PaperMod setting for navigation [36]
ShowPostNavLinks = true # PaperMod setting for post navigation [36]
ShowShareButtons = true # PaperMod setting to show share buttons [36]
ShowCodeCopyButtons = true # PaperMod setting for code copy buttons [36]
ShowWordCount = true # PaperMod setting to show word count [36]


draft = false 


title = "chmod vs chown: The Practical Differences Explained"
author = "Murat Kurkoglu"
description = "Learn the real differences between chmod and chown, how each affects Linux file permissions, and the exact scenarios where they fix permission errors."
summary = "chmod vs chown explained with real life Linux scenarios and clear examples."
slug = "chmod-vs-chown"
tags = ["linux", "devops", "permissions", "security"]
categories = ["Technology"]
keywords = ["chmod", "chown", "linux permissions", "file rights", "devops", "sysadmin"]
[cover]
    image = "images/blog/2025/11/2025-11-16-chmod-vs-chown-watermarked.avif"
    alt = "Minimalistic Linux permissions illustration"
    caption = "Understanding chmod vs chown in Linux"
    relative = true
+++


## Why I Wrote This Guide

If you've ever worked on a Linux system long enough, you've definitely seen this error:

```
Permission denied
```

It happens during copying, deleting, editing, moving, running shell scripts — basically anywhere.  
The funny part? The fix is almost always either:

- **chmod** → permissions  
- **chown** → ownership  

But most beginners (and even many developers) use them incorrectly.  
So today, I’m breaking down *exactly* how they differ, *when* to use each one, and *how* they can save your system in real-world scenarios.

---

## ## Understanding the Core Difference

### ### 1. chmod — Controls *what* actions are allowed  
`chmod` changes **permissions**.

It allows you to define **who can read, write, or execute** a file or folder.

Think of chmod as the “rules” of the house.

Examples:

~~~bash
chmod 755 script.sh
chmod u+x install.sh
chmod -R 644 /var/www/html
~~~

It only controls **what** people can do — **not who the owner is**.

---

### ### 2. chown — Controls *who* owns the file  
`chown` changes **ownership**.

You can change:

- File owner  
- File group  
- Or both simultaneously  

Think of chown as “this house belongs to…”.

Example:

~~~bash
sudo chown murat:murat script.sh
sudo chown www-data:www-data /var/www/html -R
~~~

It doesn't change the permissions — only the owner.

---

## ## Real Scenario #1 — The Web Server Problem

### Situation  
You deployed a web app into `/var/www/html` and you get:

```
Permission denied
```

### Beginner mistake  
They try:

~~~bash
chmod 777 -R /var/www/html
~~~

This “works”, but it's a **major security disaster**.

### Real fix  
Apache/Nginx runs as `www-data`.

So:

~~~bash
sudo chown -R www-data:www-data /var/www/html
~~~

Now the process owns the folder → safe and correct.

**Lesson:**  
If a program/service needs access, it's usually an **ownership** issue → use **chown**.

---

## ## Real Scenario #2 — The Shell Script Not Running

### Situation  
You downloaded a script and try:

~~~bash
./install.sh
~~~

You get:

```
Permission denied
```

### Real fix  
It’s missing execute permission:

~~~bash
chmod +x install.sh
~~~

**Lesson:**  
If the error appears when running a file → it’s a **permissions** issue → use **chmod**.

---

## ## Real Scenario #3 — You Can't Edit a File in /etc

Linux system files belong to `root`.  
You open nano or vim and get:

```
E212: Can't open file for writing
```

### Real fix  
Don’t change permission or ownership.

Just use sudo:

~~~bash
sudo nano /etc/hosts
~~~

**Lesson:**  
Never use chmod/chown on system files unless you understand the impact.

---

## ## Real Scenario #4 — Git Clone Creates Wrong Owner

When you clone a repo inside `/var/www` while logged in as root, the files become owned by root.  
Then your normal user can’t edit them.

### Real fix

~~~bash
sudo chown -R murat:murat /var/www/project
~~~

---

## ## Real Scenario #5 — Docker Volume Permission Hell

Docker containers run as a specific UID/GID.  
When container-created files appear “locked”, it’s because the container user owns them.

### Real fix

~~~bash
sudo chown -R $USER:$USER data/
~~~

Or for web apps:

~~~bash
sudo chown -R www-data:www-data data/
~~~

**Lesson:**  
Docker permission issues are ownership problems.

---

## ## When to Use chmod (Cheat Sheet)

Use **chmod** when you need to modify *actions*:

| Problem | Fix |
|--------|------|
| Can't run a script | chmod +x file |
| Can't read a file | chmod +r file |
| Can't write to a folder | chmod +w folder |
| Need recursive permission | chmod -R 755 folder |
| Need to expose static files | chmod 644 *.html |

---

## ## When to Use chown (Cheat Sheet)

Use **chown** when the wrong user or program owns the file:

| Problem | Fix |
|--------|------|
| Nginx can’t read website folder | chown www-data:www-data |
| Docker volume locked | chown $USER:$USER |
| Git created files as root | chown -R user:user |
| Moving files between users | chown -R newuser:newuser |
| Repairing server file access | chown -R service:service |

---

## ## The Biggest Mistakes People Make

### ### ❌ Mistake 1: Using chmod 777  
This gives full access to everyone.  
Hackers love it. Don’t do this unless you absolutely must (rare).

---

### ### ❌ Mistake 2: Changing ownership of system files  
Example:

~~~bash
sudo chown user:user /etc/passwd
~~~

This destroys the system.

---

### ### ❌ Mistake 3: Mixing chmod and chown randomly  
Fixing permissions is never guesswork.  
Identify the problem → apply the right command.

---

## ## Final Thoughts

Once you understand that:

- **chmod = what actions**  
- **chown = who owns**  

…Linux permissions suddenly feel simple and elegant.

After years in DevOps and system administration, I’ve learned one thing:

**90% of Linux permission errors come from ownership issues.  
The other 10% are missing execute or write permissions.**

If you master these two commands, you’ll avoid so many headaches — and fix systems faster than most junior admins.
