
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, PartyPopper, Stethoscope, Truck, Sparkles, Hammer, SprayCan, Utensils, Hotel, Calendar, Apple, ShoppingBasket } from 'lucide-react';
import { Category } from '../types';

interface BottomNavProps {
  categories: Category[];
  onCategoryClick: (category: Category) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ categories, onCategoryClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 200;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  // Icon Helper (Dynamic Color)
  const getIcon = (iconName: string | undefined, color: string) => {
    const props = { className: "w-6 h-6 mb-1", style: { color } };
    switch(iconName) {
      case 'PartyPopper': return <PartyPopper {...props} />;
      case 'Stethoscope': return <Stethoscope {...props} />;
      case 'Truck': return <Truck {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Hammer': return <Hammer {...props} />;
      case 'SprayCan': return <SprayCan {...props} />;
      case 'Utensils': return <Utensils {...props} />;
      case 'Hotel': return <Hotel {...props} />;
      case 'Apple': return <Apple {...props} />;
      case 'ShoppingBasket': return <ShoppingBasket {...props} />;
      default: return <Calendar {...props} />;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur shadow-[0_-2px_15px_rgba(0,0,0,0.05)] z-50 h-28 flex items-center border-t border-gray-200 pb-safe">
       {/* Scroll Button Left */}
       <button onClick={() => scroll('left')} className="p-2 h-full bg-white hover:bg-gray-50 z-10 hidden md:flex items-center justify-center border-r border-gray-200">
         <ChevronLeft className="w-6 h-6 text-gray-600" />
       </button>

       {/* Scrollable Container */}
       <div 
         ref={scrollRef}
         className="flex-1 flex items-center overflow-x-auto gap-3 px-3 no-scrollbar h-full py-2"
       >
          {categories.map(cat => (
             <button 
                key={cat.id} 
                onClick={() => onCategoryClick(cat)}
                className="flex flex-col items-center justify-center min-w-[90px] h-[85px] rounded-xl bg-white border border-transparent hover:border-gray-200 transition-all active:scale-95 group"
             >
                <div 
                  className="transition-transform group-hover:-translate-y-1 duration-200 p-2.5 rounded-full mb-1" 
                  style={{ backgroundColor: `${cat.themeColor || '#666'}15` }}
                >
                   {getIcon(cat.icon, cat.themeColor || '#666')}
                </div>
                {/* Ensure text is dark and legible */}
                <span className="text-[11px] font-bold text-center leading-tight px-1 truncate w-full text-gray-900 group-hover:text-black">
                    {cat.name}
                </span>
             </button>
          ))}
       </div>

       {/* Scroll Button Right */}
       <button onClick={() => scroll('right')} className="p-2 h-full bg-white hover:bg-gray-50 z-10 hidden md:flex items-center justify-center border-l border-gray-200">
         <ChevronRight className="w-6 h-6 text-gray-600" />
       </button>
    </div>
  );
}

export default BottomNav;
