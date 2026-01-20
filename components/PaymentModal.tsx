
import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building, ShieldCheck, Loader2, CheckCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  title: string;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, amount, title, onSuccess }) => {
  const [method, setMethod] = useState<'UPI' | 'CARD' | 'NET'>('UPI');
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'SELECT' | 'PROCESSING' | 'SUCCESS'>('SELECT');

  if (!isOpen) return null;

  const handlePay = () => {
    setStep('PROCESSING');
    setProcessing(true);
    
    // Simulate Gateway Delay
    setTimeout(() => {
        setProcessing(false);
        setStep('SUCCESS');
        
        // Auto close after success animation
        setTimeout(() => {
            onSuccess();
        }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-[#1a1c2e] text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-400" />
                <span className="font-bold tracking-wide">Secure Payment</span>
            </div>
            <button onClick={onClose} disabled={processing} className="hover:bg-white/10 p-1 rounded transition">
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Content */}
        <div className="p-6">
            <div className="text-center mb-6">
                <p className="text-gray-500 text-sm uppercase font-bold tracking-wider mb-1">Total Payable</p>
                <h2 className="text-4xl font-bold text-gray-800">₹{amount.toLocaleString()}</h2>
                <p className="text-xs text-gray-400 mt-1">{title}</p>
            </div>

            {step === 'SELECT' && (
                <>
                    <div className="space-y-3 mb-6">
                        <button 
                            onClick={() => setMethod('UPI')}
                            className={`w-full flex items-center gap-4 p-3 rounded-lg border-2 transition-all ${method === 'UPI' ? 'border-secondary bg-orange-50' : 'border-gray-100 hover:border-gray-300'}`}
                        >
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-green-600">
                                <Smartphone className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-gray-800 text-sm">UPI / QR Code</p>
                                <p className="text-xs text-gray-500">GooglePay, PhonePe, Paytm</p>
                            </div>
                            {method === 'UPI' && <div className="ml-auto w-4 h-4 rounded-full bg-secondary"></div>}
                        </button>

                        <button 
                            onClick={() => setMethod('CARD')}
                            className={`w-full flex items-center gap-4 p-3 rounded-lg border-2 transition-all ${method === 'CARD' ? 'border-secondary bg-orange-50' : 'border-gray-100 hover:border-gray-300'}`}
                        >
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-gray-800 text-sm">Credit / Debit Card</p>
                                <p className="text-xs text-gray-500">Visa, Mastercard, RuPay</p>
                            </div>
                            {method === 'CARD' && <div className="ml-auto w-4 h-4 rounded-full bg-secondary"></div>}
                        </button>

                        <button 
                            onClick={() => setMethod('NET')}
                            className={`w-full flex items-center gap-4 p-3 rounded-lg border-2 transition-all ${method === 'NET' ? 'border-secondary bg-orange-50' : 'border-gray-100 hover:border-gray-300'}`}
                        >
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-purple-600">
                                <Building className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-gray-800 text-sm">Net Banking</p>
                                <p className="text-xs text-gray-500">All Indian Banks</p>
                            </div>
                            {method === 'NET' && <div className="ml-auto w-4 h-4 rounded-full bg-secondary"></div>}
                        </button>
                    </div>

                    <button 
                        onClick={handlePay}
                        className="w-full bg-green-600 text-white py-3.5 rounded-lg font-bold shadow-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                        PAY ₹{amount}
                    </button>
                </>
            )}

            {step === 'PROCESSING' && (
                <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="w-16 h-16 text-secondary animate-spin mb-4" />
                    <h3 className="text-lg font-bold text-gray-800">Processing Payment...</h3>
                    <p className="text-sm text-gray-500">Please do not close this window</p>
                </div>
            )}

            {step === 'SUCCESS' && (
                <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Payment Successful!</h3>
                    <p className="text-sm text-gray-500">Redirecting...</p>
                </div>
            )}
            
            <div className="mt-6 border-t pt-4 text-center">
                <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> 100% Safe & Secure Payments via Razorpay/Stripe Mock
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
