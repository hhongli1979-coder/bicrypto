'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  blur?: 'light' | 'medium' | 'heavy';
  tint?: 'white' | 'purple' | 'dark';
  border?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover3d?: boolean;
  glowBorder?: boolean;
  className?: string;
  onClick?: () => void;
}

export function GlassCard({
  children,
  blur = 'medium',
  tint = 'white',
  border = true,
  shadow = 'md',
  hover3d = false,
  glowBorder = false,
  className,
  onClick,
}: GlassCardProps) {
  const blurValues = {
    light: 'backdrop-blur-sm',
    medium: 'backdrop-blur-md',
    heavy: 'backdrop-blur-xl',
  };

  const tintValues = {
    white: 'bg-white/10 dark:bg-white/5',
    purple: 'bg-purple-500/10 dark:bg-purple-500/5',
    dark: 'bg-black/10 dark:bg-black/20',
  };

  const shadowValues = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  return (
    <motion.div
      whileHover={hover3d ? { 
        y: -8,
        rotateX: 5,
        rotateY: 5,
        transition: { duration: 0.3 }
      } : undefined}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative rounded-xl p-6 transition-all duration-300',
        blurValues[blur],
        tintValues[tint],
        shadowValues[shadow],
        border && 'border border-white/20',
        glowBorder && 'hover:border-[var(--kraken-primary)] hover:shadow-[0_0_20px_rgba(87,65,217,0.3)]',
        hover3d && 'transform-gpu perspective-1000',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 玻璃态背景 */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-white/5 dark:from-white/10 dark:to-transparent" />
      
      {/* 光晕效果 */}
      {glowBorder && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--kraken-primary)]/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 blur-xl" />
      )}
      
      {/* 内容 */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

// 使用示例组件
export function GlassCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
      {/* 轻度模糊 */}
      <GlassCard blur="light" tint="white" hover3d>
        <h3 className="text-xl font-bold mb-2">Light Blur</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          轻度毛玻璃效果
        </p>
      </GlassCard>

      {/* 中度模糊 + 发光边框 */}
      <GlassCard blur="medium" tint="purple" glowBorder hover3d>
        <h3 className="text-xl font-bold mb-2">Glow Border</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          发光边框效果
        </p>
      </GlassCard>

      {/* 重度模糊 */}
      <GlassCard blur="heavy" tint="dark" shadow="xl" hover3d>
        <h3 className="text-xl font-bold mb-2">Heavy Blur</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          重度毛玻璃效果
        </p>
      </GlassCard>
    </div>
  );
}
