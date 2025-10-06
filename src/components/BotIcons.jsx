// Bot Icons Component - Centralized Icon Management System
// This component provides optimized, reusable icon components for AI chatbots
// Features include:
// - Consistent sizing and styling across the application
// - Performance optimizations (eager loading, crisp rendering)
// - Visual enhancements (contrast, brightness, saturation adjustments)
// - Responsive design with flexible className support

import React from 'react';

// Loom - Creative AI Bot Icon Component
// This is the main AI assistant bot that helps users with creative styling decisions
// The icon represents the bot's creative and artistic personality
export const LoomIcon = ({ className = "w-6 h-6" }) => (
  <img 
    // External image URL hosted on ImgBB for reliable CDN delivery
    src="https://i.ibb.co/5XGk8dS5/Gemini-Generated-Image-78j2ym78j2ym78j2-1.webp" 
    
    // Descriptive alt text for accessibility and screen readers
    alt="Loom AI Bot" 
    
    // Dynamic className support allows parent components to control sizing
    // Default size is w-6 h-6 (24x24px) but can be overridden
    className={`${className} object-contain object-center`}
    
    // Performance optimizations:
    loading="eager"    // Load immediately for better UX (bot icons are critical)
    decoding="sync"    // Decode synchronously to prevent layout shifts
    
    // Visual enhancement styles for better icon appearance
    style={{ 
      // Crisp pixel rendering for sharp edges at any size
      imageRendering: 'crisp-edges',
      
      // Color adjustments to make the icon more vibrant and visible
      filter: 'contrast(1.1) brightness(1.05) saturate(1.1)',
      
      // Ensure icon fills container completely for consistent appearance
      minWidth: '100%',
      minHeight: '100%'
    }}
  />
);