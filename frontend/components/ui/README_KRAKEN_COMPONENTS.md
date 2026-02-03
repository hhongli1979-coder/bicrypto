# Kraken UI Components

New Kraken-style UI components for modern, visually stunning interfaces.

## New Components (Kraken Style)

### 🎨 Visual Effects

- **3d-heading.tsx** - 3D text effects with multiple styles (neon, gradient, metallic, etc.)
- **glass-card.tsx** - Glassmorphism cards with blur effects and 3D transforms
- **gradient-button.tsx** - Beautiful gradient buttons with glow effects
- **particle-background.tsx** - Animated particle background system

### 📖 Documentation

- **kraken-ui-demo.tsx** - Live demo page showcasing all Kraken components
- **KRAKEN_UI_GUIDE.md** (in frontend/) - Complete usage guide
- **KRAKEN_UI_QUICK_REF.md** (in frontend/) - Quick reference card

## Quick Start

```tsx
import { H1Gradient } from '@/components/ui/3d-heading';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';

function MyComponent() {
  return (
    <>
      <H1Gradient text="Welcome" />
      <GlassCard hover3d>
        <h3>Feature</h3>
        <p>Description</p>
      </GlassCard>
      <GradientButton variant="kraken" glow>
        Get Started
      </GradientButton>
    </>
  );
}
```

## CSS Files

Located in `frontend/styles/`:
- **themes/kraken.css** - Color system and design tokens
- **3d-text-effects.css** - Text effect utility classes

## Animation Library

Located in `frontend/lib/animations.ts`:
- Framer Motion animation presets
- Consistent animation timings
- Reusable animation configurations

## Features

✅ **Dark Mode Support** - All components adapt automatically
✅ **Responsive Design** - Mobile-first approach
✅ **TypeScript** - Full type safety
✅ **Framer Motion** - Smooth animations
✅ **Glassmorphism** - Modern blur effects
✅ **3D Transforms** - Interactive hover effects
✅ **Gradient Animations** - Smooth color transitions
✅ **Canvas Animations** - Performance-optimized particles

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (with webkit prefixes)
- Mobile: ✅ Touch-optimized

## Performance

- GPU-accelerated animations
- 60fps particle system
- Tree-shakeable exports
- Minimal bundle impact

## Examples

See `kraken-ui-demo.tsx` for comprehensive examples of all components.
