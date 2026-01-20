
import React from 'react';
import { X, UserCircle, HelpCircle, Gift, Rocket, Briefcase, ShoppingBag, Plane, Tag, LogOut, LogIn, ShieldCheck, LayoutDashboard, Bike } from 'lucide-react';
import { User, UserRole } from '../types';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLogin: (role?: UserRole) => void;
  onLogout: () => void;
  onAdminClick: () => void;
  onRiderClick: () => void; 
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, user, onLogin, onLogout, onAdminClick, onRiderClick }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed top-0 left-0 bottom-0 w-80 bg-white shadow-2xl z-[101] transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        
        {/* Header */}
        <div className="bg-[#1a1c2e] text-white p-5 flex items-center justify-between shrink-0">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                 <UserCircle className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                {user ? (
                    <div className="flex flex-col">
                        <span className="font-bold text-sm truncate">{user.name}</span>
                        <span className="text-xs text-gray-400 truncate">{user.email}</span>
                    </div>
                ) : (
                    <div className="font-bold text-sm">Hello, Sign in</div>
                )}
              </div>
           </div>
           <button onClick={onClose} className="p-1 hover:bg-white/10 rounded"><X className="w-6 h-6 text-gray-300" /></button>
        </div>

        {/* Menu Items - Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
            
            {/* Delivery Partner Entry */}
            <div className="border-b border-gray-100 pb-4">
                 <h3 className="font-bold text-gray-900 mb-3 px-2 text-sm uppercase tracking-wider">Join Us</h3>
                 <div className="space-y-2">
                    <button 
                        onClick={() => { onRiderClick(); onClose(); }}
                        className="w-full text-left px-3 py-3 bg-secondary/5 border border-secondary/10 rounded-lg flex items-center gap-3 text-sm text-secondary font-bold transition-all hover:bg-secondary/10"
                    >
                        <Bike className="w-5 h-5" /> Join as Delivery Rider
                    </button>
                    {!user && (
                        <button 
                            onClick={() => { onLogin(UserRole.RIDER); onClose(); }}
                            className="w-full text-left px-3 py-2 text-xs text-gray-500 hover:text-primary flex items-center gap-2 justify-center"
                        >
                            <LogIn className="w-3 h-3" /> Already a Rider? Login here
                        </button>
                    )}
                 </div>
            </div>

            {/* Programs & Features */}
            <div className="border-b border-gray-100 pb-4">
                <h3 className="font-bold text-gray-900 mb-3 px-2 text-sm uppercase tracking-wider">Programs & Features</h3>
                <div className="space-y-1">
                    {[
                        { icon: Gift, label: 'Gift Cards & Recharges' },
                        { icon: Rocket, label: 'Launchpad' },
                        { icon: Briefcase, label: 'Business' },
                        { icon: ShoppingBag, label: 'Handicrafts' },
                        { icon: Plane, label: 'Flight Tickets' },
                        { icon: Tag, label: 'Clearance store' },
                    ].map((item, idx) => (
                        <button key={idx} className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-lg flex items-center gap-3 text-sm text-gray-600 transition-colors">
                            <item.icon className="w-4 h-4 text-gray-400" /> {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Help & Settings */}
            <div className="border-b border-gray-100 pb-4">
                <h3 className="font-bold text-gray-900 mb-3 px-2 text-sm uppercase tracking-wider">Help & Settings</h3>
                <div className="space-y-1">
                    <button className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-lg flex items-center gap-3 text-sm text-gray-600 transition-colors">
                        <UserCircle className="w-4 h-4 text-gray-400" /> Your Account
                    </button>
                    <button className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-lg flex items-center gap-3 text-sm text-gray-600 transition-colors">
                        <HelpCircle className="w-4 h-4 text-gray-400" /> Customer Service
                    </button>
                    {user ? (
                        <button onClick={() => { onLogout(); onClose(); }} className="w-full text-left px-3 py-2.5 hover:bg-red-50 rounded-lg flex items-center gap-3 text-sm text-red-600 font-bold mt-2 transition-colors">
                           <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    ) : (
                        <button onClick={() => { onLogin(); onClose(); }} className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-lg flex items-center gap-3 text-sm text-primary font-bold mt-2 transition-colors">
                           <LogIn className="w-4 h-4" /> Sign In
                        </button>
                    )}
                </div>
            </div>
            
            {/* Partner Zone */}
            <div>
                 <h3 className="font-bold text-gray-900 mb-3 px-2 text-sm uppercase tracking-wider">Partner Zone</h3>
                 <div className="space-y-1">
                     <button 
                        onClick={() => { onAdminClick(); onClose(); }} 
                        className="w-full text-left px-3 py-2.5 hover:bg-purple-50 rounded-lg flex items-center gap-3 text-sm text-gray-700 transition-colors font-medium"
                     >
                        <ShieldCheck className="w-4 h-4 text-purple-600" /> Admin Portal
                     </button>
                     {user?.role === UserRole.VENDOR && (
                         <button className="w-full text-left px-3 py-2.5 hover:bg-orange-50 rounded-lg flex items-center gap-3 text-sm text-gray-700 transition-colors font-medium">
                            <LayoutDashboard className="w-4 h-4 text-orange-600" /> Vendor Dashboard
                         </button>
                     )}
                 </div>
            </div>

        </div>
        
        <div className="p-4 bg-gray-50 text-[10px] text-gray-400 text-center border-t border-gray-100">
            v1.1.0 • Dahanu Delivery Platform
        </div>
      </div>
    </>
  );
};

export default SideMenu;
