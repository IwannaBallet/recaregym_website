# Image Additions to ReCare GYM Website

## Summary
This document outlines all image placeholders added to enhance the website visuals.

---

## 1. **Hero Section Background Image**
- **Location**: [index.html](index.html#L241)
- **Image**: Gym/fitness facility background
- **Source**: Unsplash (Free to use)
- **URL**: `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&h=900&fit=crop`
- **Effect**: Background with dark overlay for text readability

---

## 2. **Trainer Profile Photos**
- **Location**: [index.html](index.html#L862) - `TRAINER_PHOTOS` array
- **Count**: 15 professional headshots (cycles through for all trainers)
- **Sources**: Unsplash (Free to use)
- **Used in**: 
  - Trainer cards on homepage (index.html)
  - Trainer cards on trainers page (trainers.html via trainers.js)
- **Fallback**: Colored avatar with initials if image fails to load

### Sample URLs:
```
https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop
https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop
https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop
... and 12 more
```

---

## 3. **Features/Facilities Section**
- **Location**: [index.html](index.html#L650) - Features section
- **Count**: 4 facility showcase cards
- **Cards**:
  1. **최신 운동기구** (Latest Equipment)
     - URL: `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=300&fit=crop`
  
  2. **맞춤형 프로그램** (Customized Programs)
     - URL: `https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&h=300&fit=crop`
  
  3. **전문 트레이너** (Expert Trainers)
     - URL: `https://images.unsplash.com/photo-1576091160550-112173f7f869?w=500&h=300&fit=crop`
  
  4. **쾌적한 환경** (Clean Environment)
     - URL: `https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&h=300&fit=crop`

---

## 4. **CSS Enhancements**
- **Trainer photo hover effect**: Scale up on hover (1.04x - 1.08x)
- **Feature cards hover effect**: Lift up 6px with enhanced shadow
- **Lazy loading**: All images use `loading="lazy"` for better performance
- **Responsive design**: Images maintain aspect ratio on all screen sizes

---

## 5. **Technical Details**

### Image Optimization:
- All images use Unsplash's query parameters for optimization:
  - `w=400&h=400` for trainer photos (square)
  - `w=500&h=300` for feature cards (landscape)
  - `fit=crop` for consistent sizing

### Fallback Strategy:
- **Trainer photos**: Falls back to colored avatar with initials
- **Feature images**: Graceful degradation with background color

### Performance:
- Images are externally hosted (Unsplash CDN) - no local file storage needed
- Lazy loading reduces initial page load time
- Image sizes optimized via URL parameters

---

## 6. **How to Replace with Real Images**

### When you have actual photos:

1. **Replace hero background**: Update URL in [index.html line 241](index.html#L241)
2. **Replace trainer photos**: 
   - Upload trainer images to a server/CDN
   - Update URLs in `TRAINER_PHOTOS` array in [index.html line 862](index.html#L862)
   - Or set `photo_url` field in Google Sheets `trainers` table for trainers.html
3. **Replace feature images**: Update URLs in [index.html lines 654-669](index.html#L654-L669)

### Example replacement:
```javascript
// Before (placeholder)
'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'

// After (your actual image)
'https://your-domain.com/trainer-01.jpg'
```

---

## 7. **Image Sources**

All placeholder images are from **Unsplash** - a free stock photo service with generous usage rights:
- ✅ Free to use for commercial and non-commercial projects
- ✅ No attribution required (but appreciated)
- ✅ No permission needed
- 📌 Link: https://unsplash.com

---

## 8. **Visual Sections Enhanced**

| Section | Before | After |
|---------|--------|-------|
| Hero | Text-only dark background | Background image with overlay |
| Trainer Cards | Avatar initials only | Professional headshots + avatars |
| Features | Not present | 4 facility showcase cards with images |

---

## Next Steps

1. **Collect actual photos**:
   - Hero banner: Gym entrance/facility
   - Trainer profiles: Individual trainer photos
   - Facilities: Different gym areas/equipment

2. **Host images**: Upload to a CDN or web server

3. **Update URLs**: Replace placeholder URLs with your actual image URLs

4. **Test responsiveness**: Verify images look good on mobile/tablet/desktop

---

**Last Updated**: March 23, 2026  
**Status**: Draft with sample/placeholder images  
**Ready for**: Production image replacement
