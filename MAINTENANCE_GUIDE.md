# Portfolio Maintenance & Education Guide

Your complete reference for updating and understanding your portfolio website.

---

## 📁 File Structure Overview

```
defendwithgr.github.io/
├── _config.yml          # Main site configuration
├── Gemfile              # Ruby dependencies
├── _includes/           # Reusable HTML snippets
│   └── head.html        # Custom CSS injection
├── assets/
│   └── css/
│       └── custom.css   # Your custom terminal styles
├── index.md             # Home page
├── whoami.md            # About page
├── projects.md          # Projects listing
├── blog.md              # Blog/writeups index
└── resume.md            # Resume/CV page
```

---

## 🔧 Common Tasks & Where to Edit

### 1. **Update Your Content**

#### ✏️ Edit About/Profile Info
**File:** `whoami.md`
```markdown
## Who I Am
[Edit your introduction here]

## What I Do
[Edit your current role and responsibilities]
```

#### 📊 Add/Update Projects
**File:** `projects.md`
```markdown
### 🔐 [Your New Project Name]
**Description:** What this project does
**Tech Stack:** Python, Docker, etc.
**Links:** [GitHub](url) | [Demo](url)
```

#### 📝 Add Blog Posts/Writeups
**File:** `blog.md`
```markdown
### [2026-02-12] New TryHackMe Walkthrough
Brief description and link to the writeup
```

#### 💼 Update Resume
**File:** `resume.md`
- Add new work experience under `## Professional Experience`
- Add certifications under `## Certifications`
- Update skills under `## Technical Skills`

### 2. **Change Visual Styling**

#### 🎨 Customize Colors
**File:** `assets/css/custom.css`

```css
/* Change terminal prompt color */
.term-prompt {
  color: #00ff00 !important;  /* Change to any color */
}

/* Change filename color */
.term-filename {
  color: #ff6b6b !important;  /* Change to any color */
}

/* Adjust purple glow intensity */
body::before {
  background: radial-gradient(ellipse at center, 
    rgba(76, 0, 130, 0.15) 0%,    /* Adjust these values */
    rgba(25, 25, 112, 0.25) 30%,
    rgba(0, 0, 0, 0.9) 70%,
    rgba(0, 0, 0, 1) 100%
  );
}
```

### 3. **Add/Remove Navigation Pages**

#### Add a New Page
1. Create new file: `contact.md`
```markdown
---
layout: page
title: contact
permalink: /contact.html
---

# <span class="term-prompt">></span> contact <span class="term-cursor">█</span>

Your content here...
```

2. Add to navigation in `_config.yml`:
```yaml
header_pages:
  - index.md
  - whoami.md
  - projects.md
  - blog.md
  - resume.md
  - contact.md  # Add your new page
```

#### Remove a Page
1. Delete the `.md` file
2. Remove from `header_pages` in `_config.yml`

### 4. **Site Configuration**

**File:** `_config.yml`

```yaml
# Update site metadata
title: Your Name
email: your@email.com
description: Your site description

# Change footer links
footer: >
  © 2026 Your Name | 
  <a href="https://linkedin.com/in/yourprofile">LinkedIn</a>
```

---

## 📚 Educational: Core Concepts

### What is Jekyll?

**Jekyll** is a **static site generator** - it takes your content (written in Markdown) and templates, and generates a complete website of static HTML files.

**Key Benefits:**
- ✅ Fast and secure (no database)
- ✅ Free hosting on GitHub Pages
- ✅ Write content in Markdown (simple text format)
- ✅ Version control with Git

**How it works:**
```
Your Markdown Files → Jekyll Processes → Static HTML Website
   (index.md)                              (index.html)
```

### What is a Gemfile?

A **Gemfile** is like a shopping list for your Ruby/Jekyll project. It tells the system which "gems" (Ruby packages) your site needs.

**Your Gemfile:**
```ruby
source "https://rubygems.org"

gem "jekyll", "~> 4.4"              # The Jekyll engine
gem "jekyll-theme-console"          # Your theme
gem "jekyll-feed"                   # RSS feed generator
gem "jekyll-seo-tag"                # SEO optimization
```

**When to update it:**
- Adding a new Jekyll plugin
- Upgrading Jekyll version
- Installing a different theme

**Commands:**
```bash
bundle install   # Install all gems listed in Gemfile
bundle update    # Update gems to latest versions
```

### What is Liquid?

**Liquid** is Jekyll's templating language - it lets you add dynamic content and logic to your pages.

**Examples:**

