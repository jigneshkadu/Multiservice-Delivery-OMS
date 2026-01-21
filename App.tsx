
import React, { useState, useEffect } from 'react';
import { 
  User, UserRole, Vendor, Category, Banner, Order, Rider
} from './types';
import { 
  fetchCategories, fetchVendors, fetchBanners, createOrder, registerRider, fetchRiders, updateRiderLocation, updateRiderStatus, fetchAllOrders, assignRiderToOrder
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
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'HOME' | 'CATEGORY' | 'ADMIN' | 'VENDOR_DASHBOARD' | 'RIDER_REG' | 'RIDER_DASHBOARD'>('HOME');
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

    const interval = setInterval(async () => {
      // Logic for regular updates would go here in real system
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleAssignRider = async (orderId: string, riderId: string) => {
    const result = await assignRiderToOrder(orderId, riderId);
    if (result.success) {
      const rider = riders.find(r => r.id === riderId);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, riderId, riderName: rider?.name, status: 'ACCEPTED' as any } : o));
    }
  };

  const handleApproveRider = async (id: string) => {
      setRiders(prev => prev.map(r => r.id === id ? { ...r, isApproved: true, status: 'OFFLINE' } : r));
      alert("Rider has been approved and moved to Active Fleet.");
  };

  const handleCategoryClick = (category: Category) => {
    setActiveCategory(category);
    if (category.themeColor) {
        document.documentElement.style.setProperty('--primary-color', category.themeColor);
    }
    setView('CATEGORY');
    window.scrollTo(0, 0);
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
     console.log("Order added to state:", newOrder);
  };

  const openLogin = (mode: UserRole = UserRole.USER) => {
    setAuthInitialMode(mode);
    setAuthOpen(true);
  };

  if (isLoading) {
      return (
          <div className="h-screen flex flex-col items-center justify-center bg-bgLight">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-gray-500 font-bold animate-pulse text-sm uppercase tracking-widest">Dahanu Multiservice</p>
          </div>
      );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SideMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        user={user}
        onLogin={openLogin}
        onLogout={() => { setUser(null); setActiveRider(null); setView('HOME'); }}
        onAdminClick={() => openLogin(UserRole.ADMIN)}
        onRiderClick={() => setView('RIDER_REG')}
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
      />

      <main className="flex-1 pb-28 bg-gray-50/30">
        {view === 'HOME' && (
            <div className="container mx-auto px-4 py-4 space-y-6 animate-fade-in">
                <BannerCarousel banners={banners} />
                <FeaturedService 
                    vendors={vendors} 
                    onContactClick={(v) => setSelectedContactVendor(v)} 
                    onOrderClick={(v) => setSelectedDeliveryVendor(v)} 
                />
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <div className="flex justify-between items-center mb-4">
                       <h2 className="text-xl font-bold">Logistics Network</h2>
                       <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                           <span className="text-[10px] font-bold text-gray-500 uppercase">{riders.filter(r => r.status === 'ONLINE').length} Active Riders</span>
                       </div>
                   </div>
                   <div className="h-64 rounded-lg overflow-hidden border">
                      <MapVisualizer vendors={[]} riders={riders} userLocation={null} />
                   </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {categories.map(cat => (
                        <button key={cat.id} onClick={() => handleCategoryClick(cat)} className="flex flex-col items-center p-4 bg-white rounded-xl shadow-fk hover:shadow-theme transition group border border-transparent hover:border-primary/20">
                            <div className="w-12 h-12 rounded-full mb-2 flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: `${cat.themeColor}15` }}>
                                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: cat.themeColor }}></div>
                            </div>
                            <span className="text-xs font-bold text-gray-800 text-center">{cat.name}</span>
                        </button>
                    ))}
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
             onApproveVendor={() => {}} 
             onApproveRider={handleApproveRider}
             onRemoveVendor={() => {}}
           />
        )}

        {view === 'RIDER_REG' && (
            <RiderRegistration 
                onSubmit={async (d) => { 
                    const newRider = { ...d, id: 'rid_' + Date.now(), isApproved: false } as Rider;
                    setRiders(prev => [...prev, newRider]);
                    alert("Registration Successful! Please wait for Admin Verification.");
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
          if (role === UserRole.ADMIN) {
             setView('ADMIN');
          } else if (role === UserRole.RIDER) {
            setActiveRider({ id: 'r1', name: newUser.name, phone: '9000000000', vehicleType: 'BIKE', status: 'ONLINE', location: { lat: 19.97, lng: 72.73 }, isApproved: true, rating: 5 });
            setView('RIDER_DASHBOARD');
          }
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
