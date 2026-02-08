# SHOEFIE Design System (Light Premium)

The "Light Premium" design system emphasizes simplicity, elegance, and focus. It uses a neutral color palette with subtle accents to create a high-end feel suitable for a luxury shoe store.

## 1. Color Palette

### Primary Colors
-   **Background**: `bg-primary` (#F8FAFC - Slate 50) - Used for page backgrounds.
-   **Surface**: `bg-white` (#FFFFFF) - Used for cards, headers, and footers.
-   **Text Main**: `text-text-main` (#1E293B - Slate 800) - For headings and primary content.
-   **Text Muted**: `text-text-muted` (#64748B - Slate 500) - For secondary text and hints.

### Accent Colors
-   **Brand Accent**: `text-accent` (#EA580C - Orange 600) - Used for CTAs, active states, and highlights.
-   **Secondary Background**: `bg-secondary` (#F1F5F9 - Slate 100) - Used for subtle sections or hover states.

### Status Colors
-   **Success**: `text-green-600` / `bg-green-100` (In Stock, Paid, Delivered).
-   **Warning**: `text-yellow-600` / `bg-yellow-100` (Low Stock, Pending).
-   **Error**: `text-red-600` / `bg-red-100` (Out of Stock, Failed).

## 2. Typography

### Headings
**Font Family**: `Poppins` (Bold/Semi-Bold)
-   Used for Hero titles, Section headers, and Product names.
-   Example: `<h1 className="font-display font-bold text-4xl text-text-main">SHOEFIE</h1>`

### Body Text
**Font Family**: `Inter` (Regular/Medium)
-   Used for paragraphs, descriptions, and UI controls.
-   Example: `<p className="text-text-muted leading-relaxed">Premium comfort for every step.</p>`

## 3. Components

### Buttons
-   **Primary Button**:
    -   `bg-accent text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors shadow-lg`
    -   Used for "Add to Cart", "Checkout", "Sign In".

-   **Secondary Button**:
    -   `border border-border-color text-text-main px-6 py-3 rounded-lg hover:bg-secondary transition-colors`
    -   Used for "View Details", "Edit", "Cancel".

### Cards
-   **Product Card**:
    -   Clean white background with soft shadow on hover.
    -   `bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100`

### Inputs
-   **Form Fields**:
    -   Minimalist border with focus ring.
    -   `w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all`

## 4. Layout Principles

-   **Container Width**: `max-w-7xl mx-auto px-4` (Standard central column).
-   **Spacing**: Generous whitespace (`py-12`, `gap-8`) to separate content blocks.
-   **Responsiveness**: Mobile-first approach using Tailwind breakpoints (`md:`, `lg:`).

## 5. Animations

-   **Hover Effects**: `hover:scale-105`, `hover:text-accent`.
-   **Page Transitions**: Framer Motion configured for smooth fade-in/slide-up effects.
-   **Micro-interactions**: Pulse animation for "Low Stock" (`animate-pulse`).

---

This document serves as the implementation guide for designers and developers working on SHOEFIE.
