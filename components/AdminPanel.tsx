
import React, { useState, useMemo } from 'react';
import { ShoppingCart, User, Truck, Clock, CheckCircle, ChevronRight, Phone, Bike, Package, ShieldCheck, Eye, XCircle, Plus, Trash2, Layers, Search, ChevronDown, ChevronUp, BarChart3, FileText, MousePointer2, Edit3, Image as ImageIcon, Users, Calendar, TrendingUp, Mail, MapPin } from 'lucide-react';
import { Category, Vendor, Banner, Order, Rider, UserRole, UserRequest, SiteVisit, Product, User as UserType, AdminRole } from '../types';

interface AdminPanelProps {
  currentUser: UserType | null;
  categories: Category[];
  vendors: Vendor[];
  banners: Banner[];
  orders: Order[];
  riders: Rider[];
  userRequests: UserRequest[];
  siteVisits: SiteVisit[];
  users: UserType[];
  vendorSales: any[];
  onAssignRider: (orderId: string, riderId: string) => void;
  onApproveVendor: (id: string) => void;
  onApproveRider: (id: string) => void;
  onRemoveVendor: (id: string) => void;
  onAddCategory: (cat: Category) => void;
  onRemoveCategory: (id: string) => void;
  onUpdateProduct: (vendorId: string, productId: string, productData: Partial<Product>) => Promise<boolean>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  currentUser, categories, vendors, banners, orders, riders, userRequests, siteVisits, users, vendorSales, onAssignRider, onApproveVendor, onApproveRider, onRemoveVendor, onAddCategory, onRemoveCategory, onUpdateProduct
}) => {
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'VENDORS' | 'RIDERS' | 'APPROVALS' | 'CATEGORIES' | 'REPORTS' | 'PRODUCTS' | 'USERS'>('ORDERS');
  const [reportPeriod, setReportPeriod] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('DAILY');
  const [userSearch, setUserSearch] = useState('');
  const [showAddCat, setShowAddCat] = useState(false);
  const [selectedUserForActivity, setSelectedUserForActivity] = useState<UserType | null>(null);
  const [parentCatId, setParentCatId] = useState<string | null>(null);
  const [newCat, setNewCat] = useState<Partial<Category>>({ name: '', description: '', themeColor: '#9C27B0' });
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
  
  // Product editing state
  const [selectedVendorIdForProducts, setSelectedVendorIdForProducts] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<{ vendorId: string, product: Product } | null>(null);
  const [editProductForm, setEditProductForm] = useState<Partial<Product>>({});

  const selectedVendorForProducts = vendors.find(v => v.id === selectedVendorIdForProducts);

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

  const canAccessTab = (tab: typeof activeTab) => {
    if (!currentUser) return false;
    if (currentUser.adminRole === AdminRole.SUPER_ADMIN || !currentUser.adminRole) return true;

    switch (currentUser.adminRole) {
      case AdminRole.VENDOR_MANAGEMENT:
        return ['VENDORS', 'PRODUCTS', 'APPROVALS', 'CATEGORIES'].includes(tab);
      case AdminRole.REPORT_ADMIN:
        return ['REPORTS', 'ORDERS'].includes(tab);
      case AdminRole.USER_MANAGEMENT:
        return ['USERS', 'ORDERS'].includes(tab);
      default:
        return false;
    }
  };

  const filteredTabs = (['ORDERS', 'CATEGORIES', 'VENDORS', 'RIDERS', 'USERS', 'PRODUCTS', 'REPORTS', 'APPROVALS'] as const).filter(canAccessTab);

  const filteredUsers = useMemo(() => {
    if (!userSearch) return users;
    const s = userSearch.toLowerCase();
    return users.filter(u => 
      u.name.toLowerCase().includes(s) || 
      u.email.toLowerCase().includes(s) || 
      u.phone?.includes(s)
    );
  }, [users, userSearch]);

  const reportStats = useMemo(() => {
    const now = new Date();
    let filterDate = new Date();
    
    if (reportPeriod === 'DAILY') filterDate.setDate(now.getDate() - 1);
    else if (reportPeriod === 'WEEKLY') filterDate.setDate(now.getDate() - 7);
    else if (reportPeriod === 'MONTHLY') filterDate.setMonth(now.getMonth() - 1);

    const filteredOrders = orders.filter(o => new Date(o.date) >= filterDate);
    const filteredRequests = userRequests.filter(r => new Date(r.date) >= filterDate);
    const filteredVisits = siteVisits.filter(v => new Date(v.date) >= filterDate);
    const revenue = filteredOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

    return {
      orders: filteredOrders.length,
      requests: filteredRequests.length,
      visits: filteredVisits.length,
      revenue
    };
  }, [orders, userRequests, siteVisits, reportPeriod]);

  const handleAddCat = () => {
    if (!newCat.name) return;
    onAddCategory({
      ...newCat,
      id: `cat_${Date.now()}`,
      parent_id: parentCatId || undefined
    });
    setNewCat({ name: '', description: '', themeColor: '#000000' });
    setShowAddCat(false);
    setParentCatId(null);
  };

  return (
    <div className="bg-white min-h-screen font-sans text-xs">
      <div className="bg-[#1a1c2e] text-white p-4 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
                <h1 className="text-lg font-bold flex items-center gap-2"><ShoppingCart className="w-6 h-6 text-yellow-400"/> Admin Management</h1>
                <p className="text-gray-400 text-[9px] mt-0.5 uppercase tracking-widest font-black opacity-50">Operational Infrastructure Center • {currentUser?.adminRole || 'Super Admin'}</p>
            </div>
          </div>
      </div>

      <div className="border-b flex overflow-x-auto no-scrollbar bg-gray-50 sticky top-0 z-10">
        {filteredTabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)} 
            className={`px-4 py-3 font-bold whitespace-nowrap flex items-center gap-2 transition-all text-[10px] uppercase tracking-wider ${activeTab === tab ? 'border-b-2 border-primary text-primary bg-white' : 'text-gray-500 hover:text-gray-800'}`}
          >
            {tab === 'ORDERS' && <ShoppingCart className="w-3 h-3"/>}
            {tab === 'CATEGORIES' && <Layers className="w-3 h-3"/>}
            {tab === 'VENDORS' && <User className="w-3 h-3"/>}
            {tab === 'RIDERS' && <Bike className="w-3 h-3"/>}
            {tab === 'USERS' && <Users className="w-3 h-3"/>}
            {tab === 'PRODUCTS' && <Package className="w-3 h-3"/>}
            {tab === 'REPORTS' && <BarChart3 className="w-3 h-3"/>}
            {tab === 'APPROVALS' && <ShieldCheck className="w-3 h-3"/>}
            {tab.replace('_', ' ')}
            {tab === 'APPROVALS' && pendingRiders.length > 0 && <span className="bg-orange-500 text-white text-[8px] px-1 py-0.5 rounded-full ml-1">{pendingRiders.length}</span>}
          </button>
        ))}
      </div>

      <div className="p-4">
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
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-600 font-bold uppercase mb-1">Fleet</p>
                    <p className="text-2xl font-black text-slate-800">{onlineRiders.length}</p>
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
                            <div className="bg-white border rounded-lg p-2 shadow-sm flex items-center gap-2 border-slate-100">
                               <div className="bg-slate-100 p-1.5 rounded-full"><Bike className="w-4 h-4 text-slate-600"/></div>
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

        {activeTab === 'REPORTS' && (
          <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border shadow-sm">
              <h2 className="text-sm font-bold flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary"/> Performance Analytics</h2>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                {(['DAILY', 'WEEKLY', 'MONTHLY'] as const).map(period => (
                  <button 
                    key={period}
                    onClick={() => setReportPeriod(period)}
                    className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${reportPeriod === period ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><ShoppingCart className="w-4 h-4"/></div>
                  <h3 className="font-bold text-gray-700 text-[10px] uppercase tracking-wider">Purchases</h3>
                </div>
                <p className="text-xl font-black text-gray-900">{reportStats.orders}</p>
                <p className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-widest font-bold">Total Orders</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600"><FileText className="w-4 h-4"/></div>
                  <h3 className="font-bold text-gray-700 text-[10px] uppercase tracking-wider">User Requests</h3>
                </div>
                <p className="text-xl font-black text-gray-900">{reportStats.requests}</p>
                <p className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-widest font-bold">Active Inquiries</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600"><MousePointer2 className="w-4 h-4"/></div>
                  <h3 className="font-bold text-gray-700 text-[10px] uppercase tracking-wider">Site Visits</h3>
                </div>
                <p className="text-xl font-black text-gray-900">{reportStats.visits}</p>
                <p className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-widest font-bold">Total Page Views</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600"><TrendingUp className="w-4 h-4"/></div>
                  <h3 className="font-bold text-gray-700 text-[10px] uppercase tracking-wider">Revenue</h3>
                </div>
                <p className="text-xl font-black text-gray-900">₹{reportStats.revenue.toLocaleString()}</p>
                <p className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-widest font-bold">Gross Volume</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
                <div className="p-3 bg-gray-50 border-b flex items-center justify-between">
                  <h3 className="font-bold text-gray-700 flex items-center gap-2 text-[10px] uppercase tracking-wider"><TrendingUp className="w-3 h-3"/> Vendor Performance</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[9px] font-black uppercase text-gray-400 tracking-widest border-b">
                        <th className="p-3">Vendor</th>
                        <th className="p-3">Sales</th>
                        <th className="p-3">Orders</th>
                        <th className="p-3">Contacts</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-[11px]">
                      {vendorSales.map(sale => (
                        <tr key={sale.vendorId} className="hover:bg-gray-50">
                          <td className="p-3 font-bold text-gray-800">{sale.vendorName}</td>
                          <td className="p-3 font-mono text-primary">₹{sale.totalSales.toLocaleString()}</td>
                          <td className="p-3">{sale.orderCount}</td>
                          <td className="p-3 text-gray-500">{sale.contactCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
                <div className="p-3 bg-gray-50 border-b flex items-center justify-between">
                  <h3 className="font-bold text-gray-700 flex items-center gap-2 text-[10px] uppercase tracking-wider"><FileText className="w-3 h-3"/> Recent User Requests</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[9px] font-black uppercase text-gray-400 tracking-widest border-b">
                        <th className="p-3">User</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-[11px]">
                      {userRequests.slice(0, 5).map(req => (
                        <tr key={req.id} className="hover:bg-gray-50">
                          <td className="p-3 font-bold text-gray-800">{req.userName}</td>
                          <td className="p-3"><span className="px-1.5 py-0.5 bg-gray-100 rounded text-[8px] font-bold">{req.type}</span></td>
                          <td className="p-3">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                              req.status === 'PENDING' ? 'bg-orange-100 text-orange-600' : 
                              req.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                            }`}>{req.status}</span>
                          </td>
                          <td className="p-3 text-gray-500">{new Date(req.date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'USERS' && (
          <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border shadow-sm">
              <div>
                <h2 className="text-sm font-bold flex items-center gap-2"><Users className="w-4 h-4 text-primary"/> User Management</h2>
                <p className="text-[10px] text-gray-500 font-medium">Manage platform users and view their activity history.</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                <input 
                  className="pl-9 pr-4 py-2 border rounded-xl text-[10px] outline-none focus:ring-2 focus:ring-primary/10 w-64" 
                  placeholder="Search users by name or email..." 
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[9px] font-black uppercase text-gray-400 tracking-widest border-b bg-gray-50">
                      <th className="p-4">User Details</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Joined</th>
                      <th className="p-4">Last Active</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-[11px]">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{u.name}</p>
                              <p className="text-[10px] text-gray-500 flex items-center gap-1"><Mail className="w-2.5 h-2.5"/> {u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                            u.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-600' :
                            u.role === UserRole.VENDOR ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td className="p-4 text-gray-500">{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'N/A'}</td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => setSelectedUserForActivity(u)}
                            className="text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ml-auto"
                          >
                            <Eye className="w-3 h-3"/> Activity
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {selectedUserForActivity && (
              <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[90vh]">
                  <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-black">
                        {selectedUserForActivity.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{selectedUserForActivity.name}</h3>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">{selectedUserForActivity.email}</p>
                      </div>
                    </div>
                    <button onClick={() => setSelectedUserForActivity(null)} className="p-2 hover:bg-white/10 rounded-full transition"><XCircle className="w-6 h-6"/></button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto no-scrollbar space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Purchase History</p>
                        <div className="space-y-3">
                          {selectedUserForActivity.purchases?.map(order => (
                            <div key={order.id} className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-100">
                              <div>
                                <p className="font-bold text-gray-800 text-[11px]">{order.vendorName}</p>
                                <p className="text-[9px] text-gray-400">{new Date(order.date).toLocaleDateString()}</p>
                              </div>
                              <p className="font-black text-primary text-[11px]">₹{order.total_amount}</p>
                            </div>
                          ))}
                          {(!selectedUserForActivity.purchases || selectedUserForActivity.purchases.length === 0) && (
                            <p className="text-[10px] text-gray-400 italic text-center py-4">No purchases yet</p>
                          )}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Visited Categories</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedUserForActivity.visitedCategories?.map(catId => {
                            const cat = categories.find(c => c.id === catId);
                            return (
                              <span key={catId} className="px-3 py-1.5 bg-white border border-slate-100 rounded-full text-[9px] font-bold text-slate-600">
                                {cat?.name || 'Unknown Category'}
                              </span>
                            );
                          })}
                          {(!selectedUserForActivity.visitedCategories || selectedUserForActivity.visitedCategories.length === 0) && (
                            <p className="text-[10px] text-gray-400 italic text-center py-4 w-full">No category visits logged</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'PRODUCTS' && (
          <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
            {!selectedVendorForProducts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendors.map(vendor => (
                  <div key={vendor.id} className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer group" onClick={() => setSelectedVendorIdForProducts(vendor.id)}>
                    <div className="h-32 bg-gray-100 relative">
                      <img src={vendor.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" alt={vendor.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        <h3 className="text-white font-bold">{vendor.name}</h3>
                      </div>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{vendor.products?.length || 0} Products</p>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <button onClick={() => setSelectedVendorIdForProducts(null)} className="flex items-center gap-2 text-primary font-bold hover:underline">
                    <ChevronRight className="w-4 h-4 rotate-180" /> Back to Vendors
                  </button>
                  <h2 className="text-xl font-bold text-gray-900">{selectedVendorForProducts.name} Inventory</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedVendorForProducts.products?.map(product => (
                    <div key={product.id} className="bg-white border rounded-2xl overflow-hidden shadow-sm flex flex-col">
                      <div className="aspect-video bg-gray-100 relative">
                        <img src={product.image || 'https://picsum.photos/400/300'} className="w-full h-full object-cover" alt={product.name} />
                        <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-lg text-xs font-bold">₹{product.price}</div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <h4 className="font-bold text-gray-800 mb-1">{product.name}</h4>
                        <button 
                          onClick={() => {
                            setEditingProduct({ vendorId: selectedVendorForProducts.id, product });
                            setEditProductForm(product);
                          }}
                          className="mt-auto w-full flex items-center justify-center gap-2 py-2 bg-gray-50 hover:bg-primary/10 text-primary rounded-xl font-bold text-sm transition"
                        >
                          <Edit3 className="w-4 h-4"/> Edit Product
                        </button>
                      </div>
                    </div>
                  ))}
                  {(!selectedVendorForProducts.products || selectedVendorForProducts.products.length === 0) && (
                    <div className="col-span-full py-20 text-center text-gray-400 font-bold uppercase tracking-widest border-2 border-dashed rounded-3xl">
                      No products found for this vendor
                    </div>
                  )}
                </div>
              </div>
            )}

            {editingProduct && (
              <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-slide-up">
                  <div className="bg-primary p-6 text-white flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold">Edit Product</h3>
                      <p className="text-xs opacity-80">Updating details for {editingProduct.product.name}</p>
                    </div>
                    <button onClick={() => setEditingProduct(null)} className="p-2 hover:bg-white/10 rounded-full transition"><XCircle className="w-6 h-6"/></button>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Name</label>
                      <input 
                        className="w-full border-2 border-gray-100 rounded-2xl p-4 outline-none focus:border-primary transition" 
                        value={editProductForm.name} 
                        onChange={e => setEditProductForm({...editProductForm, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price (₹)</label>
                      <input 
                        type="number"
                        className="w-full border-2 border-gray-100 rounded-2xl p-4 outline-none focus:border-primary transition" 
                        value={editProductForm.price} 
                        onChange={e => setEditProductForm({...editProductForm, price: Number(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><ImageIcon className="w-3 h-3"/> Image URL</label>
                      <input 
                        className="w-full border-2 border-gray-100 rounded-2xl p-4 outline-none focus:border-primary transition" 
                        value={editProductForm.image} 
                        onChange={e => setEditProductForm({...editProductForm, image: e.target.value})}
                      />
                    </div>
                    <button 
                      onClick={async () => {
                        const success = await onUpdateProduct(editingProduct.vendorId, editingProduct.product.id, editProductForm);
                        if (success) {
                          setEditingProduct(null);
                          alert("Product updated successfully!");
                        } else {
                          alert("Failed to update product.");
                        }
                      }}
                      className="w-full bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-95 transition-all"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
