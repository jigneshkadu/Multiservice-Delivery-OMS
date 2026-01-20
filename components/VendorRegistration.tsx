
import React, { useState, useMemo } from 'react';
import { Category, Vendor, Product } from '../types';
import { MapPin, Crosshair, Loader2, Plus, Trash2, Image, Upload, CheckCircle } from 'lucide-react';
import PaymentModal from './PaymentModal';

interface VendorRegistrationProps {
  categories: Category[];
  onSubmit: (vendor: Partial<Vendor>) => void;
  onCancel: () => void;
}

interface FlattenedCategory {
    id: string;
    name: string;
    pathIds: string[]; // Store full path of IDs
    registrationFee: number;
}

const VendorRegistration: React.FC<VendorRegistrationProps> = ({ categories, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    description: '',
    lat: '',
    lng: '',
    promotionalBannerUrl: ''
  });
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [detectingLoc, setDetectingLoc] = useState(false);
  
  // Product Management
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({ name: '', price: 0, image: '' });

  // Payment State
  const [showPayment, setShowPayment] = useState(false);

  // Helper to flatten subcategories
  const subCategoriesList = useMemo(() => {
    const parent = categories.find(c => c.id === selectedCategory);
    if (!parent) return [];

    const flatten = (c: Category, prefix: string = '', parentPath: string[] = []): FlattenedCategory[] => {
          let list: FlattenedCategory[] = [];
          if (c.subCategories) {
              c.subCategories.forEach(sub => {
                  const displayName = prefix ? `${prefix} › ${sub.name}` : sub.name;
                  const currentPath = [...parentPath, sub.id];
                  
                  list.push({ 
                      id: sub.id, 
                      name: displayName,
                      pathIds: currentPath,
                      registrationFee: sub.registrationFee || (c.registrationFee || 999)
                  });
                  
                  list = [...list, ...flatten(sub, displayName, currentPath)];
              });
          }
          return list;
      }
      return flatten(parent, '', [parent.id]);
  }, [selectedCategory, categories]);

  // Calculate Registration Fee
  const currentFee = useMemo(() => {
      // 1. Check Subcategory specific fee
      if (selectedSubCategory) {
          const sub = subCategoriesList.find(s => s.id === selectedSubCategory);
          if (sub && sub.registrationFee) return sub.registrationFee;
      }
      
      // 2. Check Parent Category fee
      if (selectedCategory) {
          const cat = categories.find(c => c.id === selectedCategory);
          if (cat && cat.registrationFee) return cat.registrationFee;
      }

      // 3. Default
      return 999;
  }, [selectedCategory, selectedSubCategory, categories, subCategoriesList]);

  const handleDetectLocation = () => {
      if (!navigator.geolocation) {
          alert('Geolocation is not supported by your browser');
          return;
      }
      setDetectingLoc(true);
      const options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };
      navigator.geolocation.getCurrentPosition(
          (position) => {
              setFormData({
                  ...formData,
                  lat: position.coords.latitude.toFixed(6),
                  lng: position.coords.longitude.toFixed(6)
              });
              setDetectingLoc(false);
          },
          (error) => {
              console.error("Geolocation Error:", error);
              setDetectingLoc(false);
              alert("Unable to retrieve location. Please check permissions.");
          },
          options
      );
  };

  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setNewProduct({...newProduct, image: reader.result as string});
          };
          reader.readAsDataURL(file);
      }
  };

  const handleAddProduct = () => {
     if (newProduct.name && newProduct.price > 0) {
         setProducts([...products, newProduct]);
         setNewProduct({ name: '', price: 0, image: '' });
     } else {
         alert("Please enter valid product name and price");
     }
  };

  const handleRemoveProduct = (index: number) => {
      setProducts(products.filter((_, i) => i !== index));
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form basics
    if (!formData.name || !formData.contact) {
        alert("Please fill in Business Name and Contact details");
        return;
    }
    // Show Payment Modal
    setShowPayment(true);
  };

  const finalizeRegistration = () => {
    // Determine all category IDs associated with this selection
    let catIds: string[] = [];
    if (selectedCategory) {
        if (selectedSubCategory) {
            const selectedSub = subCategoriesList.find(s => s.id === selectedSubCategory);
            if (selectedSub) {
                catIds = selectedSub.pathIds;
            } else {
                catIds = [selectedCategory, selectedSubCategory];
            }
        } else {
            catIds = [selectedCategory];
        }
    }

    const lat = parseFloat(formData.lat) || 0;
    const lng = parseFloat(formData.lng) || 0;
    
    // Determine if supports delivery
    const isDeliveryCategory = catIds.some(id => id.includes('fresh') || id.includes('mart') || id.includes('food'));

    onSubmit({
      ...formData,
      categoryIds: catIds,
      id: Math.random().toString(36).substr(2, 9),
      maskedContact: formData.contact,
      rating: 4.5,
      isVerified: false,
      isApproved: false,
      imageUrl: 'https://picsum.photos/300/200',
      priceStart: products.length > 0 ? Math.min(...products.map(p => p.price)) : 0,
      products: products,
      supportsDelivery: isDeliveryCategory,
      location: { lat, lng, address: formData.address }
    });
    
    setShowPayment(false);
    alert("Registration submitted! Your business will be listed after Admin approval.");
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md border border-gray-100 max-w-2xl mx-auto my-8 animate-fade-in relative">
      
      {showPayment && (
          <PaymentModal 
             isOpen={showPayment}
             onClose={() => setShowPayment(false)}
             amount={currentFee}
             title="One-time Registration Fee"
             onSuccess={finalizeRegistration}
          />
      )}

      <h2 className="text-2xl font-bold mb-6 text-gray-800">Register as a Service Partner</h2>
      <form onSubmit={handleInitialSubmit} className="space-y-4">
        {/* Basic Info */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Business Name</label>
          <input 
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            placeholder="e.g. Royal Events"
          />
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <label className="block text-sm font-medium text-gray-700">Primary Category</label>
            <select 
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white"
                value={selectedCategory}
                onChange={e => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubCategory('');
                }}
            >
                <option value="">Select Category</option>
                {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700">Sub-Category</label>
            <select 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white disabled:bg-gray-50 disabled:text-gray-400"
                value={selectedSubCategory}
                onChange={e => setSelectedSubCategory(e.target.value)}
                disabled={!selectedCategory || subCategoriesList.length === 0}
                required={subCategoriesList.length > 0}
            >
                <option value="">Select Sub-Category</option>
                {subCategoriesList.map(s => (
                <option key={s.id} value={s.id}>{s.name} - ₹{s.registrationFee}</option>
                ))}
            </select>
            </div>
        </div>
        
        {/* Display Fee Info */}
        <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded flex justify-between items-center">
            <span>Registration Fee applicable for selected category:</span>
            <span className="font-bold text-lg">₹{currentFee}</span>
        </div>
        
        {/* Promotional Banner */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Promotional Banner URL (Optional)</label>
          <input 
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            value={formData.promotionalBannerUrl}
            onChange={e => setFormData({...formData, promotionalBannerUrl: e.target.value})}
            placeholder="https://... (Link to your promo banner)"
          />
        </div>

        {/* Contact */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Number</label>
          <input 
            required
            type="tel"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            value={formData.contact}
            onChange={e => setFormData({...formData, contact: e.target.value})}
            placeholder="+91 98765 43210"
          />
        </div>

        {/* Location Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-700 flex items-center gap-1"><MapPin className="w-4 h-4"/> Business Location</label>
                <button 
                    type="button" 
                    onClick={handleDetectLocation}
                    disabled={detectingLoc}
                    className="text-xs bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded shadow-sm hover:bg-gray-100 flex items-center gap-1 transition"
                >
                    {detectingLoc ? <Loader2 className="w-3 h-3 animate-spin"/> : <Crosshair className="w-3 h-3"/>}
                    Detect My Location
                </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                    <label className="text-xs text-gray-500">Latitude</label>
                    <input 
                        type="number" step="any"
                        className="w-full border border-gray-300 rounded py-1 px-2 text-sm"
                        value={formData.lat}
                        onChange={e => setFormData({...formData, lat: e.target.value})}
                        placeholder="0.0000"
                        required
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500">Longitude</label>
                    <input 
                        type="number" step="any"
                        className="w-full border border-gray-300 rounded py-1 px-2 text-sm"
                        value={formData.lng}
                        onChange={e => setFormData({...formData, lng: e.target.value})}
                        placeholder="0.0000"
                        required
                    />
                </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Full Address</label>
              <textarea 
                required
                rows={2}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary text-sm"
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                placeholder="Shop No, Street, Landmark..."
              />
            </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description of Services</label>
          <textarea 
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="Tell customers what you offer..."
          />
        </div>

        {/* Product Addition Section */}
        <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"><Plus className="w-4 h-4"/> Add Products / Services (Fresh/Mart)</h3>
            <div className="grid grid-cols-12 gap-2 mb-3 items-end">
                <div className="col-span-5">
                    <input 
                        className="w-full border rounded p-2 text-sm" 
                        placeholder="Product Name" 
                        value={newProduct.name}
                        onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    />
                </div>
                <div className="col-span-3">
                    <input 
                        type="number"
                        className="w-full border rounded p-2 text-sm" 
                        placeholder="Price" 
                        value={newProduct.price || ''}
                        onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                    />
                </div>
                <div className="col-span-3">
                    <input 
                        type="file"
                        id="product-image-reg"
                        className="hidden" 
                        accept="image/*"
                        onChange={handleProductImageChange}
                    />
                    <label 
                        htmlFor="product-image-reg" 
                        className={`w-full border rounded p-2 text-xs flex items-center justify-center gap-1 cursor-pointer truncate ${newProduct.image ? 'bg-green-50 border-green-300 text-green-700 font-bold' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
                        title={newProduct.image ? "Image Selected" : "Browse Product Image"}
                    >
                        {newProduct.image ? (
                           <><CheckCircle className="w-3 h-3"/> Selected</>
                        ) : (
                           <><Upload className="w-3 h-3"/> Browse</>
                        )}
                    </label>
                </div>
                <div className="col-span-1">
                    <button type="button" onClick={handleAddProduct} className="bg-primary text-white p-2 rounded hover:bg-[#7E6885] w-full flex justify-center items-center h-[38px]">
                        <Plus className="w-5 h-5"/>
                    </button>
                </div>
            </div>
            
            {products.length > 0 && (
                <ul className="space-y-2 max-h-40 overflow-y-auto">
                    {products.map((p, idx) => (
                        <li key={idx} className="flex justify-between items-center bg-white p-2 rounded shadow-sm border">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gray-100 rounded overflow-hidden border">
                                    {p.image ? <img src={p.image} className="w-full h-full object-cover"/> : <Image className="w-4 h-4 m-auto text-gray-400 mt-2"/>}
                                </div>
                                <div className="text-sm">
                                    <div className="font-semibold text-gray-800">{p.name}</div>
                                    <div className="text-xs text-gray-500">₹{p.price}</div>
                                </div>
                            </div>
                            <button type="button" onClick={() => handleRemoveProduct(idx)} className="text-red-500 p-1 hover:bg-red-50 rounded">
                                <Trash2 className="w-4 h-4"/>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>

        <div className="flex justify-between pt-4">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-500 hover:text-gray-700">Cancel</button>
          <button type="submit" className="px-6 py-2 bg-primary text-white rounded-md shadow hover:bg-[#7E6885] transition font-bold">Pay ₹{currentFee} & Register</button>
        </div>
      </form>
    </div>
  );
};

export default VendorRegistration;
