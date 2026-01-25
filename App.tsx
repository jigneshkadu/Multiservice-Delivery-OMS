
import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, UserRole, Vendor, Category, Banner, Order, Rider, Product
} from './types';
import { 
  fetchCategories, fetchVendors, fetchBanners, createOrder, registerRider, fetchRiders, fetchAllOrders, assignRiderToOrder
} from './services/api';
import Header from './components/Header';
import Footer from './components/Footer';
import BannerCarousel from './components/BannerCarousel';
import AuthModal from './components/AuthModal';
import VendorDashboard from './components/VendorDashboard';
import RiderRegistration from './components/RiderRegistration';
import RiderDashboard from './components/RiderDashboard';
import CategoryView from './components/CategoryView';
import BottomNav from './components/BottomNav';
import SideMenu from './components/SideMenu';
import FeaturedService from './components/FeaturedService';
import DeliveryOrderModal from './components/DeliveryOrderModal';
import ContactModal from './components/ContactModal';
import MapVisualizer from './components/MapVisualizer';
import AdminPanel from './components/AdminPanel';
import VendorRegistration from './components/VendorRegistration';
import { Loader2, ShoppingBag, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'HOME' | 'CATEGORY' | 'ADMIN' | 'VENDOR_DASHBOARD' | 'RIDER_REG' | 'RIDER_DASHBOARD' | 'VENDOR_REG'>('HOME');
  const [user, setUser] = useState<User | null>(null);
  const [activeRider, setActiveRider] = useState<Rider | null>(null);
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<UserRole>(UserRole.USER);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedDeliveryVendor, setSelectedDeliveryVendor] = useState<Vendor | null>(null);
  const [selectedContactVendor, setSelectedContactVendor] = useState<Vendor | null>(null);

  // For cycling products
  const [productBatchIndex, setProductBatchIndex] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [cats, vends, bans, rids, ords] = await Promise.all([
          fetchCategories(),
          fetchVendors(),
          fetchBanners(),
          fetchRiders(),
          fetchAllOrders()
        ]);
        setCategories(cats);
        setVendors(vends);
        setBanners(bans);
        setRiders(rids);
        setOrders(ords);
      } catch (err: any) {
        console.error("Critical error loading data", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Collect all orderable products
  const allOrderableProducts = useMemo(() => {
    const products: { product: Product, vendor: Vendor }[] = [];
    vendors.filter(v => v.supportsDelivery && v.products).forEach(v => {
      v.products?.forEach(p => {
        products.push({ product: p, vendor: v });
      });
    });
    return products;
  }, [vendors]);

  // Cycle products every 10 seconds
  useEffect(() => {
    if (allOrderableProducts.length <= 10) return;
    const interval = setInterval(() => {
      setProductBatchIndex(prev => {
        const next = prev + 10;
        return next >= allOrderableProducts.length ? 0 : next;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [allOrderableProducts.length]);

  const displayProducts = useMemo(() => {
    return allOrderableProducts.slice(productBatchIndex, productBatchIndex + 10);
  }, [allOrderableProducts, productBatchIndex]);

  const handleAssignRider = async (orderId: string, riderId: string) => {
    const result = await assignRiderToOrder(orderId, riderId);
    if (result.success) {
      const rider = riders.find(r => r.id === riderId);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, riderId, riderName: rider?.name, status: 'ACCEPTED' as any } : o));
    }
  };

  const handleApproveRider = async (id: string) => {
      setRiders(prev => prev.map(r => r.id === id ? { ...r, isApproved: true, status: 'OFFLINE' } : r));
      alert("Rider has been approved.");
  };

  const handleCategoryClick = (category: Category) => {
    setActiveCategory(category);
    setView('CATEGORY');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDirectionClick = (vendor: Vendor) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${vendor.location.lat},${vendor.location.lng}`;
    window.open(url, '_blank');
  };

  const handlePlaceOrder = async (items: any[], total: number, generatedOrderId: string) => {
     if (!selectedDeliveryVendor) return;
     const newOrder: Order = {
         id: generatedOrderId,
         vendorId: selectedDeliveryVendor.id,
         vendorName: selectedDeliveryVendor.name,
         customerName: user?.name || 'Guest User',
         customerPhone: user?.phone || '9876543210',
         serviceRequested: items.map(i => `${i.quantity}x ${i.product.name}`).join(', '),
         date: new Date().toISOString(),
         status: 'PENDING',
         total_amount: total,
         address: 'Dahanu Road, Palghar'
     };
     setOrders(prev => [newOrder, ...prev]);
  };

  const handleVendorRegSubmit = (newVendor: Partial<Vendor>) => {
    const v = { ...newVendor, id: 'v_' + Date.now(), rating: 4.0, isApproved: false } as Vendor;
    setVendors(prev => [...prev, v]);
    setView('HOME');
  };

  const openLogin = (mode: UserRole = UserRole.USER) => {
    setAuthInitialMode(mode);
    setAuthOpen(true);
  };

  const handleAddCategory = (cat: Category) => {
    if (cat.parent_id) {
        setCategories(prev => prev.map(p => p.id === cat.parent_id ? { ...p, subCategories: [...(p.subCategories || []), cat] } : p));
    } else {
        setCategories(prev => [...prev, cat]);
    }
  };

  const handleRemoveCategory = (id: string) => {
      if (!window.confirm("Are you sure you want to remove this category? All its sub-services will be unlinked.")) return;
      setCategories(prev => {
          const isRoot = prev.some(c => c.id === id);
          if (isRoot) return prev.filter(c => c.id !== id);
          return prev.map(c => ({
              ...c,
              subCategories: c.subCategories?.filter(s => s.id !== id)
          }));
      });
  };

  if (isLoading) {
      return (
          <div className="h-screen flex flex-col items-center justify-center bg-appBg">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-white font-bold animate-pulse text-sm uppercase tracking-widest">Dahanu Multiservice</p>
          </div>
      );
  }

  const currentVendorProfile = user?.role === UserRole.VENDOR 
    ? (vendors.find(v => v.email === user.email) || vendors[0]) 
    : null;

  return (
    <div className="flex flex-col min-h-screen scroll-smooth bg-appBg">
      <SideMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        user={user}
        onLogin={openLogin}
        onLogout={() => { setUser(null); setActiveRider(null); setView('HOME'); }}
        onAdminClick={() => openLogin(UserRole.ADMIN)}
        onRiderClick={() => setView('RIDER_REG')}
        onVendorRegClick={() => setView('VENDOR_REG')}
      />
      <Header 
        user={user}
        onLoginClick={() => openLogin()}
        onLogoutClick={() => setUser(null)}
        onMenuClick={() => setIsMenuOpen(true)}
        onAdminClick={() => openLogin(UserRole.ADMIN)}
        onPartnerClick={() => openLogin(UserRole.VENDOR)}
        onVendorDashboardClick={() => setView('VENDOR_DASHBOARD')}
        locationText="Dahanu West, Palghar"
        onSearch={() => {}}
        onHomeClick={() => setView('HOME')}
        showBackButton={view !== 'HOME'}
        onBackClick={() => setView('HOME')}
        onRegisterBusiness={() => setView('VENDOR_REG')}
      />

      <main className="flex-1 pb-28">
        {view === 'HOME' && (
            <div className="container mx-auto px-4 py-4 space-y-6 animate-fade-in">
                <BannerCarousel banners={banners} />
                <FeaturedService 
                    vendors={vendors} 
                    onContactClick={(v) => setSelectedContactVendor(v)} 
                    onOrderClick={(v) => setSelectedDeliveryVendor(v)} 
                />
                
                {/* Dynamic Product Showcase - Replaced Category Grid */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-white font-black text-sm uppercase tracking-[0.2em] flex items-center gap-2">
                        <div className="w-8 h-[2px] bg-yellow-400"></div> Top Picks for You
                    </h2>
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-widest animate-pulse">Updates in 10s</span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {displayProducts.map((item, idx) => (
                          <div 
                            key={`${item.vendor.id}-${idx}`} 
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group flex flex-col h-full animate-fade-in"
                          >
                              <div className="aspect-square relative overflow-hidden bg-gray-100">
                                  <img 
                                    src={item.product.image || `https://picsum.photos/400/400?random=${idx + productBatchIndex}`} 
                                    alt={item.product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  />
                                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-[10px] font-black text-primary shadow-sm">
                                      ₹{item.product.price}
                                  </div>
                              </div>
                              <div className="p-3 flex flex-col flex-1">
                                  <h4 className="font-bold text-gray-800 text-xs line-clamp-1 mb-0.5" title={item.product.name}>
                                    {item.product.name}
                                  </h4>
                                  <p className="text-[9px] text-gray-400 font-bold uppercase truncate mb-3">
                                    by {item.vendor.name}
                                  </p>
                                  <button 
                                    onClick={() => setSelectedDeliveryVendor(item.vendor)}
                                    className="mt-auto w-full bg-[#1a1c2e] hover:bg-primary text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-md active:scale-95"
                                  >
                                    <ShoppingBag className="w-3 h-3" /> Order Now
                                  </button>
                              </div>
                          </div>
                      ))}
                      {displayProducts.length === 0 && (
                        <div className="col-span-full py-20 text-center text-white/50 font-bold uppercase tracking-widest text-xs border border-dashed border-white/20 rounded-3xl">
                          Discovering fresh products...
                        </div>
                      )}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl">
                   <div className="flex justify-between items-center mb-4">
                       <h2 className="text-xl font-bold text-white flex items-center gap-2">Logistics Fleet</h2>
                       <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                           <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{riders.filter(r => r.status === 'ONLINE').length} Active Partners</span>
                       </div>
                   </div>
                   <div className="h-72 rounded-2xl overflow-hidden border border-white/10 shadow-inner">
                      <MapVisualizer vendors={[]} riders={riders} userLocation={null} />
                   </div>
                </div>
            </div>
        )}
        
        {view === 'CATEGORY' && activeCategory && (
            <CategoryView 
              category={activeCategory} 
              onBack={() => setView('HOME')} 
              onSelectSubCategory={(sub) => handleCategoryClick(sub)} 
              vendors={vendors} 
              userLocation={null} 
              onContact={(v) => setSelectedContactVendor(v)}
              onDirection={(v) => handleDirectionClick(v)}
              onOrder={(v) => setSelectedDeliveryVendor(v)}
              onRegisterClick={() => setView('VENDOR_REG')}
            />
        )}

        {view === 'ADMIN' && (
           <AdminPanel 
             categories={categories} 
             vendors={vendors} 
             banners={banners} 
             orders={orders} 
             riders={riders} 
             onAssignRider={handleAssignRider}
             onApproveVendor={(id) => setVendors(prev => prev.map(v => v.id === id ? {...v, isApproved: true} : v))} 
             onApproveRider={handleApproveRider}
             onRemoveVendor={(id) => setVendors(prev => prev.filter(v => v.id !== id))}
             onAddCategory={handleAddCategory}
             onRemoveCategory={handleRemoveCategory}
           />
        )}

        {view === 'VENDOR_REG' && (
            <div className="container mx-auto px-4 py-8">
                <VendorRegistration 
                    categories={categories} 
                    onSubmit={handleVendorRegSubmit} 
                    onCancel={() => setView('HOME')} 
                />
            </div>
        )}

        {view === 'VENDOR_DASHBOARD' && currentVendorProfile && (
            <VendorDashboard 
                vendor={currentVendorProfile} 
                orders={orders.filter(o => o.vendorId === currentVendorProfile.id)} 
                onUpdateStatus={(id, status) => setOrders(prev => prev.map(o => o.id === id ? {...o, status} : o))}
                onUpdateVendor={(updated) => setVendors(prev => prev.map(v => v.id === updated.id ? updated : v))}
            />
        )}

        {view === 'RIDER_REG' && (
            <RiderRegistration 
                onSubmit={(d) => { 
                    const nr = { ...d, id: 'rid_' + Date.now(), isApproved: false } as Rider;
                    setRiders(prev => [...prev, nr]);
                    setView('HOME'); 
                }} 
                onCancel={() => setView('HOME')} 
            />
        )}

        {view === 'RIDER_DASHBOARD' && activeRider && (
            <RiderDashboard rider={activeRider} onUpdateLocation={() => {}} onUpdateStatus={() => {}} />
        )}
      </main>

      <Footer />
      <BottomNav categories={categories} onCategoryClick={handleCategoryClick} />
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setAuthOpen(false)} 
        initialMode={authInitialMode}
        onLoginSuccess={(email, role) => {
          const newUser: User = { id: 'u' + Date.now(), name: email.split('@')[0], email, role: role as UserRole };
          setUser(newUser);
          if (role === UserRole.ADMIN) setView('ADMIN');
          else if (role === UserRole.VENDOR) setView('VENDOR_DASHBOARD');
          else if (role === UserRole.RIDER) setView('RIDER_DASHBOARD');
      }} />
      
      {selectedDeliveryVendor && (
          <DeliveryOrderModal isOpen={!!selectedDeliveryVendor} onClose={() => setSelectedDeliveryVendor(null)} vendor={selectedDeliveryVendor} onPlaceOrder={handlePlaceOrder} />
      )}

      {selectedContactVendor && (
          <ContactModal 
            vendor={selectedContactVendor} 
            onClose={() => setSelectedContactVendor(null)} 
            onDirection={handleDirectionClick}
          />
      )}
    </div>
  );
};

export default App;
