
import React, { useState } from 'react';
import { ShoppingCart, User, Truck, Clock, CheckCircle, ChevronRight, Phone, Bike, Package, ShieldCheck, Eye, XCircle } from 'lucide-react';
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
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  categories, vendors, banners, orders, riders, onAssignRider, onApproveVendor, onApproveRider, onRemoveVendor 
}) => {
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'VENDORS' | 'RIDERS' | 'APPROVALS'>('ORDERS');
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);

  const onlineRiders = riders.filter(r => r.status === 'ONLINE' && r.isApproved);
  const pendingRiders = riders.filter(r => !r.isApproved);

  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="bg-[#1a1c2e] text-white p-6 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-3"><ShoppingCart className="w-8 h-8 text-yellow-400"/> Admin Portal</h1>
                <p className="text-gray-400 text-sm mt-1">Management Console for Dahanu Multi-Service Platform</p>
            </div>
            <div className="flex gap-4">
                <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-bold">System Online</span>
                </div>
            </div>
          </div>
      </div>

      <div className="border-b flex overflow-x-auto no-scrollbar bg-gray-50 sticky top-0 z-10">
        <button onClick={() => setActiveTab('ORDERS')} className={`px-6 py-4 font-bold whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === 'ORDERS' ? 'border-b-4 border-primary text-primary bg-white' : 'text-gray-500 hover:text-gray-800'}`}>
            <ShoppingCart className="w-4 h-4"/> Global Orders
        </button>
        <button onClick={() => setActiveTab('VENDORS')} className={`px-6 py-4 font-bold whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === 'VENDORS' ? 'border-b-4 border-primary text-primary bg-white' : 'text-gray-500 hover:text-gray-800'}`}>
            <User className="w-4 h-4"/> Partners
        </button>
        <button onClick={() => setActiveTab('RIDERS')} className={`px-6 py-4 font-bold whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === 'RIDERS' ? 'border-b-4 border-primary text-primary bg-white' : 'text-gray-500 hover:text-gray-800'}`}>
            <Bike className="w-4 h-4"/> Logistics
        </button>
        <button onClick={() => setActiveTab('APPROVALS')} className={`px-6 py-4 font-bold whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === 'APPROVALS' ? 'border-b-4 border-primary text-primary bg-white' : 'text-gray-500 hover:text-gray-800'}`}>
            <ShieldCheck className="w-4 h-4 text-orange-500"/> Verification Queue {pendingRiders.length > 0 && <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">{pendingRiders.length}</span>}
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'ORDERS' && (
          <div className="space-y-6 animate-fade-in">
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                 <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-xs text-blue-600 font-bold uppercase mb-1">Live Transactions</p>
                    <p className="text-2xl font-black text-blue-800">{orders.length}</p>
                 </div>
                 <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <p className="text-xs text-orange-600 font-bold uppercase mb-1">Rider Unassigned</p>
                    <p className="text-2xl font-black text-orange-800">{orders.filter(o => !o.riderId).length}</p>
                 </div>
                 <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <p className="text-xs text-green-600 font-bold uppercase mb-1">Dispatched</p>
                    <p className="text-2xl font-black text-green-800">{orders.filter(o => o.status === 'COMPLETED').length}</p>
                 </div>
                 <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <p className="text-xs text-purple-600 font-bold uppercase mb-1">Available Fleet</p>
                    <p className="text-2xl font-black text-purple-800">{onlineRiders.length}</p>
                 </div>
             </div>

             <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-gray-100 text-[10px] font-black uppercase text-gray-500 tracking-widest border-b">
                     <th className="p-4">Transaction ID</th>
                     <th className="p-4">Customer Details</th>
                     <th className="p-4">Merchant</th>
                     <th className="p-4">Logistics Assignment</th>
                     <th className="p-4 text-right">Action</th>
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
                          <div className="mt-2 flex items-center gap-2">
                             <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase border ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-100 text-orange-700 border-orange-200'}`}>
                                {order.status}
                             </span>
                          </div>
                       </td>
                       <td className="p-4 align-top">
                          <p className="font-bold text-sm text-primary">{order.vendorName || 'Dahanu Merchant'}</p>
                          <p className="text-[10px] text-gray-500 truncate max-w-[150px] italic">{order.address}</p>
                       </td>
                       <td className="p-4 align-top">
                          {order.riderId ? (
                            <div className="bg-white border rounded-lg p-2 shadow-sm flex items-center gap-2 border-green-100">
                               <div className="bg-green-100 p-1.5 rounded-full"><Bike className="w-4 h-4 text-green-600"/></div>
                               <div>
                                  <p className="text-xs font-bold text-gray-800">{order.riderName}</p>
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
                                  <option value="" disabled>Dispatch Order to Rider</option>
                                  {onlineRiders.map(r => <option key={r.id} value={r.id}>{r.name} - {r.vehicleType} ({r.vehicleName})</option>)}
                               </select>
                               {onlineRiders.length === 0 && <p className="text-[9px] text-red-500 font-bold italic">No active riders online</p>}
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

        {activeTab === 'APPROVALS' && (
            <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Verification Requests</h2>
                        <p className="text-sm text-gray-500">Manual document verification for new delivery partners</p>
                    </div>
                </div>

                {pendingRiders.length === 0 ? (
                    <div className="bg-gray-50 border-2 border-dashed rounded-2xl py-20 flex flex-col items-center justify-center text-gray-400">
                        <CheckCircle className="w-12 h-12 mb-4 opacity-20"/>
                        <p className="font-bold">No pending verifications</p>
                        <p className="text-xs">All enrollment requests have been processed.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pendingRiders.map(rider => (
                            <div key={rider.id} className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-primary text-xl">
                                                {rider.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{rider.name}</h3>
                                                <p className="text-xs text-gray-500">{rider.phone}</p>
                                            </div>
                                        </div>
                                        <div className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">Pending Proof</div>
                                    </div>
                                    
                                    <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">Vehicle</span>
                                            <span className="font-bold text-gray-800">{rider.vehicleType} • {rider.vehicleName}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">Number Plate</span>
                                            <span className="font-bold text-gray-800 uppercase">{rider.vehicleNumber}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">License ID</span>
                                            <span className="font-bold text-gray-800 uppercase">{rider.licenseNumber}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mb-6">
                                        <button onClick={() => setSelectedRider(rider)} className="flex-1 border border-gray-200 rounded-lg py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 transition flex items-center justify-center gap-2">
                                            <Eye className="w-4 h-4"/> View Proofs
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button className="flex-1 bg-red-50 text-red-600 font-bold py-2.5 rounded-xl text-sm border border-red-100 hover:bg-red-100 transition">Reject</button>
                                    <button onClick={() => onApproveRider(rider.id)} className="flex-2 bg-green-600 text-white font-bold py-2.5 px-8 rounded-xl text-sm shadow-lg hover:bg-green-700 transition">Approve Rider</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}
        
        {activeTab === 'RIDERS' && (
             <div className="space-y-6 animate-fade-in">
                <h2 className="font-bold text-xl mb-4">Active Delivery Fleet</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {riders.filter(r => r.isApproved).map(r => (
                        <div key={r.id} className="bg-white border rounded-xl p-4 flex items-center gap-4">
                            <div className={`w-3 h-3 rounded-full ${r.status === 'ONLINE' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <div className="flex-1">
                                <p className="font-bold text-sm">{r.name}</p>
                                <p className="text-[10px] text-gray-500">{r.vehicleName} ({r.vehicleType})</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-primary">{r.status}</p>
                                <p className="text-[10px] text-gray-400">Rating: {r.rating}</p>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
        )}

        {/* --- Proof Modal --- */}
        {selectedRider && (
            <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl">
                    <div className="bg-gray-900 p-4 text-white flex justify-between items-center">
                        <h3 className="font-bold">Document Verification: {selectedRider.name}</h3>
                        <button onClick={() => setSelectedRider(null)}><XCircle className="w-6 h-6"/></button>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-gray-500 uppercase">Driving License</p>
                            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border flex items-center justify-center">
                                {selectedRider.licenseProofUrl ? <img src={selectedRider.licenseProofUrl} className="w-full h-full object-contain" /> : <p className="text-gray-400 italic text-xs">No image provided</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-gray-500 uppercase">Address Proof (Aadhar)</p>
                            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border flex items-center justify-center">
                                {selectedRider.addressProofUrl ? <img src={selectedRider.addressProofUrl} className="w-full h-full object-contain" /> : <p className="text-gray-400 italic text-xs">No image provided</p>}
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-gray-50 border-t flex justify-end">
                        <button onClick={() => setSelectedRider(null)} className="bg-gray-900 text-white px-8 py-2 rounded-lg font-bold">Done</button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
