# Kraken UI Design System

This document provides examples of how to use the new Kraken-style UI components.

## Components Overview

### 1. 3D Heading Component

Import and use the 3D heading components:

```tsx
import { H1Gradient, H1Neon, H13D, H1Metallic, H3DHeading } from '@/components/ui/3d-heading';

// Gradient text (default)
<H1Gradient text="Welcome to Bicrypto" />

// Neon glow effect
<H1Neon text="Trade with Confidence" />

// 3D depth effect
<H13D text="Next Generation Exchange" />

// Metallic effect
<H1Metallic text="Secure Trading Platform" />

// Custom configuration
<H3DHeading 
  text="Custom Heading"
  as="h2"
  effect="gradient"
  animated={true}
  className="my-custom-class"
/>
```

### 2. Glass Card Component

Import and use the glass card component:

```tsx
import { GlassCard } from '@/components/ui/glass-card';

// Basic glass card
<GlassCard>
  <h3 className="text-xl font-bold">Card Title</h3>
  <p>Card content goes here</p>
</GlassCard>

// With 3D hover effect and glow border
<GlassCard 
  blur="medium"
  tint="purple"
  hover3d={true}
  glowBorder={true}
>
  <h3>Interactive Card</h3>
  <p>Hover to see the effect</p>
</GlassCard>

// Heavy blur with custom shadow
<GlassCard 
  blur="heavy"
  shadow="xl"
  className="my-custom-class"
>
  <div>Custom content</div>
</GlassCard>
```

### 3. Gradient Button Component

Import and use the gradient button:

```tsx
import { GradientButton } from '@/components/ui/gradient-button';

// Kraken variant (default)
<GradientButton>Start Trading</GradientButton>

// Success variant
<GradientButton variant="success">
  Confirm Order
</GradientButton>

// Danger variant
<GradientButton variant="danger" size="lg">
  Cancel Trade
</GradientButton>

// Ghost variant
<GradientButton variant="ghost" fullWidth>
  Learn More
</GradientButton>

// With glow effect
<GradientButton glow>
  Trade Now
</GradientButton>

// With icon
<GradientButton 
  icon={<span>✓</span>}
  iconPosition="left"
>
  Complete
</GradientButton>

// Loading state
<GradientButton loading>
  Processing...
</GradientButton>
```

### 4. Particle Background Component

Import and use the particle background:

```tsx
import { ParticleBackground } from '@/components/ui/particle-background';

// Default configuration
<ParticleBackground />

// Custom configuration
<ParticleBackground 
  particleCount={100}
  color="#5741D9"
  opacity={0.8}
  speed={0.7}
/>
```

### 5. Animation Presets

Import and use Framer Motion animation presets:

```tsx
import { motion } from 'framer-motion';
import { fadeInUp, scaleIn, slideInRight } from '@/lib/animations';

// Fade in from bottom
<motion.div {...fadeInUp}>
  <p>Content fades in from bottom</p>
</motion.div>

// Scale in
<motion.div {...scaleIn}>
  <p>Content scales in</p>
</motion.div>

// Slide in from right
<motion.div {...slideInRight}>
  <p>Content slides in from right</p>
</motion.div>
```

## CSS Classes

### 3D Text Effects

Apply these classes to any text element:

```html
<!-- Neon glow effect -->
<h1 class="text-neon text-display-1">Neon Text</h1>

<!-- Gradient text -->
<h1 class="text-gradient text-display-1">Gradient Text</h1>

<!-- Animated gradient -->
<h1 class="text-gradient-animated text-display-1">Animated Gradient</h1>

<!-- 3D depth effect -->
<h1 class="text-3d text-display-1">3D Text</h1>

<!-- Metallic effect -->
<h1 class="text-metallic text-display-1" data-text="Metallic">Metallic</h1>

<!-- Glass effect -->
<h1 class="text-glass text-display-1">Glass Text</h1>

<!-- Glow outline -->
<h1 class="text-glow-outline text-display-1">Outline Glow</h1>

<!-- Multi-shadow -->
<h1 class="text-multi-shadow text-display-1">Multi Shadow</h1>
```

