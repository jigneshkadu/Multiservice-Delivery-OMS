
import React from 'react';
import { Vendor } from '../types';
import { PhoneCall, Star, CheckCircle, MapPin, ShoppingBag, Navigation, Tag, Truck } from 'lucide-react';

interface VendorCardProps {
  vendor: Vendor;
  index: number;
  onContact: (vendor: Vendor) => void;
  onDirection: (vendor: Vendor) => void;
  onOrder: (vendor: Vendor) => void;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor, index, onContact, onDirection, onOrder }) => {
  const showProducts = vendor.supportsDelivery && Array.isArray(vendor.products) && vendor.products.length > 0;

  return (
    <div className="bg-white p-4 rounded-xl shadow-theme hover:shadow-lg transition flex flex-col md:flex-row gap-4 group border-l-4 border-l-transparent hover:border-l-primary relative overflow-hidden">
      
      {/* Image Section */}
      <div className="w-full md:w-48 h-32 bg-gray-100 rounded-lg overflow-hidden relative shrink-0">
        <img 
            src={vendor.imageUrl} 
            alt={vendor.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
        />
        {vendor.isVerified && (
            <div className="absolute top-1 left-1 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <CheckCircle className="w-3 h-3"/> VERIFIED
            </div>
        )}
        
        {/* Map Label Badge (A, B, C...) */}
        <div className="absolute bottom-1 right-1 bg-white text-gray-800 w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md">
           {String.fromCharCode(65 + index)}
        </div>
      </div>

      {/* Info Section */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-lg font-bold text-gray-800 truncate pr-2">
                    {vendor.name}
                </h3>
                {vendor.supportsDelivery && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-100 mb-1">
                        <Truck className="w-3 h-3" /> Delivery Available
                    </span>
                )}
            </div>
        </div>

        <div className="flex items-center gap-2 text-sm mb-2">
           <span className="bg-green-600 text-white px-1.5 rounded text-xs font-bold flex items-center">
               {vendor.rating} <Star className="w-3 h-3 ml-0.5 fill-current"/>
           </span>
           <span className="text-gray-500 text-xs">120 Ratings</span>
        </div>
        
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{vendor.description}</p>
        
        <div className="text-xs text-gray-500 flex items-center gap-1 mb-3">
           <MapPin className="w-3 h-3 text-gray-400" /> {vendor.location.address}
        </div>

        {/* --- PRODUCT PREVIEW (Specific to Fresh/Mart) --- */}
        {showProducts && (
            <div className="mt-3 pt-2 border-t border-dashed border-gray-200">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Popular Items:</span>
                <div className="flex flex-wrap gap-2">
                    {vendor.products!.slice(0, 3).map((p, i) => (
                        <div key={i} className="bg-orange-50 border border-orange-100 px-2 py-1 rounded text-xs text-gray-700 flex items-center gap-1 font-medium whitespace-nowrap">
                            <Tag className="w-3 h-3 text-secondary"/> 
                            {p.name}
                        </div>
                    ))}
                    {vendor.products!.length > 3 && (
                        <div className="bg-gray-50 border border-gray-100 px-2 py-1 rounded text-xs text-gray-500 font-bold">
                            +{vendor.products!.length - 3} more
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>

      {/* Action Section */}
      <div className="flex flex-col justify-between items-end min-w-[140px] border-t md:border-t-0 md:border-l md:pl-4 md:border-gray-100 pt-4 md:pt-0 mt-2 md:mt-0">
        <div className="text-xl font-bold text-primary">
            ₹{vendor.priceStart}
            <span className="text-xs font-normal text-gray-500"> onwards</span>
        </div>
        
        <div className="w-full space-y-2 mt-auto">
             {/* Dynamic Button: Order vs Contact */}
             {vendor.supportsDelivery ? (
                 <button 
                     onClick={() => onOrder(vendor)}
                     className="bg-green-600 text-white px-4 py-2.5 rounded-md font-bold shadow hover:bg-green-700 w-full flex items-center justify-center gap-2 transition-colors text-sm"
                 >
                     <ShoppingBag className="w-4 h-4" /> Order Now
                 </button>
             ) : (
                 <button 
                     onClick={() => onContact(vendor)}
                     className="bg-primary text-white px-4 py-2.5 rounded-md font-bold shadow hover:bg-[#8A7090] w-full flex items-center justify-center gap-2 transition-colors text-sm"
                 >
                     <PhoneCall className="w-4 h-4" /> Contact
                 </button>
             )}

             <button 
                 onClick={() => onDirection(vendor)}
                 className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-md font-bold shadow-sm hover:bg-gray-50 w-full flex items-center justify-center gap-2 transition-colors text-sm"
             >
                 <Navigation className="w-4 h-4" /> Direction
             </button>
        </div>
      </div>
    </div>
  );
};

export default VendorCard;
