
import React, { useState } from 'react';
import { User, Vendor, Order, Product } from '../types';
import { Calendar, Phone, MapPin, Clock, CheckCircle, XCircle, Package, Plus, Trash2, Upload } from 'lucide-react';

interface VendorDashboardProps {
  vendor: Vendor; // The logged in vendor profile
  orders: Order[];
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
  onUpdateVendor?: (vendor: Vendor) => void; // Callback to update vendor state in App
}

const VendorDashboard: React.FC<VendorDashboardProps> = ({ vendor, orders, onUpdateStatus, onUpdateVendor }) => {
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'PRODUCTS'>('ORDERS');
  
  // Product Management State
  const [newProduct, setNewProduct] = useState<Product>({ name: '', price: 0, image: '' });

  const pendingOrders = orders.filter(o => o.status === 'PENDING');
  const activeOrders = orders.filter(o => o.status === 'ACCEPTED');
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
          alert("Please enter a valid product name and price");
          return;
      }
      
      const updatedProducts = [...(vendor.products || []), newProduct];
      const updatedVendor = { ...vendor, products: updatedProducts };
      
      if (onUpdateVendor) {
          onUpdateVendor(updatedVendor);
      }
      setNewProduct({ name: '', price: 0, image: '' });
  };

  const handleDeleteProduct = (index: number) => {
      if (!window.confirm("Are you sure you want to remove this product?")) return;
      
      const updatedProducts = [...(vendor.products || [])];
      updatedProducts.splice(index, 1);
      const updatedVendor = { ...vendor, products: updatedProducts };

      if (onUpdateVendor) {
          onUpdateVendor(updatedVendor);
      }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white p-6 rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Vendor Dashboard</h1>
          <p className="text-gray-600">Welcome back, <span className="font-semibold text-primary">{vendor.name}</span></p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
           <button 
             onClick={() => setActiveTab('ORDERS')}
             className={`px-4 py-2 rounded-lg font-bold transition ${activeTab === 'ORDERS' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
           >
             Orders
           </button>
           <button 
             onClick={() => setActiveTab('PRODUCTS')}
             className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-2 ${activeTab === 'PRODUCTS' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
           >
             <Package className="w-4 h-4"/> Products
           </button>
        </div>
      </div>

      {activeTab === 'PRODUCTS' && (
          <div className="grid lg:grid-cols-3 gap-8 animate-fade-in">
              {/* Add Product Form */}
              <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
                  <h3 className="font-bold text-lg mb-4 text-gray-800">Add New Product</h3>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                          <input 
                             className="w-full border p-2 rounded focus:border-primary outline-none" 
                             placeholder="e.g. 1kg Apple"
                             value={newProduct.name}
                             onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                          <input 
                             type="number"
                             className="w-full border p-2 rounded focus:border-primary outline-none" 
                             placeholder="0"
                             value={newProduct.price || ''}
                             onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition cursor-pointer">
                              <input 
                                type="file" 
                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                accept="image/*"
                                onChange={handleProductImageUpload}
                              />
                              {newProduct.image ? (
                                  <img src={newProduct.image} className="h-32 mx-auto object-contain rounded"/>
                              ) : (
                                  <div className="flex flex-col items-center text-gray-400">
                                      <Upload className="w-8 h-8 mb-2"/>
                                      <span className="text-xs">Click to upload</span>
                                  </div>
                              )}
                          </div>
                      </div>
                      <button 
                        onClick={handleAddProduct}
                        className="w-full bg-green-600 text-white py-2 rounded font-bold shadow hover:bg-green-700 transition flex items-center justify-center gap-2"
                      >
                          <Plus className="w-4 h-4"/> Add Product
                      </button>
                  </div>
              </div>

              {/* Product List */}
              <div className="lg:col-span-2">
                  <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center justify-between">
                      Current Inventory
                      <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">{vendor.products?.length || 0} Items</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {vendor.products?.map((p, idx) => (
                          <div key={idx} className="bg-white p-3 rounded-lg border shadow-sm flex gap-4 group">
                              <div className="w-20 h-20 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                                  <img src={p.image || 'https://via.placeholder.com/80'} className="w-full h-full object-cover" alt={p.name}/>
                              </div>
                              <div className="flex-1 flex flex-col justify-between">
                                  <div>
                                      <h4 className="font-bold text-gray-800">{p.name}</h4>
                                      <p className="text-primary font-bold">₹{p.price}</p>
                                  </div>
                                  <div className="flex justify-end">
                                      <button 
                                        onClick={() => handleDeleteProduct(idx)}
                                        className="text-red-500 text-xs flex items-center gap-1 hover:bg-red-50 px-2 py-1 rounded transition"
                                      >
                                          <Trash2 className="w-3 h-3"/> Remove
                                      </button>
                                  </div>
                              </div>
                          </div>
                      ))}
                      {(!vendor.products || vendor.products.length === 0) && (
                          <div className="col-span-2 text-center py-12 text-gray-400 bg-white rounded border border-dashed">
                              No products found. Add your first product.
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {activeTab === 'ORDERS' && (
        <div className="grid lg:grid-cols-3 gap-8 animate-fade-in">
            {/* New Requests */}
            <div className="lg:col-span-2 space-y-6">
            <h2 className="font-bold text-xl text-gray-800 border-b pb-2">Recent Service Requests</h2>
            
            {pendingOrders.length === 0 && (
                <div className="bg-white p-8 rounded text-center text-gray-400">No new requests at the moment.</div>
            )}

            {pendingOrders.map(order => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm border border-l-4 border-l-yellow-400 p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-bold text-lg">{order.serviceRequested}</h3>
                        <p className="text-sm text-gray-500">Req ID: #{order.id}</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">PENDING</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                        <UserIcon className="w-4 h-4 text-gray-400" /> {order.customerName}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="w-4 h-4 text-gray-400" /> {order.customerPhone}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" /> {order.date}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-4 h-4 text-gray-400" /> {order.address}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t">
                    <button 
                    onClick={() => onUpdateStatus(order.id, 'REJECTED')}
                    className="px-4 py-2 border border-red-200 text-red-600 rounded hover:bg-red-50 text-sm font-medium"
                    >
                    Reject
                    </button>
                    <button 
                    onClick={() => onUpdateStatus(order.id, 'ACCEPTED')}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-[#7E6885] text-sm font-bold shadow"
                    >
                    Accept Request
                    </button>
                </div>
                </div>
            ))}

            <h2 className="font-bold text-xl text-gray-800 border-b pb-2 pt-8">Active Jobs</h2>
            {activeOrders.map(order => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm border border-l-4 border-l-green-500 p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-bold text-lg">{order.serviceRequested}</h3>
                        <p className="text-sm text-gray-500">For: {order.customerName}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">IN PROGRESS</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-600 flex items-center gap-2"><Clock className="w-4 h-4"/> Scheduled: {order.date}</div>
                    <button onClick={() => onUpdateStatus(order.id, 'COMPLETED')} className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-700">Mark Completed</button>
                </div>
                </div>
            ))}
            </div>

            {/* Sidebar - History */}
            <div className="bg-white p-4 rounded-lg shadow-sm h-fit">
            <h3 className="font-bold text-gray-700 mb-4">Order History</h3>
            <div className="space-y-4">
                {pastOrders.map(order => (
                <div key={order.id} className="border-b pb-3 last:border-0">
                    <div className="flex justify-between mb-1">
                        <span className="font-medium text-sm">{order.serviceRequested}</span>
                        {order.status === 'COMPLETED' ? 
                            <CheckCircle className="w-4 h-4 text-green-500"/> : 
                            <XCircle className="w-4 h-4 text-red-500"/>
                        }
                    </div>
                    <div className="text-xs text-gray-500 flex justify-between">
                        <span>{order.date}</span>
                        <span className={order.status === 'COMPLETED' ? 'text-green-600' : 'text-red-500'}>{order.status}</span>
                    </div>
                </div>
                ))}
                {pastOrders.length === 0 && <div className="text-sm text-gray-400 italic">No history yet.</div>}
            </div>
            </div>
        </div>
      )}
    </div>
  );
};

const UserIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

export default VendorDashboard;