```liquid
<!-- Variables -->
{{ site.title }}              Output: "defendwithgr"
{{ page.title }}              Output: "whoami"

<!-- Logic -->
{% if page.title == "whoami" %}
  This is the about page!
{% endif %}

<!-- Loops -->
{% for post in site.posts %}
  <li>{{ post.title }}</li>
{% endfor %}

<!-- Include files -->
{% include head.html %}
```

**Where you see it:**
- Theme layout files  (`_layouts/`)
- Include files (`_includes/head.html`)
- Your custom includes

### Jekyll vs Hugo

Both are static site generators, but with different approaches:

| Feature | Jekyll | Hugo |
|---------|--------|------|
| **Language** | Ruby | Go |
| **Speed** | Slower (Ruby) | Very fast (Go) |
| **Ease of Use** | Easier for beginners | Steeper learning curve |
| **GitHub Pages** | ✅ Native support | ⚠️ Requires manual build |
| **Themes** | Large ecosystem | Growing ecosystem |
| **Templating** | Liquid | Go templates |

**Your site uses Jekyll because:**
1. ✅ Free GitHub Pages hosting with zero configuration
2. ✅ Easier to learn and maintain
3. ✅ Great theme ecosystem (jekyll-theme-console)
4. ✅ Simpler workflow for non-technical users

---

## 🚀 Workflow for Making Changes

### Local Development Workflow

```bash
# 1. Make your changes to .md files or custom.css
nano whoami.md

# 2. Test locally
bundle exec jekyll serve

# 3. View at http://localhost:4000

# 4. When satisfied, commit and push
git add -A
git commit -m "Updated whoami page with new project"
git push origin terminal-redesign
```

### Quick Updates (No Local Testing)

```bash
# 1. Edit files directly on GitHub.com
# 2. Commit changes
# 3. Wait 2-3 minutes for GitHub Pages to rebuild
# 4. Check https://defendwithgr.github.io/
```

---

## 🎨 Common Customizations

### Change Background Glow Color

**File:** `assets/css/custom.css`

```css
/* Purple/Blue (current) */
rgba(76, 0, 130, 0.15)  /* Purple */

/* Green Matrix style */
rgba(0, 255, 0, 0.15)   /* Green */

/* Red Cyberpunk style */
rgba(255, 0, 100, 0.15) /* Red/Pink */

/* Blue Neon */
rgba(0, 100, 255, 0.15) /* Blue */
```

### Add Emoji to Headers

```markdown
# 🔐 $ cat security_projects.txt
# 🎯 $ ls achievements/
# 💻 $ whoami
```

### Change Cursor Style

**File:** `assets/css/custom.css`

```css
.term-cursor {
  color: #00ff00;
  /* Change cursor character in your .md files: */
  /* █ ▊ ▌ ▎ | _ */
}
```

---

## 🔍 Troubleshooting

### Site isn't updating on GitHub Pages
1. Check Settings → Pages (should deploy from `terminal-redesign` or `main`)
2. Wait 2-3 minutes after pushing
3. Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)

### Local build fails
```bash
# Reinstall dependencies
bundle install

# Clear cache
bundle exec jekyll clean

# Rebuild
bundle exec jekyll serve
```

### CSS changes not showing
1. Clear browser cache
2. Check file saved: `assets/css/custom.css`
3. Verify `_includes/head.html` exists and loads the CSS

---

## 📞 Quick Reference

### File → Purpose Mapping

| File | What It Does |
|------|--------------|
| `_config.yml` | Site settings, navigation, metadata |
| `Gemfile` | List of Ruby packages/plugins |
| `index.md` | Home page content |
| `whoami.md` | About page |
| `projects.md` | Projects listing |
| `blog.md` | Blog/writeups index |
| `resume.md` | Resume/CV |
| `assets/css/custom.css` | Visual styling (colors, glows, effects) |
| `_includes/head.html` | Loads custom CSS into pages |

### Essential Commands

```bash
# Test locally
bundle exec jekyll serve

# Deploy changes
git add -A && git commit -m "Update" && git push

# View site
open http://localhost:4000  # Local
open https://defendwithgr.github.io  # Live
```

---

## 🎓 Learning More

- **Jekyll Docs:** https://jekyllrb.com/docs/
- **Liquid Syntax:** https://shopify.github.io/liquid/
- **Markdown Guide:** https://www.markdownguide.org/
- **Theme Docs:** https://github.com/b2a3e8/jekyll-theme-console

---

**Remember:** Your site is just Markdown files + some configuration. Don't be afraid to experiment - you can always undo changes with Git! 🚀
