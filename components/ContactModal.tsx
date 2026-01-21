
import React from 'react';
import { X, Phone, MapPin, Star, CheckCircle, Navigation, ExternalLink } from 'lucide-react';
import { Vendor } from '../types';

interface ContactModalProps {
  vendor: Vendor;
  onClose: () => void;
  onDirection: (vendor: Vendor) => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ vendor, onClose, onDirection }) => {
  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in font-sans">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="h-32 bg-primary relative">
            <div className="absolute -bottom-10 left-6">
                <div className="w-20 h-20 rounded-2xl border-4 border-white bg-white overflow-hidden shadow-lg">
                    <img src={vendor.imageUrl} className="w-full h-full object-cover" alt={vendor.name} />
                </div>
            </div>
        </div>

        <div className="pt-12 p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        {vendor.name}
                        {vendor.isVerified && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </h2>
                    <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">{vendor.categoryIds[0]}</p>
                </div>
                <div className="bg-green-600 text-white px-2 py-1 rounded font-bold text-sm flex items-center gap-1">
                    {vendor.rating} <Star className="w-3 h-3 fill-current" />
                </div>
            </div>

            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {vendor.description}
            </p>

            <div className="space-y-4 mb-8">
                <div className="flex gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Address</p>
                        <p className="text-sm text-gray-800 font-medium">{vendor.location.address}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Phone Number</p>
                        <p className="text-sm text-gray-800 font-bold">{vendor.contact}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={() => onDirection(vendor)}
                    className="flex items-center justify-center gap-2 bg-gray-100 text-gray-800 font-bold py-3 rounded-xl hover:bg-gray-200 transition"
                >
                    <Navigation className="w-4 h-4" /> Directions
                </button>
                <a 
                    href={`tel:${vendor.contact}`}
                    className="flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 rounded-xl shadow-lg hover:brightness-110 transition"
                >
                    <Phone className="w-4 h-4" /> Call Now
                </a>
            </div>
            
            <div className="mt-6 text-center">
                <p className="text-[10px] text-gray-400 font-medium">Please mention you found them on Dahanu platform.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
