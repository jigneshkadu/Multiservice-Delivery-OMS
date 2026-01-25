
import React, { useState } from 'react';
import { User, Vendor, Order, Product } from '../types';
import { Calendar, Phone, MapPin, Clock, CheckCircle, XCircle, Package, Plus, Trash2, Upload, Edit3, X } from 'lucide-react';

interface VendorDashboardProps {
  vendor: Vendor;
  orders: Order[];
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
  onUpdateVendor?: (vendor: Vendor) => void;
}

const VendorDashboard: React.FC<VendorDashboardProps> = ({ vendor, orders, onUpdateStatus, onUpdateVendor }) => {
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'PRODUCTS'>('ORDERS');
  const [newProduct, setNewProduct] = useState<Product>({ name: '', price: 0, image: '' });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const pendingOrders = orders.filter(o => o.status === 'PENDING');
  const activeOrders = orders.filter(o => o.status === 'ACCEPTED' || o.status === 'PREPARING' || o.status === 'OUT_FOR_DELIVERY');
  const pastOrders = orders.filter(o => o.status === 'COMPLETED' || o.status === 'REJECTED');

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      if (!newProduct.name || newProduct.price <= 0) {
          alert("Valid name and price required.");
          return;
      }
      
      let updatedProducts = [...(vendor.products || [])];
      if (editingIndex !== null) {
          updatedProducts[editingIndex] = newProduct;
      } else {
          updatedProducts.push(newProduct);
      }
      
      if (onUpdateVendor) {
          onUpdateVendor({ ...vendor, products: updatedProducts });
      }
      setNewProduct({ name: '', price: 0, image: '' });
      setEditingIndex(null);
  };

  const startEdit = (index: number) => {
      setNewProduct(vendor.products![index]);
      setEditingIndex(index);
  };

  const cancelEdit = () => {
      setNewProduct({ name: '', price: 0, image: '' });
      setEditingIndex(null);
  };

  const handleDeleteProduct = (index: number) => {
      if (!window.confirm("Delete this product?")) return;
      const updatedProducts = (vendor.products || []).filter((_, i) => i !== index);
      if (onUpdateVendor) onUpdateVendor({ ...vendor, products: updatedProducts });
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-[#1a1c2e] p-8 rounded-2xl shadow-xl text-white">
        <div>
          <h1 className="text-2xl font-bold">Partner Console</h1>
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">{vendor.name}</p>
        </div>
        <div className="flex bg-white/10 p-1 rounded-xl mt-6 md:mt-0">
           <button 
             onClick={() => setActiveTab('ORDERS')}
             className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'ORDERS' ? 'bg-white text-primary shadow-lg' : 'text-white/60 hover:text-white'}`}
           >
             Live Orders
           </button>
           <button 
             onClick={() => setActiveTab('PRODUCTS')}
             className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'PRODUCTS' ? 'bg-white text-primary shadow-lg' : 'text-white/60 hover:text-white'}`}
           >
             <Package className="w-4 h-4"/> Inventory
           </button>
        </div>
      </div>

      {activeTab === 'PRODUCTS' && (
          <div className="grid lg:grid-cols-3 gap-8 animate-fade-in">
              <div className="bg-white p-6 rounded-2xl shadow-sm border h-fit border-gray-100">
                  <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center justify-between">
                      {editingIndex !== null ? 'Update Product' : 'Add New Item'}
                      {editingIndex !== null && <button onClick={cancelEdit} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4"/></button>}
                  </h3>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Display Name</label>
                          <input 
                             className="w-full bg-gray-50 border rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                             placeholder="e.g. 1kg Fresh Apple"
                             value={newProduct.name}
                             onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Unit Price (₹)</label>
                          <input 
                             type="number"
                             className="w-full bg-gray-50 border rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                             placeholder="0"
                             value={newProduct.price || ''}
                             onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                          />
                      </div>
                      <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Visual Asset</label>
                          <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:bg-gray-50 transition cursor-pointer overflow-hidden">
                              <input 
                                type="file" 
                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                accept="image/*"
                                onChange={handleProductImageUpload}
                              />
                              {newProduct.image ? (
                                  <img src={newProduct.image} className="h-40 mx-auto object-contain rounded-xl"/>
                              ) : (
                                  <div className="flex flex-col items-center text-gray-400">
                                      <Upload className="w-10 h-10 mb-2"/>
                                      <span className="text-xs font-bold uppercase tracking-wider">Upload Product Image</span>
                                  </div>
                              )}
                          </div>
                      </div>
                      <button 
                        onClick={handleAddProduct}
                        className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                          {editingIndex !== null ? <Edit3 className="w-4 h-4"/> : <Plus className="w-4 h-4"/>}
                          {editingIndex !== null ? 'Save Changes' : 'Add to Catalog'}
                      </button>
                  </div>
              </div>

              <div className="lg:col-span-2">
                  <h3 className="font-bold text-lg mb-6 text-gray-800 flex items-center gap-4">
                      Active Catalog
                      <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">{vendor.products?.length || 0} Listed Items</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {vendor.products?.map((p, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-2xl border shadow-sm flex gap-4 group hover:shadow-md transition-shadow">
                              <div className="w-24 h-24 bg-gray-100 rounded-xl shrink-0 overflow-hidden border">
                                  <img src={p.image || 'https://via.placeholder.com/80'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={p.name}/>
                              </div>
                              <div className="flex-1 flex flex-col justify-between py-1">
                                  <div>
                                      <h4 className="font-bold text-gray-800 text-sm leading-tight">{p.name}</h4>
                                      <p className="text-primary font-black mt-1">₹{p.price}</p>
                                  </div>
                                  <div className="flex justify-end gap-3">
                                      <button 
                                        onClick={() => startEdit(idx)}
                                        className="text-gray-400 hover:text-primary transition p-1.5 hover:bg-gray-50 rounded-lg"
                                        title="Edit Item"
                                      >
                                          <Edit3 className="w-4 h-4"/>
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteProduct(idx)}
                                        className="text-gray-400 hover:text-red-500 transition p-1.5 hover:bg-red-50 rounded-lg"
                                        title="Remove Item"
                                      >
                                          <Trash2 className="w-4 h-4"/>
                                      </button>
                                  </div>
                              </div>
                          </div>
                      ))}
                      {(!vendor.products || vendor.products.length === 0) && (
                          <div className="col-span-2 text-center py-20 text-gray-300 bg-white rounded-3xl border border-dashed font-bold uppercase tracking-widest text-xs">
                              Your catalog is empty. Start adding products.
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {activeTab === 'ORDERS' && (
        <div className="grid lg:grid-cols-3 gap-8 animate-fade-in">
            <div className="lg:col-span-2 space-y-6">
                <h2 className="font-bold text-xl text-gray-800 border-b pb-4 flex items-center justify-between">
                    Live Service Requests
                    <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full">{pendingOrders.length} New</span>
                </h2>
                
                {pendingOrders.length === 0 && (
                    <div className="bg-white py-20 rounded-3xl text-center text-gray-400 font-bold text-xs uppercase tracking-[0.2em] border border-dashed">
                        Zero incoming requests
                    </div>
                )}

                {pendingOrders.map(order => (
                    <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-l-8 border-l-yellow-400 p-6 hover:shadow-xl transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 leading-tight">{order.serviceRequested}</h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Order #{order.id}</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-y-4 gap-x-6 my-6 text-sm">
                            <div className="flex items-center gap-2 text-gray-700 font-medium">
                                <Phone className="w-4 h-4 text-primary opacity-40" /> {order.customerPhone}
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 font-medium">
                                <MapPin className="w-4 h-4 text-primary opacity-40" /> {order.address}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                            <button onClick={() => onUpdateStatus(order.id, 'REJECTED')} className="px-6 py-2.5 text-red-500 font-bold hover:bg-red-50 rounded-xl text-sm transition">Decline</button>
                            <button onClick={() => onUpdateStatus(order.id, 'ACCEPTED')} className="px-8 py-2.5 bg-primary text-white rounded-xl hover:shadow-lg text-sm font-bold shadow-md active:scale-95 transition">Accept Request</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Completed Jobs</h3>
                    <div className="space-y-4">
                        {pastOrders.map(order => (
                            <div key={order.id} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0">
                                <div className="min-w-0">
                                    <p className="font-bold text-sm text-gray-800 truncate">{order.serviceRequested}</p>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">{order.date.split('T')[0]}</p>
                                </div>
                                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 ml-2" />
                            </div>
                        ))}
                        {pastOrders.length === 0 && <p className="text-xs text-gray-400 italic">No historical records found.</p>}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
