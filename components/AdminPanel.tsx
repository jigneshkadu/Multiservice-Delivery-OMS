
import React, { useState } from 'react';
import { ShoppingCart, User, Truck, Clock, CheckCircle, ChevronRight, Phone, Bike, Package, ShieldCheck, Eye, XCircle, Plus, Trash2, Layers, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Category, Vendor, Banner, Order, Rider, UserRole } from '../types';

interface AdminPanelProps {
  categories: Category[];
  vendors: Vendor[];
  banners: Banner[];
  orders: Order[];
  riders: Rider[];
  onAssignRider: (orderId: string, riderId: string) => void;
  onApproveVendor: (id: string) => void;
  onApproveRider: (id: string) => void;
  onRemoveVendor: (id: string) => void;
  onAddCategory: (cat: Category) => void;
  onRemoveCategory: (id: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  categories, vendors, banners, orders, riders, onAssignRider, onApproveVendor, onApproveRider, onRemoveVendor, onAddCategory, onRemoveCategory
}) => {
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'VENDORS' | 'RIDERS' | 'APPROVALS' | 'CATEGORIES'>('ORDERS');
  const [showAddCat, setShowAddCat] = useState(false);
  const [parentCatId, setParentCatId] = useState<string | null>(null);
  const [newCat, setNewCat] = useState<Partial<Category>>({ name: '', description: '', themeColor: '#9C27B0' });
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());

  const onlineRiders = riders.filter(r => r.status === 'ONLINE' && r.isApproved);
  const pendingRiders = riders.filter(r => !r.isApproved);

  const toggleExpand = (id: string) => {
    const next = new Set(expandedCats);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedCats(next);
  };

  const handleOpenAddModal = (parentId: string | null = null) => {
    setParentCatId(parentId);
    setShowAddCat(true);
  };

  const handleAddCat = () => {
    if (!newCat.name) return;
    
    const category: Category = {
      id: 'cat_' + Date.now(),
      name: newCat.name,
      description: newCat.description || '',
      themeColor: newCat.themeColor || '#9C27B0',
      subCategories: [],
      parent_id: parentCatId || undefined
    };

    if (parentCatId) {
        // Logic handled in App.tsx by onAddCategory usually, but for mock we need to find parent
        // For simplicity we just pass the new category with parent_id set
        onAddCategory(category);
    } else {
        onAddCategory(category);
    }
    
    setNewCat({ name: '', description: '', themeColor: '#9C27B0' });
    setShowAddCat(false);
    setParentCatId(null);
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="bg-[#1a1c2e] text-white p-6 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-3"><ShoppingCart className="w-8 h-8 text-yellow-400"/> Admin Management</h1>
                <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest font-black opacity-50">Operational Infrastructure Center</p>
            </div>
          </div>
      </div>

      <div className="border-b flex overflow-x-auto no-scrollbar bg-gray-50 sticky top-0 z-10">
        <button onClick={() => setActiveTab('ORDERS')} className={`px-6 py-4 font-bold whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === 'ORDERS' ? 'border-b-4 border-primary text-primary bg-white' : 'text-gray-500 hover:text-gray-800'}`}>
            <ShoppingCart className="w-4 h-4"/> Global Orders
        </button>
        <button onClick={() => setActiveTab('CATEGORIES')} className={`px-6 py-4 font-bold whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === 'CATEGORIES' ? 'border-b-4 border-primary text-primary bg-white' : 'text-gray-500 hover:text-gray-800'}`}>
            <Layers className="w-4 h-4"/> Categories
        </button>
        <button onClick={() => setActiveTab('VENDORS')} className={`px-6 py-4 font-bold whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === 'VENDORS' ? 'border-b-4 border-primary text-primary bg-white' : 'text-gray-500 hover:text-gray-800'}`}>
            <User className="w-4 h-4"/> Merchants
        </button>
        <button onClick={() => setActiveTab('RIDERS')} className={`px-6 py-4 font-bold whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === 'RIDERS' ? 'border-b-4 border-primary text-primary bg-white' : 'text-gray-500 hover:text-gray-800'}`}>
            <Bike className="w-4 h-4"/> Logistics
        </button>
        <button onClick={() => setActiveTab('APPROVALS')} className={`px-6 py-4 font-bold whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === 'APPROVALS' ? 'border-b-4 border-primary text-primary bg-white' : 'text-gray-500 hover:text-gray-800'}`}>
            <ShieldCheck className="w-4 h-4 text-orange-500"/> Approvals {pendingRiders.length > 0 && <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">{pendingRiders.length}</span>}
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'CATEGORIES' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
             <div className="flex justify-between items-center mb-8">
                 <div>
                    <h2 className="text-2xl font-bold">Category Infrastructure</h2>
                    <p className="text-sm text-gray-500">Manage your service hierarchy and marketplace structure.</p>
                 </div>
                 <button onClick={() => handleOpenAddModal(null)} className="bg-primary text-white px-5 py-2 rounded-lg font-bold text-sm shadow-lg flex items-center gap-2 active:scale-95 transition-transform">
                    <Plus className="w-4 h-4"/> New Root Category
                 </button>
             </div>

             <div className="space-y-4">
                {categories.map(cat => (
                    <div key={cat.id} className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                        <div className="p-5 flex items-center justify-between hover:bg-gray-50 transition">
                            <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => toggleExpand(cat.id)}>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${cat.themeColor}20` }}>
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.themeColor }}></div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{cat.name}</h3>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{cat.subCategories?.length || 0} Subcategories</p>
                                </div>
                                {cat.subCategories && cat.subCategories.length > 0 && (
                                    expandedCats.has(cat.id) ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleOpenAddModal(cat.id)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition" title="Add Subcategory">
                                    <Plus className="w-5 h-5"/>
                                </button>
                                <button onClick={() => onRemoveCategory(cat.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete Category">
                                    <Trash2 className="w-5 h-5"/>
                                </button>
                            </div>
                        </div>

                        {expandedCats.has(cat.id) && cat.subCategories && cat.subCategories.length > 0 && (
                            <div className="bg-gray-50/50 border-t p-4 space-y-2">
                                {cat.subCategories.map(sub => (
                                    <div key={sub.id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 ml-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                            <span className="text-sm font-semibold text-gray-700">{sub.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                             <button onClick={() => onRemoveCategory(sub.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                                                <Trash2 className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
             </div>

             {showAddCat && (
                 <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-slide-up">
                        <div className="bg-gray-900 p-4 text-white flex justify-between items-center">
                            <div>
                                <h3 className="font-bold">{parentCatId ? 'Add Subcategory' : 'Add New Category'}</h3>
                                {parentCatId && <p className="text-[10px] text-gray-400">Nesting under: {categories.find(c => c.id === parentCatId)?.name}</p>}
                            </div>
                            <button onClick={() => setShowAddCat(false)}><XCircle className="w-6 h-6"/></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-black text-gray-400 uppercase mb-1">Display Name</label>
                                <input className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20" value={newCat.name} onChange={e => setNewCat({...newCat, name: e.target.value})} placeholder="e.g. Pet Care" />
                            </div>
                            <div>
                                <label className="text-xs font-black text-gray-400 uppercase mb-1">Brief Description</label>
                                <textarea className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20" value={newCat.description} onChange={e => setNewCat({...newCat, description: e.target.value})} placeholder="Describe the category..." />
                            </div>
                            {!parentCatId && (
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase mb-1">Theme Color</label>
                                    <input type="color" className="w-full h-10 rounded-lg cursor-pointer" value={newCat.themeColor} onChange={e => setNewCat({...newCat, themeColor: e.target.value})} />
                                </div>
                            )}
                            <button onClick={handleAddCat} className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg mt-4 active:scale-95 transition-transform">Create Category</button>
                        </div>
                    </div>
                 </div>
             )}
          </div>
        )}

        {activeTab === 'ORDERS' && (
          <div className="space-y-6 animate-fade-in">
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                 <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-xs text-blue-600 font-bold uppercase mb-1">Live Txns</p>
                    <p className="text-2xl font-black text-blue-800">{orders.length}</p>
                 </div>
                 <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <p className="text-xs text-orange-600 font-bold uppercase mb-1">Unassigned</p>
                    <p className="text-2xl font-black text-orange-800">{orders.filter(o => !o.riderId).length}</p>
                 </div>
                 <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <p className="text-xs text-green-600 font-bold uppercase mb-1">Fleet</p>
                    <p className="text-2xl font-black text-green-800">{onlineRiders.length}</p>
                 </div>
                 <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <p className="text-xs text-purple-600 font-bold uppercase mb-1">Partners</p>
                    <p className="text-2xl font-black text-purple-800">{vendors.length}</p>
                 </div>
             </div>

             <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-gray-100 text-[10px] font-black uppercase text-gray-500 tracking-widest border-b">
                     <th className="p-4">TX ID</th>
                     <th className="p-4">Customer</th>
                     <th className="p-4">Merchant</th>
                     <th className="p-4">Logistics</th>
                     <th className="p-4 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y">
                   {orders.map(order => (
                     <tr key={order.id} className="hover:bg-gray-50 transition">
                       <td className="p-4 align-top">
                          <span className="font-mono font-bold text-gray-900 text-sm">#{order.id}</span>
                          <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-1 font-bold">
                             <Clock className="w-3 h-3"/> {new Date(order.date).toLocaleDateString()}
                          </div>
                       </td>
                       <td className="p-4 align-top">
                          <p className="font-bold text-sm text-gray-800">{order.customerName}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3"/> {order.customerPhone}</p>
                       </td>
                       <td className="p-4 align-top">
                          <p className="font-bold text-sm text-primary">{order.vendorName || 'Dahanu Merchant'}</p>
                       </td>
                       <td className="p-4 align-top">
                          {order.riderId ? (
                            <div className="bg-white border rounded-lg p-2 shadow-sm flex items-center gap-2 border-green-100">
                               <div className="bg-green-100 p-1.5 rounded-full"><Bike className="w-4 h-4 text-green-600"/></div>
                               <div className="min-w-0">
                                  <p className="text-xs font-bold text-gray-800 truncate">{order.riderName}</p>
                                  <p className="text-[10px] text-gray-500">{order.riderPhone}</p>
                               </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                               <select 
                                 className="w-full text-xs border rounded-md p-2 bg-gray-50 focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                                 onChange={(e) => {
                                    if(e.target.value) onAssignRider(order.id, e.target.value);
                                 }}
                                 defaultValue=""
                               >
                                  <option value="" disabled>Dispatch to Rider</option>
                                  {onlineRiders.map(r => <option key={r.id} value={r.id}>{r.name} - {r.vehicleType}</option>)}
                               </select>
                            </div>
                          )}
                       </td>
                       <td className="p-4 align-top text-right">
                          <button className="text-gray-400 hover:text-primary transition p-2 hover:bg-gray-100 rounded-full"><ChevronRight className="w-5 h-5"/></button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
