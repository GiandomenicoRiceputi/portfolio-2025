---
title: '3 practical examples of container query'
description: 'Use container queries to keep cards, forms, and hero sections readable, usable, and touch-friendly in any layout.'
date: 2025-09-20
tags: ['css', 'accessibility', 'container-queries']
---



Container queries let components respond to the space they actually receive. That makes them a powerful ally for accessibility: typography scales gracefully, touch targets stay reachable, and content keeps its hierarchy even inside tight layouts.

## How container queries work

Container queries are similar to media queries, but instead of responding to the viewport size, they respond to the size of the container an element is in. This allows for more modular and reusable components.

Here's a basic example:

```css
.card {
  container-type: inline-size;
  container-name: card;
}

@container card (max-width: 400px) {
  .card__title {
    font-size: 1.5rem;
  }
}
```

In this example, the card's title will only resize if the card itself is 400px wide or narrower. This means if the card is placed in a sidebar or a smaller column, the text will resize appropriately, maintaining readability and preventing overflow.

Now, let's explore three real-world components where container queries enhance accessibility.

## 1. Adaptive card component

Cards often get squeezed into sidebars or dense grids. Container queries let the card reflow without sacrificing readability or link targets.

### Card markup (HTML)

```html
<div class="card-demo" style="--card-width: 320px;">
  <article class="card">
    <div class="card__image">
      <img src="/assets/images/blog/og-preview.jpeg" alt="Team members collaborating over a laptop" />
    </div>
    <div class="card__content">
      <h3 class="card__title">Card title</h3>
      <p class="card__description">This is a description of the card content that provides context and information.</p>
      <a href="#" class="card__link">Learn more</a>
    </div>
  </article>
</div>
```

### Card styles (CSS)

```css
.card {
  container-type: inline-size;
  container-name: card;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}

/* Base styles ensure good contrast and readability */
.card__title {
  font-size: 1.25rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}

.card__description {
  color: #4a4a4a;
  line-height: 1.5;
}

.card__link {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #0066cc;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
}

/* Container query adjustments for narrow containers */
@container card (max-width: 350px) {
  .card {
    display: flex;
    flex-direction: column;
  }
  
  .card__title {
    font-size: 1.1rem; /* Better fit for small space */
  }
  
  .card__description {
    display: -webkit-box;
    -webkit-line-clamp: 3; /* Prevent text overflow */
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .card__link {
    padding: 0.75rem; /* Larger touch target */
    text-align: center;
    width: 100%; /* Full width for easier interaction */
  }
}

/* Further adjustments for very narrow containers */
@container card (max-width: 200px) {
  .card__content {
    padding: 1rem;
  }
  
  .card__title {
    font-size: 1rem; /* Scales down appropriately */
  }
  
  .card__description {
    display: none; /* Hide description to prevent clutter */
  }
}
```

### Card accessibility wins

- Text remains readable at any container size
- Touch targets adapt to become larger in constrained spaces
- Content hierarchy is maintained through proper scaling
- Prevents text overflow that can break screen reader flow

## 2. Responsive form layout

Forms need breathing room for labels, inputs, and focus states. Container queries allow the form to switch between stacked and grid layouts without breaking associations.

### Form markup (HTML)

```html
<div class="form-container" style="--container-width: 500px;">
  <form class="form">
    <div class="form__group">
      <label for="name" class="form__label">Full Name</label>
      <input type="text" id="name" class="form__input" required>
    </div>
    
    <div class="form__group">
      <label for="email" class="form__label">Email Address</label>
      <input type="email" id="email" class="form__input" required>
    </div>
    
    <div class="form__group">
      <label for="message" class="form__label">Message</label>
      <textarea id="message" class="form__textarea" rows="4"></textarea>
    </div>
    
    <button type="submit" class="form__button">Submit</button>
  </form>
</div>
```

### Form styles (CSS)

