+++
title = '{{ replace .File.ContentBaseName `-` ` ` | title }}'
date = '{{ .Date }}'
lastmod = '{{ .Date }}'
draft = true

# SEO REQUIRED
# - title: clear promise, no clickbait
# - description: 140-160 chars, user intent focused
# - summary: 1-2 sentences, concrete value
# - slug: short, readable, topic-focused
# - canonicalURL: set if this content is republished elsewhere
# - cover.alt: descriptive image alt text
# - keywords/tags/categories: only truly relevant terms
author = "Murat Kurkoglu"
description = ""
summary = ""
slug = ""
canonicalURL = ""
keywords = []
tags = []
categories = []

ShowReadingTime = true
ShowWordCount = true
ShowToc = true
TocOpen = true
ShowBreadCrumbs = true
ShowPostNavLinks = true
ShowShareButtons = true
ShowCodeCopyButtons = true

[cover]
  image = ""
  alt = ""
  caption = ""
  relative = true

# PUBLISH CHECKLIST
# [ ] One search intent only (single problem)
# [ ] Intro explains problem + solution + target reader
# [ ] Includes real examples/commands/output
# [ ] Includes 3-8 relevant internal links
# [ ] Includes external links only to authoritative sources
# [ ] Includes "when to use / when not to use"
# [ ] Includes risks and rollback notes if technical
# [ ] Updated lastmod when content changes
+++
