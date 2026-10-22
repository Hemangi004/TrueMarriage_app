import React, { useState, useEffect } from 'react';

const BANNER_IMAGES = [
  {
    src: '/login-banners/banner-1.png',
    alt: 'True Marriage Indian Wedding Hands',
  },
  {
    src: '/login-banners/banner-2.png',
    alt: 'Bridal Floral Elegance',
  },
  {
    src: '/login-banners/banner-3.png',
    alt: 'Sunset Couple Sacred Union',
  },
  {
    src: '/login-banners/banner-4.png',
    alt: 'Traditional Sacred Shringar & Puja',
  },
  {
    src: '/login-banners/banner-5.png',
    alt: 'Sacred Wedding Mandap & Havan at Sunset',
  },
];

interface AuthBannerCarouselProps {
  className?: string;
}

export const AuthBannerCarousel: React.FC<AuthBannerCarouselProps> = ({ className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`w-full md:w-[46%] relative h-[280px] sm:h-[340px] md:h-full md:min-h-[520px] overflow-hidden select-none bg-pink-50 ${className}`}>
      {BANNER_IMAGES.map((img, idx) => (
        <div
          key={img.src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <img
            src={img.src}
            alt={img.alt}
            className="w-full h-full object-cover object-center"
          />
        </div>
      ))}

      {/* Subtle bottom gradient overlay for contrast with indicators */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent z-20 pointer-events-none" />

      {/* Subtle Pill Carousel Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">
        {BANNER_IMAGES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full h-1.5 cursor-pointer ${
              idx === currentIndex
                ? 'w-5 bg-white shadow-sm'
                : 'w-1.5 bg-white/60 hover:bg-white/90'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