```css
.form {
  container-type: inline-size;
  container-name: form;
}

.form__group {
  margin-bottom: 1.5rem;
}

.form__label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form__input,
.form__textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form__input:focus,
.form__textarea:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0,102,204,0.1);
}

.form__button {
  padding: 0.75rem 1.5rem;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

/* Horizontal layout for wider containers */
@container form (min-width: 450px) {
  .form__group {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 1rem;
    align-items: center;
  }
  
  .form__label {
    margin-bottom: 0;
    text-align: right;
  }
}

/* Enhanced spacing for very wide containers */
@container form (min-width: 600px) {
  .form__group {
    grid-template-columns: 150px 1fr;
  }
  
  .form__input,
  .form__textarea {
    padding: 1rem;
  }
  
  .form__button {
    padding: 1rem 2rem;
    font-size: 1.1rem;
  }
}

/* Stacked layout for narrow containers */
@container form (max-width: 449px) {
  .form__label {
    font-size: 1.1rem; /* Slightly larger for mobile readability */
  }
  
  .form__input,
  .form__textarea {
    font-size: 1.1rem; /* Prevents zoom on iOS */
  }
  
  .form__button {
    width: 100%; /* Full width for easier tapping */
    padding: 1rem;
  }
}
```

### Form accessibility wins

- Maintains proper label-input association in all layouts
- Ensures adequate spacing between form elements
- Adapts font sizes for better readability on small screens
- Creates larger touch targets on constrained layouts
- Preserves focus states regardless of container size

## 3. Flexible hero section

Hero regions often mix marketing copy with imagery. Container queries keep the hierarchy intact while preventing overflow and awkward line lengths.

### Hero markup (HTML)

```html
<div class="hero-container" style="--container-width: 800px;">
  <section class="hero">
    <div class="hero__content">
      <h1 class="hero__title">Welcome to Our Platform</h1>
      <p class="hero__description">We provide innovative solutions that transform businesses and create lasting value for our customers worldwide.</p>
      <div class="hero__actions">
        <a href="#" class="hero__button hero__button--primary">Get Started</a>
        <a href="#" class="hero__button hero__button--secondary">Learn More</a>
      </div>
    </div>
    <div class="hero__visual">
      <img src="hero-image.jpg" alt="People collaborating in a modern workspace">
    </div>
  </section>
</div>
```

### Hero styles (CSS)

```css
.hero {
  container-type: inline-size;
  container-name: hero;
  display: flex;
  gap: 2rem;
  align-items: center;
}

.hero__content {
  flex: 1;
}

.hero__title {
  font-size: 2.5rem;
  line-height: 1.2;
  margin-bottom: 1rem;
  color: #1a1a1a;
}

.hero__description {
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: #4a4a4a;
}

.hero__actions {
  display: flex;
  gap: 1rem;
}

.hero__button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
}

.hero__button--primary {
  background: #0066cc;
  color: white;
}

.hero__button--secondary {
  background: transparent;
  color: #0066cc;
  border: 2px solid #0066cc;
}

.hero__visual {
  flex: 1;
}

.hero__visual img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

/* Adjustments for medium containers */
@container hero (max-width: 700px) {
  .hero {
    flex-direction: column;
    text-align: center;
  }
  
  .hero__title {
    font-size: 2rem; /* Better proportion for narrower space */
  }
  
  .hero__description {
    font-size: 1.1rem;
  }
  
  .hero__actions {
    justify-content: center;
  }
}

/* Further adjustments for narrow containers */
@container hero (max-width: 500px) {
  .hero__title {
    font-size: 1.75rem;
    line-height: 1.3; /* Improved line spacing */
  }
  
  .hero__description {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .hero__actions {
    flex-direction: column;
    align-items: center;
  }
  
  .hero__button {
    width: 100%;
    max-width: 250px;
    padding: 1rem;
    text-align: center;
  }
}

/* Special considerations for very wide containers */
@container hero (min-width: 1000px) {
  .hero__title {
    font-size: 3rem;
  }
  
  .hero__description {
    font-size: 1.5rem;
    max-width: 80%;
  }
}
```

### Hero accessibility wins

- Text scaling maintains readability across container sizes
- Proper heading hierarchy is preserved
- Button sizes adapt to remain usable in all contexts
- Content remains properly structured for screen readers
- Adequate spacing prevents visual crowding

## Key takeaways

- Container queries let each component own its responsiveness, reducing the need for viewport-based hacks.
- Accessibility improves when touch targets, line lengths, and focus treatments adapt to the component's real estate.
- Start by enabling `container-type` on the component shell, then layer on thoughtful breakpoints tied to real design constraints.

Container queries are still gaining browser support, but they are ready for production today. Start with one component, measure how it behaves inside different layouts, and iterate from there—your users will feel the difference.
