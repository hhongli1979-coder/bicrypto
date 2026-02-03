'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'kraken' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}

export function GradientButton({
  children,
  variant = 'kraken',
  size = 'md',
  glow = false,
  icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  className,
  disabled,
  ...props
}: GradientButtonProps) {
  const variants = {
    kraken: 'bg-gradient-to-r from-[#5741D9] via-[#7E22CE] to-[#A855F7] hover:from-[#4C3BAA] hover:via-[#6B1FA8] hover:to-[#9333EA]',
    success: 'bg-gradient-to-r from-[#26A17B] to-[#34D399] hover:from-[#22916D] hover:to-[#2DBB82]',
    danger: 'bg-gradient-to-r from-[#F05142] to-[#F87171] hover:from-[#DC483B] hover:to-[#EF4444]',
    ghost: 'bg-transparent border-2 border-[var(--kraken-primary)] text-[var(--kraken-primary)] hover:bg-[var(--kraken-primary)] hover:text-white',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={disabled || loading}
      className={cn(
        'relative rounded-xl font-semibold text-white transition-all duration-300',
        'shadow-lg hover:shadow-xl',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        glow && 'hover:shadow-[0_0_30px_rgba(87,65,217,0.5)]',
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {/* 发光背景 */}
      {glow && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#5741D9] to-[#A855F7] opacity-0 hover:opacity-50 blur-xl transition-opacity duration-300" />
      )}

      {/* 内容 */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {!loading && icon && iconPosition === 'left' && icon}
        {children}
        {!loading && icon && iconPosition === 'right' && icon}
      </span>
    </motion.button>
  );
}

// 使用示例
export function GradientButtonExample() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <GradientButton variant="kraken" glow>
        开始交易
      </GradientButton>

      <GradientButton variant="success" icon={<span>✓</span>}>
        确认订单
      </GradientButton>

      <GradientButton variant="danger" size="lg">
        取消交易
      </GradientButton>

      <GradientButton variant="ghost" fullWidth>
        了解更多
      </GradientButton>

      <GradientButton variant="kraken" loading>
        加载中...
      </GradientButton>
    </div>
  );
}
