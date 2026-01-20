
import React, { useState } from 'react';
import { Search, Menu, User as UserIcon, MapPin, ArrowLeft, Home } from 'lucide-react';
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
}

const Header: React.FC<HeaderProps> = ({ 
    user, onLoginClick, onLogoutClick, onMenuClick, onAdminClick, onPartnerClick, onVendorDashboardClick,
    locationText, onSearch, onHomeClick, onBackClick, showBackButton
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#1a1c2e]/90 backdrop-blur-md text-white shadow-lg border-b border-white/10 transition-all duration-300">
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between gap-4">
        
        {/* Left: Menu, Back, Logo */}
        <div className="flex items-center gap-2 md:gap-4">
            {/* Menu Icon: Yellow */}
            <button onClick={onMenuClick} className="p-2 -ml-2 text-yellow-400 hover:text-yellow-300 hover:bg-white/10 rounded-full transition-colors">
                <Menu className="w-6 h-6" />
            </button>

            {showBackButton && (
               <button onClick={onBackClick} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors animate-fade-in">
                  <ArrowLeft className="w-6 h-6" />
               </button>
            )}
            
            {/* Logo & Subtitle */}
            <div className="flex flex-col cursor-pointer group relative select-none" onClick={onHomeClick}>
                <h1 className="text-3xl font-logo font-bold tracking-tighter text-white lowercase leading-none">
                    dahanu
                </h1>
                <span className="text-[10px] font-bold text-yellow-400 tracking-wider uppercase mt-0.5">
                    Multiservice Platform
                </span>
            </div>

            {/* Desktop Location */}
            <div className="hidden lg:flex items-center gap-1 text-xs text-gray-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 ml-4">
                <MapPin className="w-3 h-3 text-secondary"/> 
                <span className="truncate max-w-[150px]">{locationText}</span>
            </div>
        </div>

        {/* Center: Search Bar (Desktop) */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl relative hidden md:block group mx-4">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
             <Search className="h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search services, places in Dahanu..."
            className="w-full py-2.5 pl-10 pr-4 rounded-full bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/20 transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 md:gap-5">
           {/* Home Button */}
           <button onClick={onHomeClick} className="hidden md:flex flex-col items-center justify-center text-white/80 hover:text-white transition group">
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold mt-0.5">Home</span>
           </button>

          <button onClick={onPartnerClick} className="hidden lg:block text-xs font-bold text-gray-300 hover:text-white transition uppercase tracking-wide">
            Partner
          </button>

          {/* Login/Profile Icon */}
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 hover:bg-white/10 p-1 pr-3 rounded-full transition-all border border-transparent hover:border-white/10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                    {user.name.charAt(0).toUpperCase()}
                </div>
              </button>
              {/* Profile Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white text-gray-800 shadow-xl rounded-lg overflow-hidden hidden group-hover:block z-50 animate-fade-in border border-gray-100">
                 <div className="p-3 border-b border-gray-100 bg-gray-50">
                    <p className="font-bold text-sm truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                 </div>
                 <div className="flex flex-col py-1">
                    {user.role === UserRole.ADMIN && (
                        <button onClick={onAdminClick} className="px-4 py-2 hover:bg-gray-50 text-left text-sm font-semibold text-primary">Admin Console</button>
                    )}
                    {user.role === UserRole.VENDOR && (
                        <button onClick={onVendorDashboardClick} className="px-4 py-2 hover:bg-gray-50 text-left text-sm font-semibold text-secondary">Vendor Dashboard</button>
                    )}
                    <button onClick={onLogoutClick} className="px-4 py-2 hover:bg-gray-50 text-left text-sm text-red-500">Logout</button>
                 </div>
              </div>
            </div>
          ) : (
            <button 
                onClick={onLoginClick} 
                className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-full font-bold text-xs shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all"
            >
              <UserIcon className="w-4 h-4" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-4">
        <form onSubmit={handleSearchSubmit} className="relative">
           <input 
             type="text" 
             placeholder="Search Dahanu..." 
             className="w-full py-2.5 px-4 rounded-full bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:bg-white/20 text-sm"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
           <Search className="absolute right-4 top-2.5 h-4 w-4 text-gray-400" />
        </form>
      </div>
    </header>
  );
};

export default Header;
