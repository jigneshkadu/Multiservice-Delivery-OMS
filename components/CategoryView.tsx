
import React from 'react';
import { ArrowLeft, ArrowRight, Calendar, PartyPopper, Stethoscope, Truck, Sparkles, Hammer, SprayCan, Utensils, Hotel, PlusCircle, Apple, ShoppingBasket, MapPin } from 'lucide-react';
import { Category, Vendor } from '../types';
import MapVisualizer from './MapVisualizer';
import VendorCard from './VendorCard';

interface CategoryViewProps {
  category: Category;
  onBack: () => void;
  onSelectSubCategory: (subCat: Category) => void;
  vendors: Vendor[];
  onRegisterClick?: () => void;
  userLocation: { lat: number; lng: number } | null;
}

const getAllCategoryIds = (cat: Category): string[] => {
  let ids = [cat.id];
  if (cat.subCategories) {
    cat.subCategories.forEach(sub => {
      ids = [...ids, ...getAllCategoryIds(sub)];
    });
  }
  return ids;
};

const CategoryView: React.FC<CategoryViewProps> = ({ category, onBack, onSelectSubCategory, vendors, onRegisterClick, userLocation }) => {
  const getIcon = (iconName: string | undefined, className: string, style?: React.CSSProperties) => {
    const props = { className, style };
    switch (iconName) {
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

  const categoryVendorIds = getAllCategoryIds(category);
  const relevantVendors = vendors.filter(v => v.categoryIds.some(id => categoryVendorIds.includes(id)));

  const getVendorCount = (cat: Category) => {
    const relevantIds = getAllCategoryIds(cat);
    return vendors.filter(v => v.categoryIds.some(id => relevantIds.includes(id))).length;
  };

  const themeColor = category.themeColor || '#9C81A4';

  return (
    <div className="container mx-auto px-4 py-6 min-h-[80vh] font-sans">
      <button 
        onClick={onBack}
        className="flex items-center gap-1 font-bold hover:translate-x-[-4px] transition-transform mb-6 text-sm"
        style={{ color: themeColor }}
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div 
            className="w-20 h-20 rounded-2xl flex items-center justify-center bg-white border border-gray-100 shrink-0 shadow-lg"
          >
            {getIcon(category.icon, "w-10 h-10", { color: themeColor })}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{category.name}</h1>
            <p className="text-gray-400 text-sm mt-1">{category.description}</p>
          </div>
        </div>
        
        {onRegisterClick && (
          <button 
              onClick={onRegisterClick}
              className="flex items-center gap-2 text-white px-6 py-3 rounded-xl shadow-lg hover:brightness-110 transition font-bold text-sm whitespace-nowrap"
              style={{ backgroundColor: themeColor }}
          >
              <PlusCircle className="w-5 h-5" /> List your Business
          </button>
        )}
      </div>

      {/* Subcategories Grid */}
      {category.subCategories && category.subCategories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {category.subCategories.map((subCat) => (
            <div 
              key={subCat.id} 
              onClick={() => onSelectSubCategory(subCat)}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group cursor-pointer shadow-sm hover:shadow-xl"
            >
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {subCat.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-2">
                  {subCat.description || `Specialized ${subCat.name} partners in Dahanu.`}
                </p>
              </div>
              
              <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                 <span 
                   className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                   style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                 >
                   {getVendorCount(subCat)} Partners
                 </span>
                 
                 <div 
                   className="flex items-center gap-1 font-bold text-sm group-hover:translate-x-1 transition-transform"
                   style={{ color: themeColor }}
                 >
                   Open <ArrowRight className="w-4 h-4" />
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vendor Listing (Always show vendors available at this level) */}
      <div className="space-y-6 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Service Providers in {category.name}</h2>
          {relevantVendors.length > 0 ? (
              <div className="space-y-4">
                  {relevantVendors.map((vendor, idx) => (
                      <VendorCard 
                        key={vendor.id} 
                        vendor={vendor} 
                        index={idx} 
                        onContact={() => {}} 
                        onDirection={() => {}} 
                        onOrder={() => {}} 
                      />
                  ))}
              </div>
          ) : (
              <div className="bg-white/5 border border-dashed rounded-2xl p-12 text-center text-gray-400">
                  No direct providers in this specific sub-category yet.
              </div>
          )}
      </div>

      {/* Nearby Map Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5" style={{ color: themeColor }}/>
              Providers in your Vicinity
            </h2>
            <div className="text-[10px] font-black text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-tighter">Live Map View</div>
        </div>
        <div className="h-[350px] w-full rounded-xl overflow-hidden shadow-inner border bg-gray-50">
          <MapVisualizer 
            vendors={relevantVendors} 
            userLocation={userLocation}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryView;
