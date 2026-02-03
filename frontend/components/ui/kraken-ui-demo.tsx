'use client';

import React from 'react';
import { H1Gradient, H1Neon, H13D, H1Metallic } from '@/components/ui/3d-heading';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { ParticleBackground } from '@/components/ui/particle-background';

/**
 * Kraken UI Design System Demo Page
 * 
 * This page demonstrates all the new Kraken-style UI components.
 * To use this page, import it in your app:
 * 
 * import KrakenUIDemo from '@/components/ui/kraken-ui-demo';
 * 
 * Then render it: <KrakenUIDemo />
 */
export default function KrakenUIDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section with Particle Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <ParticleBackground particleCount={75} />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <H1Gradient text="Kraken UI Design System" animated />
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mt-6 mb-8">
            Experience the next generation of crypto exchange design
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GradientButton variant="kraken" size="lg" glow>
              Start Trading
            </GradientButton>
            <GradientButton variant="ghost" size="lg">
              Learn More
            </GradientButton>
          </div>
        </div>
      </section>

      {/* 3D Text Effects Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">3D Text Effects</h2>
          
          <div className="space-y-8">
            <div className="text-center">
              <H1Gradient text="Gradient Effect" animated={false} />
              <p className="text-sm text-gray-500 mt-2">Smooth color gradient</p>
            </div>
            
            <div className="text-center">
              <H1Neon text="Neon Glow Effect" animated={false} />
              <p className="text-sm text-gray-500 mt-2">Pulsing neon glow</p>
            </div>
            
            <div className="text-center">
              <H13D text="3D Depth Effect" animated={false} />
              <p className="text-sm text-gray-500 mt-2">Layered 3D shadow</p>
            </div>
            
            <div className="text-center">
              <H1Metallic text="Metallic Effect" animated={false} />
              <p className="text-sm text-gray-500 mt-2">Shiny metal finish</p>
            </div>
          </div>
        </div>
      </section>

      {/* Glass Cards Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Glassmorphism Cards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard blur="light" tint="white" hover3d>
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Execute trades in milliseconds with our advanced engine
                </p>
              </div>
            </GlassCard>

            <GlassCard blur="medium" tint="purple" glowBorder hover3d>
              <div className="text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-bold mb-2">Bank-Grade Security</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your assets protected with military-grade encryption
                </p>
              </div>
            </GlassCard>

            <GlassCard blur="heavy" tint="dark" shadow="xl" hover3d>
              <div className="text-center">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get help anytime from our dedicated support team
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Gradient Buttons Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Gradient Buttons</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <GradientButton variant="kraken" fullWidth glow>
                Kraken Style
              </GradientButton>
              <p className="text-sm text-gray-500 mt-2 text-center">Primary brand button</p>
            </div>

            <div>
              <GradientButton variant="success" fullWidth>
                Success Action
              </GradientButton>
              <p className="text-sm text-gray-500 mt-2 text-center">Success variant</p>
            </div>

            <div>
              <GradientButton variant="danger" fullWidth>
                Danger Action
              </GradientButton>
              <p className="text-sm text-gray-500 mt-2 text-center">Danger variant</p>
            </div>

            <div>
              <GradientButton variant="ghost" fullWidth>
                Ghost Style
              </GradientButton>
              <p className="text-sm text-gray-500 mt-2 text-center">Ghost variant</p>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <GradientButton variant="kraken" size="sm">Small</GradientButton>
            <GradientButton variant="kraken" size="md">Medium</GradientButton>
            <GradientButton variant="kraken" size="lg">Large</GradientButton>
            <GradientButton variant="kraken" size="xl">Extra Large</GradientButton>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of traders using our platform every day
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GradientButton variant="kraken" size="lg" glow>
              Create Account
            </GradientButton>
            <button className="px-8 py-4 text-lg rounded-xl border-2 border-white hover:bg-white/10 transition-all">
              View Documentation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
