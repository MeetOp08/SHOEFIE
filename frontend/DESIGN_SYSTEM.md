# Shoefie Design System - Light Premium Edition

This document outlines the design principles, color palette, typography, and component styles used in the Shoefie V2 "Light Premium" theme.

## 🎨 Color Palette

The theme emphasizes clean, airy spaces with warm grays and a vibrant orange accent.

| Token | Color Value | Description | Usage |
| :--- | :--- | :--- | :--- |
| `primary` | `#f5f5f4` (Stone-100) | Warm light gray background | Main page background |
| `secondary` | `#e7e5e4` (Stone-200) | Slightly darker gray | Section backgrounds, contrast areas |
| `surface` | `#ffffff` (White) | Pure white | Cards, Navbar, Modals |
| `accent` | `#ea580c` (Orange-600) | Premium burnt orange | Call-to-actions, highlights, active states |
| `text-main` | `#1c1917` (Stone-900) | Very dark warm gray | Headings, primary text |
| `text-muted` | `#57534e` (Stone-600) | Medium warm gray | Subtitles, secondary text |
| `border-color` | `#d6d3d1` (Stone-300) | Soft neutral border | Card borders, dividers |

## 🔤 Typography

We use a dual-font system to separate display text from body content.

### Headings (Display)
*   **Font Family**: `Poppins`, sans-serif
*   **Weights**: 600 (Semi-Bold), 700 (Bold)
*   **Usage**: Page titles (`h1`), Section headers (`h2`), Card titles (`h3`).

### Body Text
*   **Font Family**: `Inter`, sans-serif
*   **Weights**: 400 (Regular), 500 (Medium)
*   **Usage**: Paragraphs, inputs, buttons, extensive reading.

## 🧩 Components

### Buttons
*   **Primary Button (`.btn-primary`)**:
    *   Background: `accent`
    *   Text: White
    *   Hover: Darker orange, slight shadow
    *   Shape: Fully rounded or slightly rounded (xl)
*   **Outline Button (`.btn-outline`)**:
    *   Border: `border-color`
    *   Text: `text-muted`
    *   Hover: `text-accent`, `border-accent`

### Cards (`.card`)
*   **Background**: `surface` (White)
*   **Border**: `1px solid border-color`
*   **Shadow**: `shadow-sm` (default), `shadow-lg` (hover)
*   **Radius**: `rounded-xl`
*   **Padding**: Generous padding (`p-6` or `p-8`)

### Inputs (`.input-field`)
*   **Background**: White or very light gray
*   **Border**: `border-gray-300` -> `focus:border-accent`
*   **Ring**: `focus:ring-accent` (subtle)
*   **Radius**: `rounded-lg`

### Navigation
*   **Navbar**: Glassmorphic effect with `backdrop-blur-md` and semi-transparent white background.
*   **Links**: `text-text-main` -> `hover:text-accent`.

## 📐 Layout Principles
1.  **Container**: Centered with `max-w-7xl` or `container mx-auto`.
2.  **Spacing**: Use consistent spacing tokens (`mb-6`, `gap-8`, `py-12`).
3.  **Grids**: Responsive grids (1 col mobile -> 2/3 cols tablet -> 4 cols desktop).

---

**Note**: All custom styles are defined in `frontend/tailwind.config.js` and `frontend/src/index.css`.
