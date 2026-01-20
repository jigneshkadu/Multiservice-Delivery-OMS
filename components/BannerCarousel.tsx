import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Banner } from '../types';

interface BannerCarouselProps {
  banners: Banner[];
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const prev = () => {
    setCurrentIndex((curr) => (curr === 0 ? banners.length - 1 : curr - 1));
  };

  const next = () => {
    setCurrentIndex((curr) => (curr + 1) % banners.length);
  };

  if (banners.length === 0) return null;

  return (
    <div className="relative w-full bg-white shadow-sm overflow-hidden group">
      <div 
        className="flex transition-transform duration-500 ease-in-out h-48 md:h-72"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="min-w-full h-full relative">
            <img 
              src={banner.imageUrl} 
              alt={banner.altText} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <button 
        onClick={prev} 
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 p-3 rounded-r-md hover:bg-white shadow hidden group-hover:block"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>
      <button 
        onClick={next} 
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 p-3 rounded-l-md hover:bg-white shadow hidden group-hover:block"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>
    </div>
  );
};

export default BannerCarousel;