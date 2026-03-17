
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
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-lg bg-white/70 backdrop-blur-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] z-50 h-20 flex items-center border border-white/40 rounded-[2.5rem] overflow-hidden px-2 saturate-150">
       {/* Scrollable Container */}
       <div 
         ref={scrollRef}
         className="flex-1 flex items-center overflow-x-auto gap-0.5 px-2 no-scrollbar h-full py-1"
       >
          {categories.map(cat => (
             <button 
                key={cat.id} 
                onClick={() => onCategoryClick(cat)}
                className="flex flex-col items-center justify-center min-w-[72px] h-[64px] rounded-2xl hover:bg-white/40 transition-all active:scale-90 group relative"
             >
                <div 
                  className="transition-all group-hover:-translate-y-1 duration-300 p-1.5 rounded-xl mb-0.5 group-hover:shadow-sm" 
                  style={{ backgroundColor: `${cat.themeColor || '#666'}15` }}
                >
                   {getIcon(cat.icon, cat.themeColor || '#666')}
                </div>
                <span className="text-[9px] font-black text-center leading-tight px-1 truncate w-full text-slate-800 group-hover:text-black uppercase tracking-tighter opacity-80 group-hover:opacity-100">
                    {cat.name}
                </span>
                <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
             </button>
          ))}
       </div>
    </div>
  );
}

export default BottomNav;
