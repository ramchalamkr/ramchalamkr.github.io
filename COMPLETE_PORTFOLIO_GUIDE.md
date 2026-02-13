# Complete Portfolio Website Guide
## defendwithgr.github.io

**Created:** February 2026  
**Author:** Gayathri Rajamohan  
**Theme:** Jekyll with Terminal Aesthetic

---

# Table of Contents

1. [Project Overview](#project-overview)
2. [What We Built](#what-we-built)
3. [Technical Architecture](#technical-architecture)
4. [Educational: Core Concepts](#educational-core-concepts)
5. [Maintenance Guide](#maintenance-guide)
6. [Troubleshooting](#troubleshooting)
7. [Quick Reference](#quick-reference)

---

# Project Overview

## Goal
Redesign your portfolio website (defendwithgr.github.io) from the al-folio academic theme to a modern, cybersecurity-focused terminal aesthetic similar to bhavsec.com.

## What Was Accomplished
- ✅ Successfully migrated from al-folio to jekyll-theme-console
- ✅ Created custom terminal-style pages (whoami, projects, blog, resume)
- ✅ Implemented modern cyberpunk aesthetic with gradients and glows
- ✅ Added Azure home lab project to portfolio
- ✅ Updated AI project to reflect learning status
- ✅ Created auto-switching light/dark mode
- ✅ Deployed successfully to GitHub Pages

## Key Features
- **Responsive Design:** Works on desktop and mobile
- **Auto Dark Mode:** Switches based on system preference
- **Terminal Aesthetic:** Monospace fonts, colorful prompts, cyberpunk styling
- **Modern Enhancements:** Gradients, animations, card layouts, glowing effects

---

# What We Built

## File Structure
```
defendwithgr.github.io/
├── _config.yml              # Main site configuration
├── Gemfile                  # Ruby dependencies
├── _includes/
│   └── head.html            # Custom CSS injection
├── assets/
│   └── css/
│       └── custom.css       # Enhanced terminal styles
├── index.md                 # Home page
├── whoami.md                # About page
├── projects.md              # Projects listing
├── blog.md                  # Blog/writeups
├── resume.md                # Resume/CV
└── MAINTENANCE_GUIDE.md     # Site maintenance reference
```

## Pages Created

### 1. Home (index.md)
- Terminal-style introduction
- ASCII art welcome
- Quick links to main sections

### 2. whoami.md
- Professional background
- Current role as SOC Analyst
- Work experience summary
- Certifications (CCNA, ITILv4, ISC2 CC, Google Cybersecurity)
- Technical skills overview

### 3. projects.md
Contains 4 main projects:
1. **Cybersecurity Incident Response Plan** - Big Leaf Enterprise
2. **Vulnerability Assessment & Penetration Testing (VAPT)** - Active project
3. **Azure Home Lab** - Security operations environment ⭐ (NEW)
4. **AI in Cybersecurity** - Learning journey (UPDATED)

### 4. blog.md
- TryHackMe writeups
- Medium articles
- Technical blog posts

### 5. resume.md
- Full professional experience
- Education background
- Certifications
- Technical skills categorized by:
  - Security Tools
  - SIEM & Analytics
  - Cloud Platforms
  - Programming Languages

---

# Technical Architecture

## Theme: jekyll-theme-console

### Why This Theme?
- **Minimalist design** perfect for terminal aesthetic
- **GitHub Pages compatible** via remote_theme
- **Lightweight and fast**
- **Easy to customize**

### Configuration (_config.yml)
```yaml
remote_theme: b2a3e8/jekyll-theme-console
style: light
listen_for_clients_preferred_style: true
```

## Custom Styling (custom.css)

### Design System

**Light Mode:**
- Background: Soft gradient (white to light gray)
- Text: Dark gray (#2b2d42)
- Accent colors: Cyan (#00d9ff), Neon Green (#06ffa5), Hot Pink (#ff006e)

**Dark Mode (Cyberpunk):**
- Background: Deep dark (#0a0e27)
- Text: Light gray (#e0e6ed)
- Glowing effects: Multi-color radial gradients
- Neon accents with text shadows

### Key Visual Elements
1. **Terminal Prompts:** Green/cyan colored with glow effects
2. **Headings:** Gradient underlines, shadow effects
3. **Links:** Smooth transitions, hover effects
4. **Cards:** Subtle shadows, gradient backgrounds
5. **Animations:** Fade-in page entrance, blinking cursor

---

# Educational: Core Concepts

## What is Jekyll?

**Jekyll** is a static site generator that transforms plain text (Markdown files) into a complete website.

### How It Works
```
Markdown Files (.md) → Jekyll Parser → HTML Website
     ↓
   _config.yml
   Gemfile
   Liquid Templates
```

### Benefits
- ✅ **Fast:** No database queries
- ✅ **Secure:** Static files, no server-side code
- ✅ **Free Hosting:** GitHub Pages support
- ✅ **Version Control:** Everything in Git
- ✅ **Easy Content:** Write in Markdown

### Jekyll vs Static HTML
| Feature | Jekyll | Static HTML |
|---------|--------|-------------|
| Content Updates | Edit .md files | Edit every HTML file |
| Reusable Components | Yes (includes) | Manual copy-paste |
| Blog Posts | Automatic listing | Manual updates |
| Themes | Easy to switch | Rebuild from scratch |

## What is a Gemfile?

A **Gemfile** lists all Ruby packages (gems) your Jekyll site needs.

### Your Gemfile
```ruby
source "https://rubygems.org"

gem "jekyll", "~> 4.4"           # Jekyll engine
gem "jekyll-theme-console"       # Terminal theme
gem "jekyll-feed"                # RSS feed
gem "jekyll-seo-tag"             # SEO optimization
gem "jekyll-sitemap"             # Sitemap generation
gem "jekyll-remote-theme"        # Remote theme support
```

### Common Commands
```bash
bundle install   # Install all gems
bundle update    # Update gems to latest versions
bundle exec jekyll serve  # Run development server
```

## What is Liquid?

**Liquid** is Jekyll's templating language - it adds dynamic content to your pages.

### Syntax Examples

**Variables:**
```liquid
{{ site.title }}        # Outputs: "defendwithgr"
{{ page.title }}        # Outputs: current page title
```

**Conditionals:**
```liquid
{% if page.title == "whoami" %}
  This is the about page!
{% endif %}
```

**Loops:**
```liquid
{% for post in site.posts %}
  <li>{{ post.title }}</li>
{% endfor %}
```

**Includes:**
```liquid
{% include head.html %}
```

### Where You See Liquid
- Theme layout files (`_layouts/`)
- Include files (`_includes/head.html`)
- Custom navigation menus
- Dynamic content generation

## Jekyll vs Hugo

| Feature | Jekyll | Hugo |
|---------|--------|------|
| **Language** | Ruby | Go |
| **Speed** | Slower (Ruby interpreted) | Very fast (Go compiled) |
| **Learning Curve** | Easier for beginners | Steeper |
| **GitHub Pages** | ✅ Native support | ⚠️ Manual build required |
| **Themes** | Large ecosystem | Growing |
| **Templating** | Liquid (simple) | Go templates (complex) |
| **Best For** | Portfolios, blogs | Large documentation sites |

### Why We Chose Jekyll
1. **GitHub Pages Integration:** Zero configuration deployment
2. **Easier to Learn:** Simpler syntax and concepts
3. **Great Theme Ecosystem:** jekyll-theme-console works perfectly
4. **Lower Maintenance:** No build pipeline setup needed

## GitHub Pages Deployment

### How It Works
```
1. Push code to GitHub
   ↓
2. GitHub detects Jekyll site
   ↓
3. Builds site automatically
   ↓
4. Deploys to username.github.io
```

### Configuration
- **Repository:** defendwithgr/defendwithgr.github.io
- **Branch:** terminal-redesign
- **URL:** https://defendwithgr.github.io/

### Deployment Time
- Typical: 2-3 minutes after push
- Check status: Settings → Pages or Actions tab

---

# Maintenance Guide

## Common Tasks

### 1. Update Content

#### Edit About Page
**File:** `whoami.md`
```markdown
## Who I Am
[Edit your introduction here]

## Current Role
[Update your position]
```

#### Add/Update Projects
**File:** `projects.md`
```markdown
## [5] New Project Name
**Duration:** Start - End | **Type:** Category

Description of your project...

### Key Activities
- Activity 1
- Activity 2

**Technologies:** Tool1, Tool2, Tool3
```

#### Add Blog Posts
**File:** `blog.md`
```markdown
### [2026-02-15] New TryHackMe Walkthrough
Brief description and [link to writeup](url)
```

#### Update Resume
**File:** `resume.md`
- Add new experience under `## Professional Experience`
- Add certifications under `## Certifications`
- Update skills under `## Technical Skills`

### 2. Customize Visual Styling

#### Change Colors
**File:** `assets/css/custom.css`

**Light Mode:**
```css
body {
  background: #ffffff;
  color: #2b2d42;
}

.term-prompt {
  color: #06ffa5;  /* Change this */
}

.term-filename {
  color: #ff006e;  /* Change this */
}
```

**Dark Mode:**
```css
@media (prefers-color-scheme: dark) {
  body {
    background: #0a0e27;
  }
  
  .term-prompt {
    color: #00ff00;  /* Bright green */
  }
}
```

#### Popular Color Schemes

**Matrix Green:**
```css
.term-prompt { color: #00ff00; }
.term-filename { color: #33ff33; }
```

**Cyberpunk Pink/Cyan:**
```css
.term-prompt { color: #00d9ff; }
.term-filename { color: #ff006e; }
```

**Hacker Blue:**
```css
.term-prompt { color: #0066ff; }
.term-filename { color: #00ccff; }
```

### 3. Add New Pages

#### Step 1: Create File
Create `contact.md`:
```markdown
---
layout: page
title: contact
permalink: /contact.html
---

# <span class="term-prompt">></span> contact <span class="term-cursor">█</span>

Your content here...
```

#### Step 2: Add to Navigation
Edit `_config.yml`:
```yaml
header_pages:
  - index.md
  - whoami.md
  - projects.md
  - blog.md
  - resume.md
  - contact.md  # Add new page
```

### 4. Site Configuration

**File:** `_config.yml`

```yaml
# Basic info
title: Your Name
email: your@email.com
description: Your professional tagline

# Footer
footer: >
  © 2026 Your Name | 
  <a href="https://linkedin.com/in/yourprofile">LinkedIn</a>

# Theme
remote_theme: b2a3e8/jekyll-theme-console
style: light  # or dark
listen_for_clients_preferred_style: true
```

---

# Workflow

## Local Development

### Setup (One-time)
```bash
# Install dependencies
bundle install

# Start development server
bundle exec jekyll serve
```

### Development Loop
```bash
# 1. Make changes to .md files or CSS
nano whoami.md

# 2. View at http://localhost:4000
# (auto-refreshes on file save)

# 3. Commit when satisfied
git add -A
git commit -m "Updated whoami page"
git push origin terminal-redesign
```

## Deployment Workflow

### Quick Updates (No Local Testing)
```bash
# Edit files
nano projects.md

# Commit and push
git add projects.md
git commit -m "Added new project"
git push origin terminal-redesign

# Wait 2-3 minutes
# Check https://defendwithgr.github.io/
```

### Full Testing Workflow
```bash
# 1. Edit files
nano resume.md

# 2. Test locally
bundle exec jekyll serve

# 3. View at http://localhost:4000

# 4. Deploy
git add -A
git commit -m "Updated resume"
git push origin terminal-redesign

# 5. Verify deployment
# GitHub Actions: Check for green checkmark
# Live site: https://defendwithgr.github.io/
```

---

# Troubleshooting

## Common Issues

### 1. Site Not Updating on GitHub Pages

**Symptoms:** Changes pushed but old site still showing

**Solutions:**
```bash
# Solution 1: Hard refresh browser
# Mac: Cmd + Shift + R
# Windows: Ctrl + Shift + R

# Solution 2: Check GitHub Actions
# Go to: github.com/defendwithgr/defendwithgr.github.io/actions
# Look for green checkmark on latest run

# Solution 3: Wait longer
# GitHub Pages can take 3-5 minutes sometimes

# Solution 4: Clear browser cache
# Settings → Privacy → Clear browsing data
```

### 2. Local Build Fails

**Symptoms:** `bundle exec jekyll serve` errors

**Solutions:**
```bash
# Solution 1: Reinstall dependencies
bundle install

# Solution 2: Clear cache
bundle exec jekyll clean
bundle exec jekyll serve

# Solution 3: Update gems
bundle update

# Solution 4: Check for syntax errors in _config.yml
# Use a YAML validator online
```

### 3. CSS Changes Not Showing

**Symptoms:** Updated custom.css but no visual changes

**Solutions:**
```bash
# Solution 1: Hard refresh browser
# Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

# Solution 2: Verify file saved
ls -la assets/css/custom.css

# Solution 3: Check _includes/head.html exists
cat _includes/head.html

# Solution 4: Clear Jekyll cache
bundle exec jekyll clean

# Solution 5: Verify CSS linking in head.html
# Should have:
# <link rel="stylesheet" href="{{ '/assets/css/custom.css' | relative_url }}">
```

### 4. GitHub Pages Build Failing

**Symptoms:** Red X in Actions tab

**Solutions:**
```bash
# Check the error logs:
# 1. Go to github.com/defendwithgr/defendwithgr.github.io/actions
# 2. Click on failed run
# 3. Read error message

# Common fixes:
# - Use remote_theme instead of theme:
remote_theme: b2a3e8/jekyll-theme-console

# - Remove unsupported plugins from _config.yml
# - Check for YAML syntax errors
# - Ensure Gemfile has jekyll-remote-theme
```

### 5. Content Not Displaying

**Symptoms:** Blank pages or missing content

**Solutions:**
```markdown
# Check front matter in .md files:
---
layout: page
title: whoami
permalink: /whoami.html
---

# Ensure file is in root directory
# Verify header_pages in _config.yml includes the file
```

---

# Quick Reference

## File → Purpose Mapping

| File | What It Does |
|------|--------------|
| `_config.yml` | Site settings, navigation, theme configuration |
| `Gemfile` | Ruby packages and dependencies |
| `index.md` | Home page content |
| `whoami.md` | About/profile page |
| `projects.md` | Projects listing |
| `blog.md` | Blog/writeups index |
| `resume.md` | Full resume/CV |
| `assets/css/custom.css` | Custom styling (colors, fonts, effects) |
| `_includes/head.html` | Loads custom CSS into pages |
| `MAINTENANCE_GUIDE.md` | This guide! |

## Essential Commands

### Local Development
```bash
# Start dev server
bundle exec jekyll serve

# Open in browser
open http://localhost:4000

# Stop server
Ctrl+C
```

### Git/Deployment
```bash
# Quick commit and deploy
git add -A
git commit -m "Update content"
git push origin terminal-redesign

# Check status
git status

# View commit history
git log --oneline

# Create new branch
git checkout -b new-feature
```

### Troubleshooting
```bash
# Reinstall gems
bundle install

# Clear Jekyll cache
bundle exec jekyll clean

# Check Ruby/Jekyll versions
ruby -v
jekyll -v
bundle -v
```

## Color Reference

### Current Color Palette

**Light Mode:**
- Background: `#f8f9fa` → `#e9ecef` (gradient)
- Text: `#2b2d42`
- Prompt: `#06ffa5` (neon green)
- Path: `#00d9ff` (cyan)
- Filename: `#ff006e` (hot pink)
- Links: `#0066ff` → `#00d9ff` (hover)

**Dark Mode:**
- Background: `#0a0e27`
- Text: `#e0e6ed`
- Prompt: `#00ff00` (bright green, glowing)
- Path: `#00d9ff` (cyan, glowing)
- Filename: `#ff6b6b` (bright red, glowing)
- Links: `#00d9ff` → `#06ffa5` (hover)

### Terminal Color Classes
```html
<span class="term-prompt">></span>    <!-- Green prompt -->
<span class="term-path">~</span>      <!-- Cyan/green path -->
<span class="term-filename">file.md</span>  <!-- Red filename -->
<span class="term-cursor">█</span>    <!-- Blinking cursor -->
```

## Useful Links

### Documentation
- Jekyll Docs: https://jekyllrb.com/docs/
- Liquid Syntax: https://shopify.github.io/liquid/
- Markdown Guide: https://www.markdownguide.org/
- Theme Docs: https://github.com/b2a3e8/jekyll-theme-console

### Tools
- YAML Validator: https://www.yamllint.com/
- Markdown Preview: https://markdownlivepreview.com/
- Color Picker: https://colorhunt.co/

### Your Site
- Live Site: https://defendwithgr.github.io/
- Repository: https://github.com/defendwithgr/defendwithgr.github.io
- GitHub Actions: https://github.com/defendwithgr/defendwithgr.github.io/actions
- Settings: https://github.com/defendwithgr/defendwithgr.github.io/settings/pages

---

# Key Learnings Summary

## Technical Skills Gained

1. **Static Site Generators**
   - Understanding Jekyll architecture
   - Working with Gemfiles and Ruby gems
   - Using Liquid templating language

2. **GitHub Pages**
   - Deployment workflows
   - Branch management
   - Actions/CI-CD basics

3. **CSS Styling**
   - Custom theming
   - Responsive design
   - Dark mode implementation with media queries
   - CSS animations and transitions

4. **Version Control**
   - Git branching strategy
   - Commit best practices
   - Repository management

## Design Principles Applied

1. **Visual Hierarchy**
   - Clear headings with underlines
   - Card-based layouts for sections
   - Proper spacing and margins

2. **Color Theory**
   - Neon accents for terminal aesthetic
   - High contrast for readability
   - Complementary color schemes (cyan/pink/green)

3. **User Experience**
   - Fast load times (static site)
   - Responsive mobile design
   - Auto dark/light mode
   - Smooth animations

4. **Accessibility**
   - High contrast text
   - Readable fonts (monospace but clear)
   - Semantic HTML structure

---

# Project Timeline

## Phase 1: Planning & Research
- Explored bhavsec.com for inspiration
- Researched Jekyll themes
- Selected jekyll-theme-console

## Phase 2: Theme Setup
- Removed al-folio theme
- Installed jekyll-theme-console
- Configured _config.yml
- Set up remote_theme for GitHub Pages compatibility

## Phase 3: Content Migration
- Created terminal-style pages (index, whoami, projects, blog, resume)
- Migrated content from al-folio
- Added terminal prompts and styling

## Phase 4: Visual Enhancement
- Initial CSS with purple glow background
- Fixed readability issues (text colors)
- Switched to light theme with dark mode support
- Major CSS enhancement with cyberpunk aesthetics

## Phase 5: Content Updates
- Added Azure Home Lab project
- Updated AI project to learning status
- Refined project descriptions

## Phase 6: Final Polish
- Enhanced CSS with gradients and animations
- Added card layouts
- Implemented smooth transitions
- Created comprehensive documentation

---

# Final Notes

## What Makes This Portfolio Special

1. **Unique Terminal Aesthetic:** Stands out from typical portfolio sites
2. **Cybersecurity Focus:** Design matches your field (hacker/terminal theme)
3. **Modern & Professional:** Balance between creative and professional
4. **Easy to Maintain:** Simple Markdown files, clear structure
5. **Auto Dark Mode:** Respects user preferences
6. **Fast & Secure:** Static site, no vulnerabilities

## Future Enhancement Ideas

### Content
- [ ] Add detailed project pages with screenshots
- [ ] Create blog posts for TryHackMe walkthroughs
- [ ] Add vulnerability research writeups
- [ ] Include CTF achievements

### Features
- [ ] Add a contact form
- [ ] Implement search functionality
- [ ] Add tags/categories for projects
- [ ] Include project demos/videos

### Design
- [ ] Add subtle particle effects background
- [ ] Create custom 404 page
- [ ] Add loading animations
- [ ] Include Easter eggs for fun

## Remember

✅ **Content is King:** Focus on showcasing your work and skills  
✅ **Keep It Updated:** Regular updates show active engagement  
✅ **Get Feedback:** Share with peers and mentors  
✅ **Monitor Analytics:** See what people view most  
✅ **Stay Authentic:** Let your personality show through

---

**Good luck with your portfolio! 🚀**

*If you need any help, refer back to this guide or the MAINTENANCE_GUIDE.md file in your repository.*

---

**Document Version:** 1.0  
**Last Updated:** February 12, 2026  
**Contact:** Gayathri Rajamohan | [LinkedIn](https://linkedin.com/in/gayathri-rajamohan)
