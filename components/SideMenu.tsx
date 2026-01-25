
import React from 'react';
import { X, UserCircle, HelpCircle, ShoppingBag, Tag, LogOut, LogIn, ShieldCheck, Bike, ShieldAlert, UserPlus } from 'lucide-react';
import { User, UserRole } from '../types';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLogin: (role?: UserRole) => void;
  onLogout: () => void;
  onAdminClick: () => void;
  onRiderClick: () => void; 
  onVendorRegClick: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, user, onLogin, onLogout, onAdminClick, onRiderClick, onVendorRegClick }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-md transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed top-0 left-0 bottom-0 w-80 bg-white shadow-2xl z-[101] transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        
        {/* Header */}
        <div className="bg-[#1a1c2e] text-white p-6 flex items-center justify-between shrink-0">
           <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-xl">
                 <UserCircle className="w-7 h-7" />
              </div>
              <div className="overflow-hidden">
                {user ? (
                    <div className="flex flex-col">
                        <span className="font-bold text-sm truncate">{user.name}</span>
                        <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">{user.role} Account</span>
                    </div>
                ) : (
                    <div className="font-bold text-sm">Welcome Guest</div>
                )}
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6 text-gray-400" /></button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
            
            {/* Rider Section - AT TOP */}
            {!user && (
              <div className="animate-fade-in">
                  <h3 className="font-black text-[10px] text-gray-400 mb-4 uppercase tracking-[0.2em] px-1">Rider Partners</h3>
                  <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => { onRiderClick(); onClose(); }}
                        className="flex flex-col items-center justify-center p-3 bg-blue-50 border border-blue-100 rounded-xl transition-all hover:bg-blue-100 active:scale-95 group"
                      >
                          <UserPlus className="w-5 h-5 text-blue-600 mb-1" />
                          <span className="text-[10px] font-black text-blue-700 uppercase">Join Us</span>
                      </button>
                      <button 
                        onClick={() => { onLogin(UserRole.RIDER); onClose(); }}
                        className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-xl transition-all hover:bg-gray-50 active:scale-95 group"
                      >
                          <Bike className="w-5 h-5 text-gray-600 mb-1" />
                          <span className="text-[10px] font-black text-gray-700 uppercase">Login</span>
                      </button>
                  </div>
              </div>
            )}

            {/* Main Marketplace */}
            <div>
                <h3 className="font-black text-[10px] text-gray-400 mb-4 uppercase tracking-[0.2em] px-1">Marketplace</h3>
                <div className="space-y-1">
                    {[
                        { icon: ShoppingBag, label: 'Dahanu Mart' },
                        { icon: Tag, label: 'Special Offers' },
                        { icon: HelpCircle, label: 'Support Hub' },
                    ].map((item, idx) => (
                        <button key={idx} className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-xl flex items-center gap-3 text-sm text-gray-600 font-medium transition-colors">
                            <item.icon className="w-4 h-4 text-gray-400" /> {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Account Management */}
            <div>
                <h3 className="font-black text-[10px] text-gray-400 mb-4 uppercase tracking-[0.2em] px-1">Account</h3>
                <div className="space-y-1">
                    {user ? (
                        <button onClick={() => { onLogout(); onClose(); }} className="w-full text-left px-4 py-3 hover:bg-red-50 rounded-xl flex items-center gap-3 text-sm text-red-600 font-bold transition-colors">
                           <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    ) : (
                        <button onClick={() => { onLogin(UserRole.USER); onClose(); }} className="w-full text-left px-4 py-3 bg-primary/5 hover:bg-primary/10 rounded-xl flex items-center gap-3 text-sm text-primary font-bold transition-colors">
                           <LogIn className="w-4 h-4" /> Member Login
                        </button>
                    )}
                </div>
            </div>
        </div>
        
        {/* Footer/Bottom - ADMIN PORTAL */}
        <div className="p-4 border-t border-gray-100 space-y-4">
            {!user && (
                <button 
                    onClick={() => { onLogin(UserRole.ADMIN); onClose(); }}
                    className="w-full text-left px-4 py-3 bg-gray-900 text-white rounded-xl flex items-center gap-3 text-sm font-bold transition-all hover:bg-black active:scale-95"
                >
                    <ShieldAlert className="w-4 h-4 text-yellow-400" /> Admin Portal Login
                </button>
            )}
            {user?.role === UserRole.ADMIN && (
                <button onClick={() => { onAdminClick(); onClose(); }} className="w-full text-left px-4 py-3 bg-purple-600 text-white rounded-xl flex items-center gap-3 text-sm font-bold transition-colors">
                    <ShieldCheck className="w-4 h-4" /> Go to Admin Panel
                </button>
            )}
            <div className="text-[10px] text-gray-400 font-black text-center uppercase tracking-widest">
                Dahanu multiservice • v2.1
            </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
