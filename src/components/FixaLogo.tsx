import React, { useState } from 'react';

interface FixaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showText?: boolean;
  glow?: boolean;
}

export const FixaLogo: React.FC<FixaLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  glow = false,
}) => {
  const [imgSrc, setImgSrc] = useState<string>(() => {
    // Check if user uploaded a custom logo via Admin
    const custom = localStorage.getItem('fixa_custom_logo');
    return custom || '/public/fixa-gaming-logo.svg';
  });

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10 md:h-12 md:w-12',
    lg: 'h-16 w-16 md:h-20 md:w-20',
    xl: 'h-24 w-24 md:h-28 md:w-28',
    hero: 'h-32 w-32 md:h-44 md:w-44',
  }[size];

  const handleImgError = () => {
    // If custom image fails or /public doesn't resolve, fallback to root or svg
    if (imgSrc.includes('/public/')) {
      setImgSrc('/fixa-gaming-logo.svg');
    }
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div className="relative flex items-center justify-center">
        {glow && (
          <div className="absolute inset-0 rounded-full bg-red-600/30 blur-xl animate-pulse-glow pointer-events-none" />
        )}
        <img
          src={imgSrc}
          alt="FIXA GAMING Official Logo"
          onError={handleImgError}
          className={`${sizeClasses} object-contain transition-transform duration-300 hover:scale-105 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]`}
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-heading font-black text-xl md:text-2xl tracking-wider text-white flex items-center gap-1">
            FIXA <span className="text-red-500">GAMING</span>
          </span>
          <span className="font-accent text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-red-400/90">
            Free Fire Esports Hub
          </span>
        </div>
      )}
    </div>
  );
};
