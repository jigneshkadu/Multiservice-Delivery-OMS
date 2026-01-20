
import React, { useMemo } from 'react';
import { MapPin, Navigation, Bike } from 'lucide-react';
import { Vendor, Rider } from '../types';

interface MapVisualizerProps {
  vendors: Vendor[];
  riders?: Rider[];
  userLocation: { lat: number; lng: number } | null;
  aiResults?: string;
}

const MapVisualizer: React.FC<MapVisualizerProps> = ({ vendors, riders = [], userLocation, aiResults }) => {
  // Coordinate Projection Logic
  const { markers, center, scale } = useMemo(() => {
    const points = vendors.map((v, i) => ({ 
      lat: v.location.lat, 
      lng: v.location.lng, 
      label: String.fromCharCode(65 + i), // A, B, C...
      type: 'VENDOR',
      name: v.name,
      category: v.categoryIds[0]
    }));

    riders.filter(r => r.status === 'ONLINE').forEach(r => {
      points.push({
        lat: r.location.lat,
        lng: r.location.lng,
        label: 'R',
        type: 'RIDER',
        name: r.name,
        category: 'Delivery Rider'
      });
    });

    if (userLocation) {
      points.push({ 
        lat: userLocation.lat, 
        lng: userLocation.lng, 
        label: 'YOU', 
        type: 'USER',
        name: 'Your Location',
        category: ''
      });
    }

    if (points.length === 0) return { markers: [], center: { lat: 0, lng: 0 }, scale: { lat: 1, lng: 1 } };

    // Calculate Bounding Box
    const minLat = Math.min(...points.map(p => p.lat));
    const maxLat = Math.max(...points.map(p => p.lat));
    const minLng = Math.min(...points.map(p => p.lng));
    const maxLng = Math.max(...points.map(p => p.lng));

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    const latDiff = Math.max(maxLat - minLat, 0.01) * 2; 
    const lngDiff = Math.max(maxLng - minLng, 0.01) * 2;

    return {
      markers: points,
      center: { lat: centerLat, lng: centerLng },
      scale: { lat: latDiff, lng: lngDiff }
    };
  }, [vendors, riders, userLocation]);

  const getPosition = (lat: number, lng: number) => {
    const x = 50 + ((lng - center.lng) / scale.lng) * 100;
    const y = 50 + ((center.lat - lat) / scale.lat) * 100;
    return {
      left: `${Math.max(5, Math.min(95, x))}%`,
      top: `${Math.max(5, Math.min(95, y))}%`
    };
  };

  return (
    <div className="w-full h-full min-h-[400px] bg-gray-50 relative overflow-hidden border border-gray-300 rounded-lg shadow-inner">
      <div className="absolute inset-0 opacity-10" 
           style={{
             backgroundImage: 'linear-gradient(#9C81A4 1px, transparent 1px), linear-gradient(90deg, #9C81A4 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}>
      </div>

      {markers.map((m, i) => (
         <div 
           key={i} 
           className="absolute flex flex-col items-center cursor-pointer group z-10 hover:z-30 transition-all duration-300"
           style={getPosition(m.lat, m.lng)}
         >
            {m.type === 'USER' ? (
                <>
                    <div className="w-4 h-4 bg-gray-600 rounded-full animate-ping absolute opacity-75"></div>
                    <div className="w-4 h-4 bg-gray-600 rounded-full border-2 border-white shadow-lg z-10"></div>
                </>
            ) : m.type === 'RIDER' ? (
                <div className="relative">
                   <div className="bg-secondary p-1.5 rounded-full shadow-lg border-2 border-white animate-bounce">
                      <Bike className="w-4 h-4 text-white" />
                   </div>
                   <div className="bg-white p-1 rounded shadow text-[10px] font-bold absolute top-full mt-1">
                      {m.name}
                   </div>
                </div>
            ) : (
                <>
                    <div className="relative">
                        <MapPin className="w-10 h-10 text-primary drop-shadow-md group-hover:-translate-y-1 transition-transform" fill="#9C81A4" />
                        <span className="absolute top-2 left-1/2 -translate-x-1/2 text-gray-800 text-xs font-bold">{m.label}</span>
                    </div>
                </>
            )}
         </div>
      ))}

      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
         <button className="bg-white p-2 rounded shadow hover:bg-gray-50" title="Recenter">
           <Navigation className="w-5 h-5 text-primary" />
         </button>
      </div>
      
      {aiResults && (
        <div className="absolute top-4 left-4 right-12 bg-white/95 backdrop-blur shadow-lg rounded-lg p-4 max-h-[150px] overflow-y-auto z-30 text-xs">
            <h3 className="font-bold text-primary mb-1 flex items-center gap-2">
                <span className="text-yellow-500">✦</span> AI Recommendations
            </h3>
            <div className="text-gray-700 whitespace-pre-line">{aiResults}</div>
        </div>
      )}
    </div>
  );
};

export default MapVisualizer;
