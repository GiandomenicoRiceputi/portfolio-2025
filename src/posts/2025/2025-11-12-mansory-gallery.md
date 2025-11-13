---
title: 'Infinite Scroll Masonry Gallery with React & TypeScript'
description: 'This project is about building an infinite-scroll masonry gallery using React, TypeScript, and the Unsplash API.'
date: 2025-11-13
---

## What We're Building

In this project, we're building an infinite scroll gallery because the logic behind Intersection Observer and infinite scroll is everywhere in production today. We don't see as many "load more" buttons anymore—and I'm good with that.

**Live Demo Features:**

- 🔗 [Masonry Gallery](https://infinite-masonry-gallery.netlify.app/)
- ✨ Beautiful masonry layout
- 🔄 Infinite scroll that "just works"
- 📱 Fully responsive design
- 🎨 Real photos from Unsplash API
- ⚡ Type-safe with TypeScript

---

## Why This Matters

I've made (and still make) tons of mistakes as a continuous learner, so I know how important it is to structure logic correctly and implement it *properly*:

1. **Performance**: Not blocking the main thread
2. **UX**: Smooth loading without janky behavior
3. **API efficiency**: Not hammering your server with requests
4. **Accessibility**: Proper focus management

In this project, I'll show you how I handle all of that, not just the "happy path."

---

## Tech Stack

{% raw %}

```javascript
{
  "react": "^19.2.0",           // Latest React with new hooks
  "typescript": "^4.9.5",       // Type safety FTW
  "unsplash-api": "free tier",  // Beautiful, free photos
  "css-grid": "native"          // No external masonry library needed!
}
```

{% endraw %}

**Why these choices?**

- **React 19**: Modern hooks API, better performance
- **TypeScript**: Catch bugs before runtime
- **CSS Grid**: Native, performant, no dependencies
- **Unsplash**: Professional photos, generous free tier

---

## Project Architecture

Before starting to code, I like to figure out the project root tree:

```text
src/
├── App.tsx                    # Main container, infinite scroll logic
├── components/
│   ├── Gallery/
│   │   ├── index.tsx         # Grid layout component
│   │   └── Gallery.css       # Masonry magic with CSS Grid
│   └── PhotoCard/
│       ├── index.tsx         # Individual photo card
│       └── PhotoCard.css     # Card styling & hover effects
└── services/
    └── unsplashService.ts     # API integration layer
```

**Design Principles:**

I didn't build the button component in isolation for this project
in order to prioritize the learning experience.

- **Separation of Concerns**: API logic isolated in services
- **Component Composition**: Reusable PhotoCard + Gallery
- **Single Responsibility**: Each file has one clear job

---

## Step 1: Connecting to Unsplash API

Before building the API logic, I want to share the link to the [Unsplash API Documentation](https://unsplash.com/documentation), which is the best place to start getting your feet wet in the Unsplash API ecosystem. First, get your free API keys from [Unsplash Developers](https://unsplash.com/developers). Then create `.env`:

```bash
# Do not forget the prefix (REACT_APP) is still mandatory at the time of writing

REACT_APP_UNSPLASH_ACCESS_KEY=your_access_key_here
```

Now, I build the service layer:

```typescript
// src/services/unsplashService.ts

// Configuration
const UNSPLASH_ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_URL = 'https://api.unsplash.com';

// Types
export interface UnsplashPhoto {
    id: string;
    urls: {
        small: string;
        regular: string;
    };
    alt_description: string | null;
    description: string | null;
    user: {
        name: string;
    };
    width: number;
    height: number;
}
/**
 * Fetch photos from Unsplash API with pagination
 * Defaults to 12 photos per page for optimal grid display
 */
export const fetchUnsplashPhotos = async (
    page = 1, 
    perPage = 12
): Promise<UnsplashPhoto[]> => {
    try {
        const response = await fetch(
            `${UNSPLASH_API_URL}/photos?page=${page}&per_page=${perPage}&client_id=${UNSPLASH_ACCESS_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching photos:', error);
        throw error; // Re-throw for caller to handle
    }
}
```

**🎓 What's Happening Here?**

I hope the code above is well self-documented, but to be sure, let me explain what's going on:
I use TypeScript interfaces to have all the type support that TypeScript provides and to keep everything type-safe. Then I fetch from Unsplash using JavaScript async/await, and I limit it to 12 images per page because that seems like a reasonable number of images to load per request.

---

## Step 2: Creating the Photo Card Component

At this point, I think it's a good idea to build the card component that will serve as a template for each image in our gallery:

```typescript
## Step 2: The PhotoCard Component

Each image needs a reusable card component that's accessible and interactive.


```typescript
// src/components/PhotoCard/index.tsx

import React from 'react';
import './PhotoCard.css';

interface PhotoCardProps {
    src: string;
    alt: string;
    title: string;
    description: string;
    onOpenImage: () => void;
    onDownloadImage?: () => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
    src,
    alt,
    title,
    description,
    onOpenImage,
    onDownloadImage
}) => {
    // Enable keyboard navigation for accessibility - Space/Enter triggers image opening
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onOpenImage();
        }
    };

    return (
        <article
            className="photo-card"
            tabIndex={0}
            role="button"
            aria-label={`View details for ${title}`}
            onClick={onOpenImage}
            onKeyDown={handleKeyDown}
        >
            <figure>
                {/* Lazy loading improves performance for images outside viewport */}
                <img src={src} alt={alt} className="photo-card__image" loading="lazy" />
                <figcaption className="photo-card__content">
                    <h2 className="photo-card__title">{title}</h2>
                    <p className="photo-card__description">{description}</p>
                </figcaption>
            </figure>
            {/* Conditionally render download button only if handler is provided */}
            {onDownloadImage && (
                <button 
                    className="photo-card__download"
                    onClick={(e) => {
                        // Prevent card click event from bubbling up when downloading
                        e.stopPropagation();
                        onDownloadImage();
                    }}
                    aria-label={`Download image: ${title}`}
                >
                    Download
                </button>
            )}
        </article>
    );
};
```

**🎯 Key Features:**

- `loading="lazy"`: Browser-native lazy loading (free performance!)
- **Semantic HTML**: Using `<article>`, `<figure>`, and `<figcaption>` for proper structure
- **Accessibility**: ARIA labels, keyboard navigation (Enter/Space keys), and focus management
- **Event handling**: `stopPropagation()` prevents parent click when downloading
- Optional callbacks: Flexible for future features

---

## Step 3: The Masonry Layout Secret

Okay, I'm not a CSS wizard, but I love CSS. I've used this approach to create a masonry layout with CSS Grid:

```css
/* src/components/Gallery/Gallery.css */

.gallery {
    /* 
      * CSS Grid layout for masonry effect
     * This creates a responsive grid that automatically adjusts columns
     * while maintaining a minimum card width of 300px
     */
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-auto-rows: auto; /* Let content determine row height */
    gap: 1rem; /* Use gap instead of margins for consistent spacing */
    padding: 2rem;
    align-items: start; /* Align items to top for varied content heights */
}

/* src/components/PhotoCard/PhotoCard.css */

.photo-card {
    /* 
     * Container for the card component
     * Using BEM methodology for clear, scoped class names
     */
    border-radius: 8px;
    overflow: hidden; /* Contain child elements within border-radius */
    cursor: pointer; /* Indicate interactivity */
    max-width: 300px; /* Prevent cards from growing too large */
    margin: 2rem auto; /* Center cards with vertical spacing */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Subtle elevation */
}

.photo-card__image {
    /* 
     * Responsive image pattern
     * Width: 100% makes it fill container while maintaining aspect ratio
     */
    width: 100%;
    height: auto; /* Maintain aspect ratio */
    display: block; /* Remove extra space below image */
}

.photo-card__content {
    padding: 1rem; /* Consistent internal spacing */
}

.photo-card__title {
    /* 
     * Typography hierarchy
     * Remove default margins and establish clear visual importance
     */
    margin: 0 0 0.5rem 0; /* Bottom margin only for spacing */
    font-size: 1.25rem;
    font-weight: 600; /* Semi-bold for emphasis */
}

.photo-card__description {
    /* 
     * Secondary text with reduced visual weight
     * Using rem units for accessibility and consistency
     */
    margin: 0;
    color: #666; /* Subtle gray for less importance */
    font-size: 0.875rem; /* 14px equivalent at base 16px */
}

/* 
 * Hover effects for better UX
 * Using transform for better performance than changing layout properties
 */
.photo-card:hover {
    transform: translateY(-2px); /* Subtle lift effect */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Enhanced shadow on hover */
    transition: all 0.2s ease; /* Smooth state change */
}

/* 
 * Focus styles for accessibility
 * Essential for keyboard navigation and WCAG compliance
 */
.photo-card:focus {
    outline: 2px solid #007acc; /* High contrast focus indicator */
    outline-offset: 2px; /* Space between outline and element */
}
```

**💡 The CSS Grid Layout:**

- `repeat(auto-fit, minmax(300px, 1fr))`: Responsive columns that adapt to screen size
- `grid-auto-rows: auto`: Rows automatically size to content
- `gap: 1rem`: Consistent spacing between cards
- `align-items: start`: Cards align to the top of their grid area

**Why This Works:**

I'm taking advantage of CSS Grid's native capabilities.
The card component naturally adapts to its content, and the `auto-fit` function generates as many columns as will fit.
This way of creating a masonry layout is simpler, JavaScript-free, and more performant.

---

## Step 4: Implementing Infinite Scroll

To trigger the infinite scroll effect, I use the Intersection Observer API to watch the 'sentinel' element (just a div, no worries),
but code always speaks better for me:

{% raw %}

```typescript
// src/App.tsx (key parts)

function App() {
  // State management for image data, pagination, and loading status
  const [images, setImages] = useState<ImageData[]>([]);
  const [page, setPage] = useState(1); // Current page for pagination
  const [isLoading, setIsLoading] = useState(true); // Loading state to prevent duplicate requests
  const sentinelRef = useRef<HTMLDivElement>(null); // Reference for intersection observer target

  // Initial data load - runs once on component mount
  useEffect(() => {
    const loadInitialPhotos = async () => {
      try {
        setIsLoading(true);
        // Fetch first page with 12 images for initial view
        const photos = await fetchUnsplashPhotos(1, 12);
        const imageData = convertUnsplashData(photos);
        setImages(imageData);
      } catch (error) {
        console.error('Failed to load initial photos:', error);
        // for the future me => In production, you might want to add error state handling here
      } finally {
        setIsLoading(false); // for the future me => Ensure loading state is reset regardless of success/error
      }
    };
    
    loadInitialPhotos();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Memoized callback for loading additional images
  const loadMoreImages = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch next page of images
      const photos = await fetchUnsplashPhotos(page + 1, 12);
      const newImageData = convertUnsplashData(photos);
      
      // Append new images to existing ones without mutating original array
      setImages(prevImages => [...prevImages, ...newImageData]);
      setPage(prevPage => prevPage + 1); // Increment page counter
    } catch (error) {
      console.error('Failed to load more photos:', error);
      // for the future me => Consider user feedback for errors in production
    } finally {
      setIsLoading(false); // Reset loading state in all cases
    }
  }, [page]); // Recreate callback only when page changes

  // Intersection Observer setup for infinite scroll functionality
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // Only trigger load when sentinel is visible AND not already loading
        if (entry.isIntersecting && !isLoading) {
          loadMoreImages();
        }
      },
      { 
        threshold: 0.1 // Trigger when at least 10% of sentinel element is visible
        // For the future me => Consider adding rootMargin for earlier/later triggering
      }
    );

    // Observe the sentinel element if it exists
    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    // Cleanup: disconnect observer on component unmount
    return () => observer.disconnect();
  }, [isLoading, loadMoreImages]); // Re-run effect when loading state or callback changes

  return (
    <div className="App">
      {/* Main gallery component displaying all loaded images */}
      <Gallery images={images} />
      
      {/* 
        Sentinel element for intersection observer
        This invisible element triggers loading when it comes into view
        Height ensures it's always detectable by the observer
      */}
      <div 
        ref={sentinelRef} 
        style={{ 
          height: '20px',
          // For the future me =>  Consider adding aria-hidden for accessibility
        }} 
        aria-hidden="true"
      />
    </div>
  );
}
```

{% endraw %}

**🔍 How This Works:**

1. **Sentinel Element**: An invisible div at the bottom
2. **Intersection Observer**: Watches when sentinel enters viewport
3. **Trigger Loading**: When sentinel is 10% visible, load more
4. **Prevent Duplicates**: Check `isLoading` to avoid race conditions
5. **Cleanup**: Disconnect observer on unmount

**Why Not `onScroll`?**

- `scroll` events fire constantly (performance nightmare)
- Intersection Observer is debounced by the browser
- Better battery life on mobile
- Simpler code, no throttling needed

---

## Step 5: Polishing the Experience

### Loading States

```typescript
{isLoading && <div className="spinner">Loading beautiful photos...</div>}
```

### Empty States

```typescript
{images.length === 0 && !isLoading && (
  <div>No images found. Check your API key!</div>
)}
```

### Error Boundaries

Consider adding error boundaries for production:

```typescript
// Catch API failures gracefully
// Show user-friendly error messages
// Retry mechanism for failed requests
```

---

## What I Learned Building This

By building this gallery, I learned a lot about React hooks, the Unsplash API, CSS Grid, and semantic HTML for accessibility.
But the real lesson that building projects teaches me is always the same:
Coding is the best way to learn and have fun, but I want to be honest—sometimes challenges make me cry, but that's when I learn the most.
Happy coding, everyone!

---

## Try It Yourself

If you'd like to extend this project further, try different approaches—everything is welcome! Below I've included a quick start guide.

### Quick Start

```bash
# Clone and run
git clone https://github.com/GiandomenicoRiceputi/reactjs-infinite-masonry-gallery
cd reactjs-masonry-gallery
npm install

# Add your Unsplash API key to .env
echo "REACT_APP_UNSPLASH_ACCESS_KEY=your_key" > .env

# Run the project
npm start
```

### Challenges to Level Up

Next time I work on this project, I want to implement these features one at a time:

1. **Add Search**: Filter photos by keyword
2. **Lightbox Modal**: Click to view full-size
3. **Download Feature**: Let users save photos
4. **Virtualization**: Render only visible items (for 1000+ photos)
5. **Dark Mode**: Toggle theme

---

## Resources

- [Unsplash API Docs](https://unsplash.com/documentation)
- [Intersection Observer MDN](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

**Full Code**: [GitHub Repository](https://github.com/GiandomenicoRiceputi/reactjs-infinite-masonry-gallery)
