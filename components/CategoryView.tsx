
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
  onContact: (vendor: Vendor) => void;
  onDirection: (vendor: Vendor) => void;
  onOrder: (vendor: Vendor) => void;
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

const CategoryView: React.FC<CategoryViewProps> = ({ 
  category, onBack, onSelectSubCategory, vendors, onRegisterClick, userLocation,
  onContact, onDirection, onOrder
}) => {
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

  const themeColor = category.themeColor || '#475569';

  return (
    <div className="min-h-screen bg-appBg relative overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />

      {/* Dark Themed Header Section */}
      <div className="bg-[#1a1c2e] text-white pt-2 pb-4 md:pt-8 md:pb-12 shadow-2xl relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 font-bold hover:translate-x-[-4px] transition-transform mb-2 md:mb-8 text-xs md:text-sm"
                style={{ color: themeColor }}
            >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" /> Back
            </button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6">
                <div className="flex items-center gap-3 md:gap-6 p-3 md:p-8 bg-white/10 rounded-xl md:rounded-3xl backdrop-blur-md border border-white/5">
                    <div className="w-10 h-10 md:w-20 md:h-20 rounded-lg md:rounded-2xl flex items-center justify-center bg-white shrink-0 shadow-2xl">
                        {getIcon(category.icon, "w-5 h-5 md:w-10 md:h-10", { color: themeColor })}
                    </div>
                    <div>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                           <h1 className="text-lg md:text-4xl font-black tracking-tight">{category.name}</h1>
                           <span className="px-1.5 py-0.5 md:px-3 md:py-1 rounded-full text-[7px] md:text-[10px] font-black uppercase text-white" style={{ backgroundColor: themeColor }}>Service Hub</span>
                        </div>
                        <p className="text-white/60 text-[10px] md:text-sm mt-0.5 md:mt-2 max-w-xl leading-tight md:leading-relaxed line-clamp-1 md:line-clamp-none">{category.description}</p>
                    </div>
                </div>
                
                {onRegisterClick && (
                    <button 
                        onClick={onRegisterClick}
                        className="flex items-center justify-center gap-2 text-white px-4 py-2.5 md:px-8 md:py-4 rounded-lg md:rounded-2xl shadow-xl transition-all font-black text-[9px] md:text-xs uppercase tracking-widest active:scale-95 whitespace-nowrap w-full md:w-auto"
                        style={{ backgroundColor: themeColor }}
                    >
                        <PlusCircle className="w-3.5 h-3.5 md:w-5 md:h-5" /> List your Business
                    </button>
                )}
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-4 md:mt-8 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 space-y-6">
                {category.subCategories && category.subCategories.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.subCategories.map((subCat) => (
                        <div 
                            key={subCat.id} 
                            onClick={() => onSelectSubCategory(subCat)}
                            className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
                        >
                            <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-1 md:mb-2">
                                {subCat.name}
                            </h3>
                            <p className="text-gray-500 text-[10px] md:text-xs line-clamp-2">
                                {subCat.description || `Explore ${subCat.name} options.`}
                            </p>
                        </div>
                    ))}
                    </div>
                )}

                <div className="bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl p-6 md:p-8 shadow-2xl">
                    <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-6 md:mb-8">Providers</h2>
                    {relevantVendors.length > 0 ? (
                        <div className="space-y-4">
                            {relevantVendors.map((vendor, idx) => (
                                <VendorCard 
                                    key={vendor.id} 
                                    vendor={vendor} 
                                    index={idx} 
                                    onContact={onContact} 
                                    onDirection={onDirection} 
                                    onOrder={onOrder} 
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center flex flex-col items-center justify-center text-gray-400">
                            <ShoppingBasket className="w-12 h-12 mb-4 opacity-10" />
                            <p className="font-bold">No providers listed yet</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white/60 backdrop-blur-2xl border border-white/30 p-6 rounded-3xl shadow-2xl sticky top-28">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-secondary"/> Map View
                    </h2>
                    <div className="h-[450px] w-full rounded-2xl overflow-hidden shadow-inner border border-white/20 bg-gray-50/50">
                        <MapVisualizer 
                            vendors={relevantVendors} 
                            userLocation={userLocation}
                        />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryView;
