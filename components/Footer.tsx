
import React from 'react';
import { Facebook, Twitter, Youtube, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white text-sm mt-auto">
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-gray-400 uppercase font-bold mb-4 text-xs tracking-wider">About</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Contact Us</a></li>
            <li><a href="#" className="hover:underline">About Us</a></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
            <li><a href="#" className="hover:underline">Press</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-gray-400 uppercase font-bold mb-4 text-xs tracking-wider">Help</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Payments</a></li>
            <li><a href="#" className="hover:underline">Shipping</a></li>
            <li><a href="#" className="hover:underline">Cancellation & Returns</a></li>
            <li><a href="#" className="hover:underline">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-gray-400 uppercase font-bold mb-4 text-xs tracking-wider">Policy</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Return Policy</a></li>
            <li><a href="#" className="hover:underline">Terms of Use</a></li>
            <li><a href="#" className="hover:underline">Security</a></li>
            <li><a href="#" className="hover:underline">Privacy</a></li>
          </ul>
        </div>
        <div>
           <h3 className="text-gray-400 uppercase font-bold mb-4 text-xs tracking-wider">Social</h3>
           <div className="flex gap-4">
             <a href="#" className="hover:text-primary"><Facebook className="w-5 h-5"/></a>
             <a href="#" className="hover:text-primary"><Twitter className="w-5 h-5"/></a>
             <a href="#" className="hover:text-primary"><Youtube className="w-5 h-5"/></a>
             <a href="#" className="hover:text-primary"><Instagram className="w-5 h-5"/></a>
           </div>
           <p className="mt-4 text-gray-500 text-xs">
              © 2024 Dahanu Multi-Service Platform. All rights reserved.
           </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
