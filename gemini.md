# Gemini Context & Project Rules: Design System & Styling

You must strictly enforce and maintain consistency with the design guidelines defined below whenever generating frontend code, HTML, CSS, Tailwind configurations, UI templates, or styling advice.

---

## 1. Color Palette

Use only the defined color palette across all UI elements, states, and components. Do not invent arbitrary hex values.

| Token Name | HEX Value | Usage & Semantics |
| :--- | :--- | :--- |
| **Primary** | `#2FA084` | Primary brand color, primary action buttons, active navigation items, key accents. |
| **Primary Dark** | `#1F6F5F` | Hover/active states, focused borders, dark accents, high-contrast emphasis. |
| **Accent / Secondary** | `#6FCF97` | Success indicators, secondary badges, soft highlights, supporting graphical accents. |
| **Surface / Light Neutral** | `#EEEEEE` | Base backgrounds, card containers, subtle borders, input fields. |

### CSS Variables
```css
:root {
  --color-primary: #2fa084;
  --color-primary-dark: #1f6f5f;
  --color-accent: #6fcf97;
  --color-surface: #eeeeee;
}
```

---

## 2. Typography

Google Fonts:
- **Body / Sans-Serif (`font-sans`)**: `Figtree` (weights: 300..900)
- **Display / Editorial (`font-display`, `font-serif`)**: `Fraunces` (optical sizes: 9..144, weights: 100..900)
