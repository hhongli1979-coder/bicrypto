# Kraken UI Quick Reference

## 🎨 Import Statements

```tsx
// 3D Headings
import { H1Gradient, H1Neon, H13D, H1Metallic, H3DHeading } from '@/components/ui/3d-heading';

// Glass Cards
import { GlassCard } from '@/components/ui/glass-card';

// Gradient Buttons
import { GradientButton } from '@/components/ui/gradient-button';

// Particle Background
import { ParticleBackground } from '@/components/ui/particle-background';

// Animations
import { fadeInUp, scaleIn, slideInRight } from '@/lib/animations';
```

## 🚀 Quick Usage

### 3D Heading
```tsx
<H1Gradient text="My Heading" />
```

### Glass Card
```tsx
<GlassCard hover3d glowBorder>
  <h3>Card Title</h3>
  <p>Card content</p>
</GlassCard>
```

### Gradient Button
```tsx
<GradientButton variant="kraken" glow>
  Click Me
</GradientButton>
```

### Particle Background
```tsx
<ParticleBackground />
```

## 🎭 Text Effect Classes

Apply directly to any element:

```html
<h1 class="text-gradient text-display-1">Gradient</h1>
<h1 class="text-neon text-display-1">Neon</h1>
<h1 class="text-3d text-display-1">3D</h1>
<h1 class="text-metallic text-display-1">Metallic</h1>
```

## 🎨 CSS Variables

```css
/* Primary Colors */
--kraken-primary: #5741D9
--kraken-primary-light: #7E22CE
--kraken-primary-dark: #4C3BAA

/* Functional Colors */
--kraken-success: #26A17B
--kraken-danger: #F05142
--kraken-warning: #F59E0B

/* Shadows */
--kraken-shadow-sm
--kraken-shadow-md
--kraken-shadow-lg

/* Radius */
--kraken-radius-sm
--kraken-radius-md
--kraken-radius-lg
```

## 📱 Responsive Typography

```html
<h1 class="text-display-1">Largest (clamp: 2.5rem - 4.5rem)</h1>
<h2 class="text-display-2">Large (clamp: 2rem - 3.5rem)</h2>
<h3 class="text-display-3">Medium (clamp: 1.5rem - 2.5rem)</h3>
```

## ⚡ Component Props

### H3DHeading
- `text`: string (required)
- `as`: h1|h2|h3|h4|h5|h6 (default: h1)
- `effect`: neon|gradient|3d|metallic|glass|glow-outline|multi-shadow
- `animated`: boolean (default: true)
- `className`: string

### GlassCard
- `blur`: light|medium|heavy (default: medium)
- `tint`: white|purple|dark (default: white)
- `border`: boolean (default: true)
- `shadow`: none|sm|md|lg|xl (default: md)
- `hover3d`: boolean (default: false)
- `glowBorder`: boolean (default: false)

### GradientButton
- `variant`: kraken|success|danger|ghost (default: kraken)
- `size`: sm|md|lg|xl (default: md)
- `glow`: boolean (default: false)
- `loading`: boolean (default: false)
- `fullWidth`: boolean (default: false)
- `icon`: ReactNode
- `iconPosition`: left|right (default: left)

### ParticleBackground
- `particleCount`: number (default: 50)
- `color`: string (default: #5741D9)
- `opacity`: number (default: 0.6)
- `speed`: number (default: 0.5)

## 🎬 Animation Presets

```tsx
import { motion } from 'framer-motion';
import * as animations from '@/lib/animations';

<motion.div {...animations.fadeInUp}>Content</motion.div>
<motion.div {...animations.scaleIn}>Content</motion.div>
<motion.div {...animations.slideInRight}>Content</motion.div>
```

Available: `fadeIn`, `fadeInUp`, `fadeInDown`, `scaleIn`, `slideInRight`, `slideInLeft`, `staggerContainer`, `pageTransition`

## 🌙 Dark Mode

All components automatically support dark mode. Apply `.dark` class to root:

```tsx
<html className="dark">
  {/* All components adapt automatically */}
</html>
```

## 📦 Demo Page

See all components in action:

```tsx
import KrakenUIDemo from '@/components/ui/kraken-ui-demo';

<KrakenUIDemo />
```

## 📚 Full Documentation

See `KRAKEN_UI_GUIDE.md` for complete documentation with examples.
