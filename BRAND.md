# Maginot Platform - Brand Guidelines

## 🎨 Color Palette

### Primary Colors

```css
--brand-primary: #008CBF;    /* Main Blue - Used for primary actions, links */
--brand-secondary: #005452;  /* Dark Teal - Used for accents, secondary elements */
--brand-navy: #066666;       /* Navy Blue - Used for headers, dark backgrounds */
```

### Brand Gradient

The Maginot brand uses a signature gradient that flows from navy to bright blue:

```css
background: linear-gradient(to right, #066666, #007994, #008CBF);
```

**Usage:**
- Admin dashboard header
- Hero sections
- Call-to-action buttons
- Premium features

### Color Usage Guidelines

| Color | Hex Code | Usage |
|-------|----------|-------|
| **Primary Blue** | `#008CBF` | Primary buttons, active navigation, links |
| **Dark Teal** | `#005452` | Secondary buttons, borders, accents |
| **Navy Blue** | `#066666` | Headers, footers, dark sections |
| **Gradient Start** | `#066666` | Dark end of gradients |
| **Gradient Mid** | `#007994` | Middle transition |
| **Gradient End** | `#008CBF` | Bright end of gradients |
| **White** | `#FFFFFF` | Text on dark backgrounds, cards |

## 🖼️ Logo Assets

### Available Logo Versions

Located in: `/public/images/`

1. **Asset 1.svg** - Full logo with text (white) - 976×232px
   - Use on: Dark backgrounds, admin header
   
2. **Asset 2.svg** - Full logo with gradient - 993×815px
   - Use on: Light backgrounds, main website
   
3. **Asset 3.svg** - Icon only (white) - 353×216px
   - Use on: Navbar, favicon, small spaces
   
4. **Asset 4.svg** - Small variant
5. **Asset 5.svg** - Small variant  
6. **Asset 6.svg** - Small variant

### Logo Usage

**Primary Logo (Navbar):**
- Use Asset 3.svg on light backgrounds
- Height: 48px (h-12)
- Always maintain aspect ratio

**Admin Dashboard:**
- Use Asset 1.svg (white logo)
- On gradient background
- Height: 40px (h-10)

**Minimum Size:**
- Never display logo smaller than 80px wide
- Maintain clear space around logo (minimum 20px)

## 🎯 Tailwind CSS Integration

The brand colors are integrated into Tailwind:

```tsx
// Use brand colors directly
className="bg-brand-primary"
className="text-brand-secondary"
className="bg-brand-navy"

// Use brand gradient
className="bg-gradient-to-r from-brand-navy via-brand-gradient-mid to-brand-primary"

// Primary/Secondary map to brand colors
className="bg-primary"        // → #008CBF
className="bg-secondary"      // → #005452
```

## 🎨 Design Principles

### Color Contrast
- White text on brand-navy: WCAG AAA ✅
- White text on brand-primary: WCAG AA ✅  
- White text on brand-secondary: WCAG AAA ✅

### Accessibility
- All brand colors meet WCAG 2.1 Level AA standards
- High contrast ratios for readability
- Color is not the only visual means of conveying information

### Visual Hierarchy
1. **Primary (Blue)** - Main actions, navigation
2. **Navy** - Headers, important sections
3. **Teal** - Secondary info, accents
4. **White** - Content, backgrounds

## 📱 Responsive Guidelines

### Mobile
- Logo size: minimum 80px wide
- Gradient backgrounds: maintain readability
- Ensure touch targets: minimum 44px

### Desktop
- Logo size: 120-140px wide
- Full gradient usage in hero sections
- Spacious layouts with brand colors

## 🚀 Implementation Examples

### Button Styles
```tsx
// Primary (Brand Blue)
<Button className="bg-brand-primary hover:bg-brand-primary/90">

// Secondary (Teal)
<Button variant="secondary" className="bg-brand-secondary">

// Gradient
<Button className="bg-gradient-to-r from-brand-navy to-brand-primary">
```

### Hero Section
```tsx
<section className="bg-gradient-to-r from-brand-navy via-brand-gradient-mid to-brand-primary text-white">
```

### Cards with Brand Accent
```tsx
<Card className="border-l-4 border-brand-primary">
```

## 📋 Brand Checklist

- [ ] Use approved logo versions only
- [ ] Maintain minimum logo size (80px)
- [ ] Use brand colors for primary actions
- [ ] Apply gradients on hero/premium sections
- [ ] Ensure WCAG AA contrast ratios
- [ ] Test on mobile and desktop
- [ ] Maintain consistent spacing
- [ ] Use white logo on dark backgrounds only

## 🔄 Updates

Last updated: 2026-02-03
Version: 1.0
Status: Active

---

For questions about brand guidelines, contact: design@maginot-platform.dz
