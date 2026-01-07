# Weblydo Solutions - Landing Page

A modern, animated single-page landing page for Weblydo Solutions, a Software IT solutions company. The design is heavily inspired by Claude's product overview page, featuring clean typography, atmospheric backgrounds, and purposeful animations.

## Features

- **Modern Design**: Clean, airy layout with ample whitespace and clear visual hierarchy
- **Typography**: Uses Space Grotesk and Source Sans Pro from Google Fonts with high contrast font weights (200-800)
- **Atmospheric Backgrounds**: Subtle gradients and geometric patterns instead of solid colors
- **Smooth Animations**: All animations use `transform` and `opacity` for optimal performance
- **Accessibility**: Respects `prefers-reduced-motion` and includes proper ARIA labels
- **Responsive**: Fully responsive design that works on all device sizes
- **Interactive Elements**: Scroll-triggered animations, hover effects, and smooth scrolling navigation

## File Structure

```
├── index.html      # Main HTML structure
├── styles.css      # All styling and animations
├── script.js       # JavaScript for interactivity
└── README.md       # This file
```

## Getting Started

1. Open `index.html` in a modern web browser
2. No build process or dependencies required - it's a pure HTML/CSS/JS implementation

## Design Principles

### Typography
- **Primary Font**: Space Grotesk (headings, emphasis)
- **Secondary Font**: Source Sans Pro (body text)
- **Font Weights**: Range from 200 (light) to 800 (extra bold) for high contrast

### Color Scheme
- **Background**: Deep navy/blue tones (#0a0e27, #141b3d)
- **Accents**: Blue gradient palette (#4f9cf9, #7b68ee, #00d4ff)
- **Text**: High contrast whites and light grays for readability

### Animations
- All animations use CSS `transform` and `opacity` properties only
- Intersection Observer API for scroll-triggered animations
- Respects user's motion preferences
- Smooth 60fps performance

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires CSS Grid and Flexbox support
- Intersection Observer API support (with fallback)

## Accessibility

- Semantic HTML5 elements
- ARIA labels for navigation and forms
- Keyboard navigation support
- Respects `prefers-reduced-motion` media query
- High contrast text for readability

## Performance

- Optimized animations using transform/opacity
- Throttled scroll events
- Lazy-loaded animations via Intersection Observer
- Minimal JavaScript footprint











