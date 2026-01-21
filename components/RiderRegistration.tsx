
import React, { useState } from 'react';
import { Rider } from '../types';
import { Bike, Phone, User, CheckCircle, Crosshair, Loader2, FileText, Camera, ShieldCheck } from 'lucide-react';

interface RiderRegistrationProps {
  onSubmit: (rider: Partial<Rider>) => void;
  onCancel: () => void;
}

const RiderRegistration: React.FC<RiderRegistrationProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicleType: 'BIKE' as Rider['vehicleType'],
    vehicleName: '',
    vehicleNumber: '',
    licenseNumber: '',
    lat: '',
    lng: ''
  });
  
  const [docs, setDocs] = useState({
    license: null as string | null,
    address: null as string | null
  });

  const [detectingLoc, setDetectingLoc] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (type: 'license' | 'address', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setDocs(prev => ({ ...prev, [type]: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) return alert('Location not supported');
    setDetectingLoc(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData({ ...formData, lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6) });
        setDetectingLoc(false);
      },
      () => {
        setDetectingLoc(false);
        alert('Failed to get location. Using default.');
        setFormData({ ...formData, lat: "19.9700", lng: "72.7300" });
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docs.license || !docs.address) return alert('Please upload required documents (Driving License & Address Proof)');
    
    setIsSubmitting(true);
    setTimeout(() => {
        onSubmit({
            ...formData,
            id: 'rider_' + Date.now(),
            status: 'OFFLINE',
            location: { lat: parseFloat(formData.lat) || 19.97, lng: parseFloat(formData.lng) || 72.73 },
            isApproved: false,
            rating: 5.0,
            licenseProofUrl: docs.license || undefined,
            addressProofUrl: docs.address || undefined
        });
        setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-[#1a1c2e] p-8 text-white">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-secondary rounded-xl text-white shadow-lg">
              <Bike className="w-8 h-8" />
            </div>
            <div>
                <h2 className="text-2xl font-bold">Rider Enrollment</h2>
                <p className="text-gray-400 text-sm">Join Dahanu's largest delivery network</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                <User className="w-4 h-4 text-primary"/> Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase mb-1">Full Name</label>
                <input required className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase mb-1">Mobile Number</label>
                <input required type="tel" className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="9876543210" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                <Bike className="w-4 h-4 text-primary"/> Vehicle & License
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase mb-1">Vehicle Type</label>
                <select className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" value={formData.vehicleType} onChange={e => setFormData({...formData, vehicleType: e.target.value as any})}>
                  <option value="BIKE">Motorbike</option>
                  <option value="SCOOTER">Scooter</option>
                  <option value="CYCLE">Bicycle</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase mb-1">Vehicle Name (Brand/Model)</label>
                <input required className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" value={formData.vehicleName} onChange={e => setFormData({...formData, vehicleName: e.target.value})} placeholder="Hero Splendor / Honda Activa" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase mb-1">Vehicle Registration Number</label>
                <input required className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none uppercase" value={formData.vehicleNumber} onChange={e => setFormData({...formData, vehicleNumber: e.target.value})} placeholder="MH 48 AB 1234" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase mb-1">Driving License Number</label>
                <input required className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none uppercase" value={formData.licenseNumber} onChange={e => setFormData({...formData, licenseNumber: e.target.value})} placeholder="DL-1234567890123" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                <FileText className="w-4 h-4 text-primary"/> Documents (Approval Required)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-500 uppercase">Driving License Proof</label>
                <div className={`relative border-2 border-dashed rounded-xl p-4 transition-all ${docs.license ? 'bg-green-50 border-green-200' : 'border-gray-200 hover:border-primary bg-gray-50'}`}>
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload('license', e)} accept="image/*" />
                    <div className="flex flex-col items-center gap-2">
                        {docs.license ? <CheckCircle className="w-8 h-8 text-green-600"/> : <Camera className="w-8 h-8 text-gray-400"/>}
                        <span className="text-xs font-bold text-gray-600">{docs.license ? 'License Uploaded' : 'Click to Upload License'}</span>
                    </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-500 uppercase">Aadhar / Address Proof</label>
                <div className={`relative border-2 border-dashed rounded-xl p-4 transition-all ${docs.address ? 'bg-green-50 border-green-200' : 'border-gray-200 hover:border-primary bg-gray-50'}`}>
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload('address', e)} accept="image/*" />
                    <div className="flex flex-col items-center gap-2">
                        {docs.address ? <CheckCircle className="w-8 h-8 text-green-600"/> : <Camera className="w-8 h-8 text-gray-400"/>}
                        <span className="text-xs font-bold text-gray-600">{docs.address ? 'Address Proof Uploaded' : 'Click to Upload Aadhar'}</span>
                    </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button type="button" onClick={onCancel} className="flex-1 px-4 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-secondary text-white py-3 rounded-xl font-bold shadow-xl hover:brightness-110 transition flex items-center justify-center gap-2">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin"/> : <ShieldCheck className="w-5 h-5"/>}
              Submit for Admin Approval
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RiderRegistration;
