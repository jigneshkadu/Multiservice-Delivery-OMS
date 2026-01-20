
import React from 'react';
import { Ambulance, HeartPulse, Siren, Phone } from 'lucide-react';

interface EmergencyBarProps {
  onCategorySelect: (id: string) => void;
}

const EmergencyBar: React.FC<EmergencyBarProps> = ({ onCategorySelect }) => {
  return (
    <div className="bg-red-600 text-white shadow-lg overflow-hidden relative z-[60]">
      <div className="container mx-auto flex items-center justify-between px-2 py-2 md:py-1">
        
        {/* Label */}
        <div className="flex items-center gap-2 bg-red-800/50 px-3 py-1 rounded-full shrink-0 animate-pulse">
           <Siren className="w-4 h-4 text-white" />
           <span className="text-xs font-bold uppercase tracking-wider">Emergency</span>
        </div>

        {/* Action Items */}
        <div className="flex items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar ml-4">
           <button onClick={() => onCategorySelect('ambulance')} className="flex items-center gap-1.5 shrink-0 hover:text-red-100 transition-colors">
              <Ambulance className="w-4 h-4" />
              <span className="text-xs font-semibold">Ambulance</span>
           </button>
           <button onClick={() => onCategorySelect('hospitals')} className="flex items-center gap-1.5 shrink-0 hover:text-red-100 transition-colors">
              <HeartPulse className="w-4 h-4" />
              <span className="text-xs font-semibold">Hospital</span>
           </button>
           <button onClick={() => onCategorySelect('bloodbank')} className="flex items-center gap-1.5 shrink-0 hover:text-red-100 transition-colors">
              <span className="w-4 h-4 font-bold border-2 border-white rounded-full flex items-center justify-center text-[10px]">B</span>
              <span className="text-xs font-semibold">Blood Bank</span>
           </button>
           <a href="tel:100" className="flex items-center gap-1.5 shrink-0 hover:text-red-100 transition-colors border-l border-red-400 pl-4">
              <Phone className="w-3 h-3" />
              <span className="text-xs font-bold">100 (Police)</span>
           </a>
        </div>
      </div>
    </div>
  );
};

export default EmergencyBar;
