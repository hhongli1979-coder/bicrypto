'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface H3DHeadingProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  effect?: 'neon' | 'gradient' | '3d' | 'metallic' | 'glass' | 'glow-outline' | 'multi-shadow';
  animated?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function H3DHeading({
  text,
  as: Component = 'h1',
  effect = 'gradient',
  animated = true,
  className,
  children,
}: H3DHeadingProps) {
  const effectClass = `text-${effect}`;
  
  const content = children || text;

  if (!animated) {
    return (
      <Component 
        className={cn('text-display-1', effectClass, className)}
        data-text={text}
      >
        {content}
      </Component>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      <Component 
        className={cn('text-display-1', effectClass, className)}
        data-text={text}
      >
        {content}
      </Component>
    </motion.div>
  );
}

// 快捷组件
export const H1Neon = (props: Omit<H3DHeadingProps, 'effect' | 'as'>) => (
  <H3DHeading {...props} as="h1" effect="neon" />
);

export const H1Gradient = (props: Omit<H3DHeadingProps, 'effect' | 'as'>) => (
  <H3DHeading {...props} as="h1" effect="gradient" />
);

export const H13D = (props: Omit<H3DHeadingProps, 'effect' | 'as'>) => (
  <H3DHeading {...props} as="h1" effect="3d" />
);

export const H1Metallic = (props: Omit<H3DHeadingProps, 'effect' | 'as'>) => (
  <H3DHeading {...props} as="h1" effect="metallic" />
);