### Responsive Typography

Use these classes for responsive font sizes:

```html
<!-- Display 1 (largest) -->
<h1 class="text-display-1">Large Heading</h1>

<!-- Display 2 -->
<h2 class="text-display-2">Medium Heading</h2>

<!-- Display 3 -->
<h3 class="text-display-3">Small Heading</h3>
```

## Kraken Theme Variables

The Kraken theme provides CSS custom properties that you can use:

```css
/* Brand colors */
var(--kraken-primary)
var(--kraken-primary-light)
var(--kraken-primary-dark)
var(--kraken-primary-gradient)

/* Functional colors */
var(--kraken-success)
var(--kraken-danger)
var(--kraken-warning)
var(--kraken-info)

/* Background colors */
var(--kraken-bg-primary)
var(--kraken-bg-secondary)
var(--kraken-bg-tertiary)
var(--kraken-bg-gradient)

/* Text colors */
var(--kraken-text-primary)
var(--kraken-text-secondary)
var(--kraken-text-tertiary)

/* Card styles */
var(--kraken-card-bg)
var(--kraken-card-border)
var(--kraken-card-hover)
var(--kraken-card-shadow)

/* Border colors */
var(--kraken-border)
var(--kraken-border-light)
var(--kraken-border-focus)

/* Border radius */
var(--kraken-radius-sm)
var(--kraken-radius-md)
var(--kraken-radius-lg)
var(--kraken-radius-xl)

/* Shadows */
var(--kraken-shadow-sm)
var(--kraken-shadow-md)
var(--kraken-shadow-lg)
var(--kraken-shadow-xl)

/* Animation */
var(--kraken-duration-fast)
var(--kraken-duration-normal)
var(--kraken-duration-slow)
var(--kraken-ease)
var(--kraken-ease-in)
var(--kraken-ease-out)
```

## Example: Hero Section

Here's a complete example combining multiple components:

```tsx
import { H1Gradient } from '@/components/ui/3d-heading';
import { GradientButton } from '@/components/ui/gradient-button';
import { ParticleBackground } from '@/components/ui/particle-background';

export default function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <ParticleBackground />
      
      <div className="relative z-10 text-center px-4">
        <H1Gradient text="Next Generation Crypto Exchange" animated />
        
        <p className="text-xl text-gray-600 dark:text-gray-400 mt-6 mb-8 max-w-2xl mx-auto">
          Trade securely with advanced features, lightning-fast execution, 
          and professional-grade tools
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <GradientButton variant="kraken" size="lg" glow>
            Start Trading Now
          </GradientButton>
          
          <GradientButton variant="ghost" size="lg">
            Learn More
          </GradientButton>
        </div>
      </div>
    </div>
  );
}
```

## Example: Feature Cards

```tsx
import { GlassCard } from '@/components/ui/glass-card';

export default function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
      <GlassCard blur="medium" hover3d glowBorder>
        <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Execute trades in milliseconds with our advanced matching engine
        </p>
      </GlassCard>

      <GlassCard blur="medium" hover3d glowBorder>
        <h3 className="text-xl font-bold mb-2">Bank-Grade Security</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Your assets are protected with military-grade encryption
        </p>
      </GlassCard>

      <GlassCard blur="medium" hover3d glowBorder>
        <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Get help anytime from our dedicated support team
        </p>
      </GlassCard>
    </div>
  );
}
```

## Dark Mode Support

All components automatically support dark mode. The theme switches seamlessly when the `.dark` class is applied to the root element.

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (with webkit prefixes)
- Mobile browsers: Optimized for touch interactions

## Performance Notes

- All animations use GPU acceleration (`transform` and `opacity`)
- Particle background uses `requestAnimationFrame` for smooth 60fps
- Glassmorphism effects use efficient `backdrop-filter`
- Components are tree-shakeable for optimal bundle size
