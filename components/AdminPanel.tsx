
import React, { useState } from 'react';
import { ShoppingCart, User, Truck, Clock, CheckCircle, ChevronRight, Phone, Bike, Package } from 'lucide-react';
import { Category, Vendor, Banner, Order, Rider, UserRole } from '../types';

interface AdminPanelProps {
  categories: Category[];
  vendors: Vendor[];
  banners: Banner[];
  orders: Order[];
  riders: Rider[];
  onAssignRider: (orderId: string, riderId: string) => void;
  onApproveVendor: (id: string) => void;
  onRemoveVendor: (id: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  categories, vendors, banners, orders, riders, onAssignRider, onApproveVendor, onRemoveVendor 
}) => {
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'VENDORS' | 'RIDERS' | 'CATS'>('ORDERS');

  const onlineRiders = riders.filter(r => r.status === 'ONLINE');

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#1a1c2e] text-white p-6 shadow-lg">
          <h1 className="text-2xl font-bold flex items-center gap-3"><ShoppingCart className="w-8 h-8 text-yellow-400"/> Order Management System</h1>
          <p className="text-gray-400 text-sm mt-1">Global monitoring of Dahanu services & logistics</p>
      </div>

      <div className="border-b flex overflow-x-auto no-scrollbar bg-gray-50">
        <button onClick={() => setActiveTab('ORDERS')} className={`px-6 py-4 font-bold whitespace-nowrap flex items-center gap-2 ${activeTab === 'ORDERS' ? 'border-b-4 border-primary text-primary bg-white' : 'text-gray-500'}`}>
            <ShoppingCart className="w-4 h-4"/> Orders ({orders.length})
        </button>
        <button onClick={() => setActiveTab('VENDORS')} className={`px-6 py-4 font-bold whitespace-nowrap flex items-center gap-2 ${activeTab === 'VENDORS' ? 'border-b-4 border-primary text-primary bg-white' : 'text-gray-500'}`}>
            <User className="w-4 h-4"/> Vendors ({vendors.length})
        </button>
        <button onClick={() => setActiveTab('RIDERS')} className={`px-6 py-4 font-bold whitespace-nowrap flex items-center gap-2 ${activeTab === 'RIDERS' ? 'border-b-4 border-primary text-primary bg-white' : 'text-gray-500'}`}>
            <Bike className="w-4 h-4"/> Logistics ({riders.length})
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'ORDERS' && (
          <div className="space-y-6 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                 <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-xs text-blue-600 font-bold uppercase mb-1">Total Orders</p>
                    <p className="text-2xl font-black text-blue-800">{orders.length}</p>
                 </div>
                 <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <p className="text-xs text-orange-600 font-bold uppercase mb-1">Unassigned</p>
                    <p className="text-2xl font-black text-orange-800">{orders.filter(o => !o.riderId).length}</p>
                 </div>
                 <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <p className="text-xs text-green-600 font-bold uppercase mb-1">Completed</p>
                    <p className="text-2xl font-black text-green-800">{orders.filter(o => o.status === 'COMPLETED').length}</p>
                 </div>
                 <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <p className="text-xs text-purple-600 font-bold uppercase mb-1">Active Riders</p>
                    <p className="text-2xl font-black text-purple-800">{onlineRiders.length}</p>
                 </div>
             </div>

             <div className="overflow-x-auto rounded-xl border">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-gray-100 text-[11px] font-black uppercase text-gray-500 tracking-widest border-b">
                     <th className="p-4">Order ID</th>
                     <th className="p-4">Details</th>
                     <th className="p-4">Vendor</th>
                     <th className="p-4">Logistics</th>
                     <th className="p-4 text-right">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y">
                   {orders.map(order => (
                     <tr key={order.id} className="hover:bg-gray-50 transition">
                       <td className="p-4 align-top">
                          <span className="font-mono font-bold text-gray-900">#{order.id}</span>
                          <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                             <Clock className="w-3 h-3"/> {new Date(order.date).toLocaleDateString()}
                          </div>
                       </td>
                       <td className="p-4 align-top">
                          <p className="font-bold text-sm text-gray-800">{order.customerName}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3"/> {order.customerPhone}</p>
                          <div className="mt-2 flex items-center gap-2">
                             <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                {order.status}
                             </span>
                          </div>
                       </td>
                       <td className="p-4 align-top">
                          <p className="font-bold text-sm text-primary">{order.vendorName || 'General Store'}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[150px]">{order.address}</p>
                       </td>
                       <td className="p-4 align-top">
                          {order.riderId ? (
                            <div className="bg-white border rounded-lg p-2 shadow-sm flex items-center gap-2">
                               <div className="bg-green-100 p-1.5 rounded-full"><Bike className="w-4 h-4 text-green-600"/></div>
                               <div>
                                  <p className="text-xs font-bold text-gray-800">{order.riderName}</p>
                                  <p className="text-[10px] text-gray-500">{order.riderPhone}</p>
                               </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                               <select 
                                 className="w-full text-xs border rounded-md p-2 bg-gray-50 focus:ring-1 focus:ring-primary outline-none"
                                 onChange={(e) => {
                                    if(e.target.value) onAssignRider(order.id, e.target.value);
                                 }}
                                 defaultValue=""
                               >
                                  <option value="" disabled>Select Online Rider</option>
                                  {onlineRiders.map(r => <option key={r.id} value={r.id}>{r.name} ({r.vehicleType})</option>)}
                               </select>
                               {onlineRiders.length === 0 && <p className="text-[10px] text-red-500 italic">No riders online</p>}
                            </div>
                          )}
                       </td>
                       <td className="p-4 align-top text-right">
                          <button className="text-gray-400 hover:text-primary transition"><ChevronRight className="w-5 h-5"/></button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}
        
        {activeTab === 'VENDORS' && (
           <div className="space-y-4">
              <h2 className="font-bold text-xl mb-4">Vendor Verification Queue</h2>
              {vendors.map(v => (
                 <div key={v.id} className="bg-white border p-4 rounded-xl flex justify-between items-center">
                    <div>
                       <h3 className="font-bold">{v.name}</h3>
                       <p className="text-xs text-gray-500">{v.location.address}</p>
                    </div>
                    {!v.isApproved && (
                       <button onClick={() => onApproveVendor(v.id)} className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow hover:bg-green-700 transition">Approve</button>
                    )}
                 </div>
              ))}
           </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
