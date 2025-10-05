## Spice Up — Fast Food Menu & Ordering (React + Vite)

A small, fast, and mobile-friendly demo for Spice Up (Vijayapura): browse categories, search items, add to cart, and mock checkout. Built with React + TypeScript + Vite.

### Features

- Search by name/description
- Filter by category
- Add/remove/increment/decrement items in cart
- Subtotal with localStorage persistence

### Run locally

Windows PowerShell:

```powershell
npm install
npm run dev
```

Then open the URL printed by the dev server (usually http://localhost:5173/).

### Build & Preview

```powershell
npm run build
npm run preview
```

### Notes

- Menu data lives in `src/data/menu.ts` and is easy to edit.
- This is a demo; checkout simply shows an alert.
