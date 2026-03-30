
import React, { useState } from 'react';
import { Search, Menu, User as UserIcon, MapPin, ArrowLeft, Home, PlusCircle } from 'lucide-react';
import { UserRole, User } from '../types';

interface HeaderProps {
  user: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onMenuClick: () => void;
  onAdminClick: () => void;
  onPartnerClick: () => void;
  onVendorDashboardClick: () => void;
  locationText: string;
  onSearch: (query: string) => void;
  onHomeClick: () => void;
  onBackClick?: () => void;
  showBackButton?: boolean;
  onRegisterBusiness: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
    user, onLoginClick, onLogoutClick, onMenuClick, onAdminClick, onPartnerClick, onVendorDashboardClick,
    locationText, onSearch, onHomeClick, onBackClick, showBackButton, onRegisterBusiness
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-2xl text-slate-900 shadow-[0_2px_15px_rgba(0,0,0,0.05)] border-b border-white/40 transition-all duration-300">
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between gap-4">
        
        {/* Left: Menu, Back, Logo */}
        <div className="flex items-center gap-2 md:gap-4">
            <button onClick={onMenuClick} className="p-2 -ml-2 text-primary hover:bg-primary/10 rounded-full transition-colors">
                <Menu className="w-6 h-6" />
            </button>

            {showBackButton && (
               <button onClick={onBackClick} className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors animate-fade-in">
                  <ArrowLeft className="w-6 h-6" />
               </button>
            )}
            
            <div className="flex flex-col cursor-pointer group relative select-none" onClick={onHomeClick}>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tighter text-slate-900 lowercase leading-none">
                    dahanu<span className="text-primary">.</span>
                </h1>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
                    Multiservice
                </span>
            </div>

            <div className="hidden lg:flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 ml-4">
                <MapPin className="w-3 h-3 text-secondary"/> 
                <span className="truncate max-w-[150px]">{locationText}</span>
            </div>
        </div>

        {/* Center: Search Bar (Desktop) */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-sm relative hidden md:block group mx-4">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
             <Search className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search services..."
            className="w-full py-2 pl-10 pr-4 rounded-full bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 md:gap-5">
           <button 
              onClick={onRegisterBusiness}
              className="hidden sm:flex items-center gap-2 bg-secondary hover:bg-amber-600 text-white px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-wider transition-all shadow-sm active:scale-95"
           >
              <PlusCircle className="w-4 h-4" />
              List Business
           </button>

          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 hover:bg-slate-100 p-1 pr-3 rounded-full transition-all border border-transparent hover:border-slate-200">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-slate-400 flex items-center justify-center text-white font-bold text-xs shadow-sm border border-white/20">
                    {(() => {
                        const cleanName = user.name.replace(/^\+/, '');
                        return cleanName.charAt(0).toUpperCase() || 'U';
                    })()}
                </div>
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white text-slate-800 shadow-2xl rounded-xl overflow-hidden hidden group-hover:block z-50 animate-fade-in border border-slate-100">
                 <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <p className="font-bold text-sm truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-black">{user.role}</p>
                 </div>
                 <div className="flex flex-col py-1">
                    {user.role === UserRole.ADMIN && (
                        <button onClick={onAdminClick} className="px-4 py-2.5 hover:bg-slate-50 text-left text-sm font-semibold text-primary flex items-center gap-2">Admin Panel</button>
                    )}
                    {user.role === UserRole.VENDOR && (
                        <button onClick={onVendorDashboardClick} className="px-4 py-2.5 hover:bg-slate-50 text-left text-sm font-semibold text-secondary flex items-center gap-2">Dashboard</button>
                    )}
                    <button onClick={onLogoutClick} className="px-4 py-2.5 hover:bg-red-50 text-left text-sm text-red-500 font-bold">Logout</button>
                 </div>
              </div>
            </div>
          ) : (
            <button 
                onClick={onLoginClick} 
                className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:shadow-xl hover:bg-slate-700 transition-all active:scale-95"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      <div className="md:hidden px-4 pb-4">
        <form onSubmit={handleSearchSubmit} className="relative">
           <input 
             type="text" 
             placeholder="Search Dahanu..." 
             className="w-full py-2.5 px-4 rounded-full bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white text-sm"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
           <Search className="absolute right-4 top-2.5 h-4 w-4 text-slate-400" />
        </form>
      </div>
    </header>
  );
};

export default Header;
