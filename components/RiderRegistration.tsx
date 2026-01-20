
import React, { useState } from 'react';
import { Rider } from '../types';
import { Bike, Phone, User, CheckCircle, Crosshair, Loader2 } from 'lucide-react';

interface RiderRegistrationProps {
  onSubmit: (rider: Partial<Rider>) => void;
  onCancel: () => void;
}

const RiderRegistration: React.FC<RiderRegistrationProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicleType: 'BIKE' as Rider['vehicleType'],
    lat: '',
    lng: ''
  });
  const [detectingLoc, setDetectingLoc] = useState(false);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) return alert('Not supported');
    setDetectingLoc(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData({ ...formData, lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6) });
        setDetectingLoc(false);
      },
      () => setDetectingLoc(false)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: 'rider_' + Math.random().toString(36).substr(2, 9),
      status: 'OFFLINE',
      location: { lat: parseFloat(formData.lat) || 0, lng: parseFloat(formData.lng) || 0 },
      isApproved: false,
      rating: 5.0
    });
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md border max-w-lg mx-auto my-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-secondary/10 rounded-full text-secondary">
          <Bike className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Become a Delivery Rider</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <div className="mt-1 relative">
            <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input required className="block w-full border rounded-md py-2 pl-10 pr-3 focus:ring-primary" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
          <div className="mt-1 relative">
            <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input required type="tel" className="block w-full border rounded-md py-2 pl-10 pr-3 focus:ring-primary" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
          <select className="mt-1 block w-full border rounded-md py-2 px-3" value={formData.vehicleType} onChange={e => setFormData({...formData, vehicleType: e.target.value as any})}>
            <option value="BIKE">Motorbike</option>
            <option value="SCOOTER">Scooter</option>
            <option value="CYCLE">Bicycle</option>
          </select>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-gray-700">Live Location</label>
            <button type="button" onClick={handleDetectLocation} className="text-xs bg-white border px-3 py-1 rounded flex items-center gap-1 hover:bg-gray-100">
              {detectingLoc ? <Loader2 className="w-3 h-3 animate-spin"/> : <Crosshair className="w-3 h-3"/>}
              Set Current
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input readOnly placeholder="Lat" className="border rounded px-2 py-1 text-xs bg-gray-100" value={formData.lat} />
            <input readOnly placeholder="Lng" className="border rounded px-2 py-1 text-xs bg-gray-100" value={formData.lng} />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
          <button type="submit" className="flex-1 bg-secondary text-white py-2 rounded font-bold shadow hover:brightness-110">Register</button>
        </div>
      </form>
    </div>
  );
};

export default RiderRegistration;
