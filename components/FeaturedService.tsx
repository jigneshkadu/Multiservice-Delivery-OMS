
import React, { useState, useEffect } from 'react';
import { Vendor } from '../types';
import { MapPin, Star, Phone, ShoppingBag } from 'lucide-react';

interface FeaturedServiceProps {
  vendors: Vendor[];
  pinnedVendorId?: string;
  onContactClick: (vendor: Vendor) => void;
  onOrderClick?: (vendor: Vendor) => void; // New Prop
}

const FeaturedService: React.FC<FeaturedServiceProps> = ({ vendors, pinnedVendorId, onContactClick, onOrderClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // If a vendor is pinned, we only care about that one.
  const pinnedVendor = pinnedVendorId ? vendors.find(v => v.id === pinnedVendorId) : null;
  
  useEffect(() => {
    if (pinnedVendor) return; // Stop cycling if pinned
    if (vendors.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % vendors.length);
    }, 4000); // Changed to 4 seconds for better readability

    return () => clearInterval(interval);
  }, [pinnedVendor, vendors.length]);

  const displayVendor = pinnedVendor || vendors[currentIndex];

  if (!displayVendor) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 shadow-sm relative overflow-hidden group transition-all hover:shadow-md">
      {/* Label Tag */}
      <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-3 py-1 rounded-bl-lg z-10 shadow-sm">
        {pinnedVendor ? 'FEATURED' : 'HIGHLIGHTED SERVICE'}
      </div>
      
      <div className="flex flex-row gap-4 items-center">
        {/* Image */}
        <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden border border-white shadow-sm bg-gray-200">
           <img 
             src={displayVendor.imageUrl} 
             alt={displayVendor.name} 
             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
           />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
           <h3 className="font-bold text-gray-900 truncate text-lg leading-tight mb-1">{displayVendor.name}</h3>
           <p className="text-xs text-gray-500 mb-2 truncate uppercase tracking-wide font-medium">{displayVendor.categoryIds.join(', ')}</p>
           
           <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
              <MapPin className="w-3 h-3 text-red-500 shrink-0" />
              <span className="truncate">{displayVendor.location.address}</span>
           </div>
           
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 bg-white border border-gray-100 px-2 py-1 rounded-full text-[10px] font-bold shadow-sm">
                 <span className="text-green-600">{displayVendor.rating}</span> <Star className="w-2 h-2 fill-green-600 text-green-600" />
              </div>
              
              {/* Dynamic Action Button */}
              {displayVendor.supportsDelivery && onOrderClick ? (
                  <button 
                    onClick={() => onOrderClick(displayVendor)}
                    className="bg-green-600 text-white text-xs px-4 py-1.5 rounded-full shadow hover:bg-green-700 transition flex items-center gap-1 font-bold animate-fade-in"
                  >
                     <ShoppingBag className="w-3 h-3" /> Order Now
                  </button>
              ) : (
                  <button 
                    onClick={() => onContactClick(displayVendor)}
                    className="bg-primary text-white text-xs px-4 py-1.5 rounded-full shadow hover:bg-opacity-90 transition flex items-center gap-1 font-bold"
                  >
                     <Phone className="w-3 h-3" /> Contact
                  </button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedService;
