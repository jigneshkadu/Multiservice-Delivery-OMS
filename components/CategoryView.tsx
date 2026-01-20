
import React from 'react';
import { ArrowLeft, ArrowRight, Calendar, PartyPopper, Stethoscope, Truck, Sparkles, Hammer, SprayCan, Utensils, Hotel, PlusCircle, Apple, ShoppingBasket } from 'lucide-react';
import { Category, Vendor } from '../types';
import MapVisualizer from './MapVisualizer';

interface CategoryViewProps {
  category: Category;
  onBack: () => void;
  onSelectSubCategory: (id: string) => void;
  vendors: Vendor[];
  onRegisterClick?: () => void;
  userLocation: { lat: number; lng: number } | null;
}

// Helper to get all child IDs recursively
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
  // Dynamic Icon mapping - accept className and style
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

  // Filter vendors relevant to this category tree
  const categoryVendorIds = getAllCategoryIds(category);
  const relevantVendors = vendors.filter(v => v.categoryIds.some(id => categoryVendorIds.includes(id)));

  // Count vendors for a specific subcategory
  const getVendorCount = (cat: Category) => {
    const relevantIds = getAllCategoryIds(cat);
    return vendors.filter(v => v.categoryIds.some(id => relevantIds.includes(id))).length;
  };

  const themeColor = category.themeColor || '#9C81A4';

  return (
    <div className="container mx-auto px-4 py-6 min-h-[80vh]">
      <button 
        onClick={onBack}
        className="flex items-center gap-1 font-medium hover:underline mb-6 transition-colors"
        style={{ color: themeColor }}
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div 
            className="w-20 h-20 rounded-2xl flex items-center justify-center bg-white border border-gray-100"
            style={{ 
              boxShadow: `0 10px 25px -5px ${themeColor}50`, // Colored glow
            }}
          >
            {getIcon(category.icon, "w-10 h-10", { color: themeColor })}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{category.name}</h1>
            <p className="text-gray-300 text-sm mt-1">{category.description}</p>
          </div>
        </div>
        
        {onRegisterClick && (
            <button 
              onClick={onRegisterClick}
              className="flex items-center gap-2 text-white px-6 py-3 rounded-lg shadow-lg hover:brightness-110 transition font-bold"
              style={{ backgroundColor: themeColor }}
            >
              <PlusCircle className="w-5 h-5" /> List your Business
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {category.subCategories?.map((subCat) => (
          <div 
            key={subCat.id} 
            onClick={() => onSelectSubCategory(subCat.id)}
            className="bg-white rounded-xl p-6 border border-gray-100 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group cursor-pointer"
            style={{ boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.05)` }}
          >
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors" style={{ color: 'inherit' }}>
                <span className="group-hover:text-[var(--primary-color)] transition-colors">{subCat.name}</span>
              </h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {subCat.description || `Browse vendors for ${subCat.name}`}
              </p>
            </div>
            
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
               <span 
                 className="px-3 py-1 rounded-full text-xs font-bold"
                 style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
               >
                 {getVendorCount(subCat)} Vendors
               </span>
               
               <div 
                 className="flex items-center gap-1 font-bold text-sm group-hover:translate-x-1 transition-transform"
                 style={{ color: themeColor }}
               >
                 View List <ArrowRight className="w-4 h-4" />
               </div>
            </div>
          </div>
        ))}

        {/* Add Service / Register CTA Card */}
        <div 
          className="bg-white rounded-xl p-6 border-2 border-dashed flex flex-col items-center justify-center text-center h-full min-h-[200px]"
          style={{ borderColor: `${themeColor}40` }}
        >
           <div className="bg-white p-3 rounded-full mb-4 shadow-sm" style={{ color: themeColor }}>
             <PlusCircle className="w-8 h-8" />
           </div>
           <h3 className="text-lg font-bold text-gray-800 mb-2">Own a Service?</h3>
           <p className="text-sm text-gray-600 mb-4">Join our platform and reach thousands of customers in Dahanu.</p>
           <button 
             onClick={onRegisterClick} 
             className="font-bold hover:underline"
             style={{ color: themeColor }}
           >
             Register Now &rarr;
           </button>
        </div>
        
        {(!category.subCategories || category.subCategories.length === 0) && (
            <div className="col-span-3 text-center py-12 text-gray-400">
                No sub-categories found. <button onClick={() => onSelectSubCategory(category.id)} className="underline" style={{color: themeColor}}>View all {category.name}</button>
            </div>
        )}
      </div>

      {/* Nearby Map Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200" style={{ boxShadow: `0 10px 15px -3px ${themeColor}15` }}>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          Nearby {category.name} Providers
          <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Map View</span>
        </h2>
        <div className="h-[300px] w-full">
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
