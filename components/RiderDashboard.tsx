
import React, { useState, useEffect } from 'react';
import { Rider, DeliveryTask } from '../types';
import { Bike, Power, MapPin, Package, CheckCircle, Navigation, Loader2 } from 'lucide-react';

interface RiderDashboardProps {
  rider: Rider;
  onUpdateStatus: (status: Rider['status']) => void;
  onUpdateLocation: (lat: number, lng: number) => void;
}

const RiderDashboard: React.FC<RiderDashboardProps> = ({ rider, onUpdateStatus, onUpdateLocation }) => {
  const [tasks, setTasks] = useState<DeliveryTask[]>([]);
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    let interval: any;
    if (rider.status === 'ONLINE') {
      setTracking(true);
      interval = setInterval(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
          onUpdateLocation(pos.coords.latitude, pos.coords.longitude);
        });
      }, 10000); // Update every 10 seconds
    } else {
      setTracking(false);
    }
    return () => clearInterval(interval);
  }, [rider.status]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
            <Bike className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{rider.name}</h1>
            <p className="text-sm text-gray-500">Delivery Partner • {rider.vehicleType}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold ${rider.status === 'ONLINE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
            <Power className="w-4 h-4" />
            {rider.status}
          </div>
          <button 
            onClick={() => onUpdateStatus(rider.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE')}
            className={`px-6 py-2 rounded-lg font-bold shadow transition ${rider.status === 'ONLINE' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-600 text-white hover:bg-green-700'}`}
          >
            Go {rider.status === 'ONLINE' ? 'Offline' : 'Online'}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2"><Package className="w-6 h-6 text-secondary"/> Current Tasks</h2>
          {tasks.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-dashed flex flex-col items-center justify-center text-gray-400">
              <div className="p-4 bg-gray-50 rounded-full mb-4">
                <Loader2 className={`w-8 h-8 ${rider.status === 'ONLINE' ? 'animate-spin' : ''}`} />
              </div>
              <p className="font-medium">{rider.status === 'ONLINE' ? 'Waiting for new orders...' : 'Go Online to receive tasks'}</p>
            </div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-l-secondary">
                {/* Task Card Content */}
              </div>
            ))
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-[#1a1c2e] text-white p-6 rounded-xl shadow-lg">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Navigation className="w-5 h-5 text-yellow-400"/> Live Tracking</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Status</span>
                <span className={tracking ? 'text-green-400' : 'text-gray-500'}>{tracking ? 'Active GPS' : 'Inactive'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Last Lat</span>
                <span>{rider.location.lat.toFixed(4)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Last Lng</span>
                <span>{rider.location.lng.toFixed(4)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
             <h3 className="font-bold text-gray-800 mb-4">Earnings Today</h3>
             <p className="text-3xl font-bold text-green-600">₹0.00</p>
             <p className="text-xs text-gray-400 mt-1">0 Tasks completed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;
