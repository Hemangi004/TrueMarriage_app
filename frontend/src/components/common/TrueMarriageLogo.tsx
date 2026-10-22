import React from 'react';

interface TrueMarriageLogoProps {
  variant?: 'full' | 'horizontal' | 'icon-only';
  theme?: 'light' | 'dark';
  className?: string;
  imageClassName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

export const TrueMarriageLogo: React.FC<TrueMarriageLogoProps> = ({
  variant = 'horizontal',
  theme = 'light',
  className = '',
  imageClassName = '',
  size = 'md',
}) => {
  const isDark = theme === 'dark';

  const heightMap = {
    xs: 'h-7 max-h-7 sm:h-8 sm:max-h-8',
    sm: 'h-9 max-h-9 sm:h-10 sm:max-h-10',
    md: 'h-11 max-h-11 sm:h-13 sm:max-h-13',
    lg: 'h-16 max-h-16 sm:h-18 sm:max-h-18',
    xl: 'h-22 max-h-22 sm:h-26 sm:max-h-26',
    '2xl': 'h-30 max-h-30 sm:h-36 sm:max-h-36',
    '3xl': 'h-40 max-h-40 sm:h-48 sm:max-h-48',
  };

  const logoSrc = variant === 'icon-only'
    ? '/logo-icon.png'
    : (isDark ? '/logo-dark.png' : '/logo.png');

  return (
    <div
      className={`inline-flex items-center select-none notranslate ${variant === 'full' ? 'flex-col text-center' : 'gap-2'} ${className}`}
      translate="no"
    >
      <img
        src={logoSrc}
        alt="True Marriage — Real People. Real Stories. Real Together."
        className={`${heightMap[size]} w-auto max-w-full object-contain shrink-0 transition-transform duration-200 hover:scale-[1.02] notranslate ${imageClassName}`}
        loading="eager"
        translate="no"
      />
    </div>
  );
};
