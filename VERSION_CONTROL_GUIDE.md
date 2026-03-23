# Version Control Guide for ReCare GYM Website

## Current Implementation Summary

### What Was Just Added:
✅ **Muted video hero section** with mobile optimization
- Video: Pexels stock gym/fitness video (free, CC0 license)
- Duration: ~8 seconds loop
- Attributes: `autoplay`, `muted`, `loop`, `playsinline`
- Mobile-friendly: `playsinline` allows inline video on mobile Safari
- Fallback: Image poster shows while loading

### File Changes:
- `index.html` - Updated hero section with video element
- All trainer cards & features remain unchanged

---

## Setting Up GitHub for Version Control

### Why GitHub Instead of Duplicating Files:
| Feature | GitHub | File Duplication |
|---------|--------|------------------|
| Version History | ✅ Complete | ❌ Messy |
| Easy Rollback | ✅ One command | ❌ Manual file swap |
| File Comparison | ✅ Built-in diff | ❌ Manual comparison |
| Cleanup | ✅ No duplicates | ❌ Cluttered folder |
| Collaboration | ✅ Easy sharing | ❌ Confusing |
| Space Efficient | ✅ Optimal | ❌ Duplicate storage |

---

## Step-by-Step GitHub Setup

### 1. Initialize Git Repository
```bash
cd /Users/curi/Desktop/HI/recaregym_website

# Initialize git
git init

# Configure git (if first time)
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### 2. Create First Commit (Before Video)
```bash
# Stage all files
git add .

# Create initial commit
git commit -m "Initial commit: Static image hero with trainer profiles"

# Check status
git status
```

### 3. Create a Branch for Video Feature
```bash
# Create and switch to new branch
git checkout -b feature/video-hero

# Make changes (already done - video hero)

# Stage changes
git add index.html

# Commit with descriptive message
git commit -m "feat: add video hero section with mobile optimization

- Implement muted video autoplay
- Add image fallback for old browsers
- Optimize for mobile with playsinline
- Maintain dark overlay for text readability
- Video from Pexels (free, CC0)"
```

### 4. Switch Between Versions
```bash
# See all branches
git branch -a

# Switch to main (static image version)
git checkout main

# Switch back to video version
git checkout feature/video-hero
```

---

## Reverting to Previous Version (If Needed)

```bash
# View commit history
git log --oneline

# Revert to specific commit
git checkout <commit-hash> -- index.html

# Or reset entire branch to previous commit
git reset --hard <commit-hash>
```

---

## Create GitHub Remote (Cloud Backup)

### If You Want Cloud Backup:
```bash
# Create new repo on GitHub (https://github.com/new)
# Then connect local repo:

git remote add origin https://github.com/YOUR_USERNAME/recaregym-website.git
git branch -M main
git push -u origin main
```

---

## Current File Structure with Git

```
recaregym_website/
├── index.html (with video hero)
├── trainers.html
├── trainers.js
├── PLAN.md
├── IMAGE_ADDITIONS.md
├── .git/ (git metadata - hidden folder)
└── .gitignore (optional - what to ignore)
```

---

## Useful Git Commands Reference

```bash
# Check what changed
git diff

# See commit history
git log

# Create new branch from current
git checkout -b branch-name

# Merge branch into main
git checkout main
git merge feature/video-hero

# View all changes between branches
git diff main..feature/video-hero

# Delete a branch (after merging)
git branch -d feature/video-hero
```

---

## Video Implementation Details

### Video Source:
- **Resource**: Pexels Videos (free, no attribution needed)
- **Current Video**: Gym/fitness workout scene (~8 seconds)
- **License**: CC0 (Public Domain)
- **Mobile Optimized**: Yes (`playsinline` attribute for iOS)

### Attributes Explained:
```html
<video 
  autoplay       <!-- Starts playing on page load -->
  muted          <!-- Required for autoplay on mobile -->
  loop           <!-- Restarts when finished -->
  playsinline    <!-- Plays inline on mobile (not full-screen) -->
  preload="metadata"  <!-- Loads video info for faster start -->
  poster="...">  <!-- Image shown while loading -->
```

### Browser Compatibility:
- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Fallback image shows on unsupported browsers

---

## Performance Notes

**Video Size**: ~2-3MB (Pexels videos are optimized)
**Load Strategy**: Muted autoplay allows fast start
**Mobile**: `playsinline` prevents full-screen takeover
**Fallback**: Image poster prevents blank space while loading

---

## Next Steps

1. **Initialize Git** (run the commands above)
2. **Test the video** on desktop and mobile
3. **Create branches** for future features
4. **Commit regularly** for good version history
5. **(Optional) Push to GitHub** for cloud backup

---

**Recommendation**: Use GitHub even locally for version tracking. It's best practice and makes it easy to collaborate later!

---

**Last Updated**: March 23, 2026  
**Video Hero Status**: ✅ Implemented and Mobile-Optimized
