
import React from 'react';
import { Facebook, Twitter, Youtube, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/70 backdrop-blur-xl text-slate-900 text-sm mt-auto border-t border-white/40">
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <h3 className="text-slate-400 uppercase font-black mb-6 text-[10px] tracking-[0.2em]">About</h3>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-slate-600 transition-colors font-bold">Contact Us</a></li>
            <li><a href="#" className="hover:text-slate-600 transition-colors font-bold">About Us</a></li>
            <li><a href="#" className="hover:text-slate-600 transition-colors font-bold">Careers</a></li>
            <li><a href="#" className="hover:text-slate-600 transition-colors font-bold">Press</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-slate-400 uppercase font-black mb-6 text-[10px] tracking-[0.2em]">Help</h3>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-slate-600 transition-colors font-bold">Payments</a></li>
            <li><a href="#" className="hover:text-slate-600 transition-colors font-bold">Shipping</a></li>
            <li><a href="#" className="hover:text-slate-600 transition-colors font-bold">Cancellation & Returns</a></li>
            <li><a href="#" className="hover:text-slate-600 transition-colors font-bold">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-slate-400 uppercase font-black mb-6 text-[10px] tracking-[0.2em]">Policy</h3>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-slate-600 transition-colors font-bold">Return Policy</a></li>
            <li><a href="#" className="hover:text-slate-600 transition-colors font-bold">Terms of Use</a></li>
            <li><a href="#" className="hover:text-slate-600 transition-colors font-bold">Security</a></li>
            <li><a href="#" className="hover:text-slate-600 transition-colors font-bold">Privacy</a></li>
          </ul>
        </div>
        <div>
           <h3 className="text-slate-400 uppercase font-black mb-6 text-[10px] tracking-[0.2em]">Social</h3>
           <div className="flex gap-4">
             <a href="#" className="p-3 bg-white/50 rounded-2xl hover:bg-slate-500 hover:text-white transition-all shadow-sm"><Facebook className="w-5 h-5"/></a>
             <a href="#" className="p-3 bg-white/50 rounded-2xl hover:bg-slate-500 hover:text-white transition-all shadow-sm"><Twitter className="w-5 h-5"/></a>
             <a href="#" className="p-3 bg-white/50 rounded-2xl hover:bg-slate-500 hover:text-white transition-all shadow-sm"><Youtube className="w-5 h-5"/></a>
             <a href="#" className="p-3 bg-white/50 rounded-2xl hover:bg-slate-500 hover:text-white transition-all shadow-sm"><Instagram className="w-5 h-5"/></a>
           </div>
           <p className="mt-8 text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              © 2024 Dahanu Multi-Service Platform.<br/>All rights reserved.
           </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
