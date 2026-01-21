
import React, { useState } from 'react';
import { Vendor, Product } from '../types';
import { X, Plus, Minus, ShoppingBag, Truck, CheckCircle, CreditCard, FileText, Printer, Download } from 'lucide-react';
import PaymentModal from './PaymentModal';

interface DeliveryOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor;
  onPlaceOrder: (items: { product: Product, quantity: number }[], total: number, orderId: string) => void;
}

const DeliveryOrderModal: React.FC<DeliveryOrderModalProps> = ({ isOpen, onClose, vendor, onPlaceOrder }) => {
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [lastOrderId, setLastOrderId] = useState('');
  const [viewInvoice, setViewInvoice] = useState(false);

  if (!isOpen) return null;

  const handleQuantityChange = (productName: string, change: number) => {
    setCart(prev => {
      const currentQty = prev[productName] || 0;
      const newQty = Math.max(0, currentQty + change);
      const newCart = { ...prev, [productName]: newQty };
      if (newQty === 0) delete newCart[productName];
      return newCart;
    });
  };

  const calculateTotal = () => {
    let total = 0;
    vendor.products?.forEach(p => {
        const qty = cart[p.name] || 0;
        total += qty * p.price;
    });
    return total;
  };

  const totalAmount = calculateTotal();
  const cartItemCount = Object.values(cart).reduce((a: number, b: number) => a + b, 0);

  const handleProceed = () => {
    if (totalAmount <= 0) return;
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
      setShowPayment(false);
      const newOrderId = 'ORD-' + Math.floor(Math.random() * 90000 + 10000);
      setLastOrderId(newOrderId);
      
      const orderItems = vendor.products
        ?.filter(p => cart[p.name])
        .map(p => ({ product: p, quantity: cart[p.name] })) || [];

      setIsSuccess(true);
      
      setTimeout(() => {
          onPlaceOrder(orderItems, totalAmount, newOrderId);
      }, 500);
  };

  if (viewInvoice) {
      return (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in font-sans">
              <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
                  <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
                      <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center font-black text-xs">d</div>
                          <h2 className="font-bold text-lg">Order Invoice</h2>
                      </div>
                      <button onClick={onClose}><X className="w-6 h-6"/></button>
                  </div>
                  <div className="p-8 space-y-6">
                      <div className="flex justify-between border-b pb-4">
                          <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</p>
                              <p className="font-mono font-bold text-gray-900">{lastOrderId}</p>
                          </div>
                          <div className="text-right">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</p>
                              <p className="font-bold text-gray-900">{new Date().toLocaleDateString()}</p>
                          </div>
                      </div>

                      <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Merchant</p>
                          <p className="font-bold text-gray-900">{vendor.name}</p>
                          <p className="text-xs text-gray-500">{vendor.location.address}</p>
                      </div>

                      <div className="space-y-3">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Item Summary</p>
                          {Object.entries(cart).map(([name, qty]) => {
                             const p = vendor.products?.find(pr => pr.name === name);
                             return (
                                 <div key={name} className="flex justify-between text-sm">
                                     <span className="text-gray-700">{qty}x {name}</span>
                                     <span className="font-bold">₹{(qty as number) * (p?.price || 0)}</span>
                                 </div>
                             );
                          })}
                      </div>

                      <div className="border-t pt-4 space-y-2">
                          <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Subtotal</span>
                              <span className="font-bold">₹{totalAmount}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Delivery Fee</span>
                              <span className="text-green-600 font-bold">FREE</span>
                          </div>
                          <div className="flex justify-between text-xl font-black text-gray-900 pt-2 border-t border-dashed">
                              <span>Total Paid</span>
                              <span>₹{totalAmount}</span>
                          </div>
                      </div>

                      <div className="pt-6 grid grid-cols-2 gap-3">
                          <button onClick={() => window.print()} className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 text-sm font-bold hover:bg-gray-50">
                              <Printer className="w-4 h-4" /> Print
                          </button>
                          <button onClick={() => alert('Invoice Downloaded (Simulated)')} className="flex items-center justify-center gap-2 bg-gray-900 text-white rounded-xl py-3 text-sm font-bold">
                              <Download className="w-4 h-4" /> Download
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  if (isSuccess) {
      return (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
                  <p className="text-center text-gray-500 mb-2">Order ID: <span className="font-mono font-bold text-gray-900">{lastOrderId}</span></p>
                  <p className="text-center text-xs text-gray-400 mb-8 leading-relaxed">Your delivery request has been sent to {vendor.name}. Track your order in the dashboard.</p>
                  
                  <div className="w-full space-y-3">
                      <button onClick={() => setViewInvoice(true)} className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
                          <FileText className="w-4 h-4"/> View Invoice
                      </button>
                      <button onClick={onClose} className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-bold">
                          Back to Home
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm md:p-4 animate-fade-in font-sans">
      
      {showPayment && (
          <PaymentModal 
             isOpen={showPayment}
             onClose={() => setShowPayment(false)}
             amount={totalAmount}
             title={`Order from ${vendor.name}`}
             onSuccess={handlePaymentSuccess}
          />
      )}

      <div className="bg-white w-full h-full md:h-[90vh] md:max-w-5xl md:rounded-xl flex flex-col md:flex-row overflow-hidden relative shadow-2xl">
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-50 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50">
            <div className="p-6 bg-white border-b shadow-sm z-10">
                <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-1">
                    <Truck className="w-4 h-4" /> Dahanu Delivery
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{vendor.name}</h2>
                <p className="text-sm text-gray-500">{vendor.description}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar">
                <h3 className="font-bold text-gray-700 mb-4">Fresh Arrivals</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {vendor.products?.map((product, idx) => {
                        const qty = cart[product.name] || 0;
                        return (
                            <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition group">
                                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                                    <img 
                                      src={product.image || `https://picsum.photos/300/200?random=${idx + 100}`} 
                                      alt={product.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-3 flex flex-col flex-1">
                                    <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 leading-tight mb-1" title={product.name}>{product.name}</h4>
                                    <p className="text-lg font-bold text-gray-900 mt-auto">₹{product.price}</p>
                                    
                                    <div className="mt-3">
                                        {qty > 0 ? (
                                            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded overflow-hidden">
                                                <button onClick={() => handleQuantityChange(product.name, -1)} className="px-3 py-1 text-green-700 hover:bg-green-100 font-bold">-</button>
                                                <span className="font-bold text-sm text-green-800">{qty}</span>
                                                <button onClick={() => handleQuantityChange(product.name, 1)} className="px-3 py-1 text-green-700 hover:bg-green-100 font-bold">+</button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => handleQuantityChange(product.name, 1)}
                                                className="w-full py-1.5 bg-white border border-yellow-400 rounded text-xs font-bold text-gray-700 shadow-sm hover:bg-yellow-50 transition uppercase"
                                            >
                                                Add
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

        <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l shadow-2xl z-20 flex flex-col">
            <div className="p-5 bg-primary/5 border-b">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" /> Your Basket
                </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
                {cartItemCount === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
                        <ShoppingBag className="w-12 h-12 mb-2 opacity-20" />
                        <p>Your basket is empty</p>
                        <p className="text-xs">Add items to place order</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {Object.entries(cart).map(([name, qty]) => {
                             const quantity = qty as number;
                             const prod = vendor.products?.find(p => p.name === name);
                             if (!prod) return null;
                             return (
                                 <div key={name} className="flex gap-2 text-sm border-b pb-2 animate-fade-in">
                                     <div className="w-12 h-12 bg-gray-100 rounded shrink-0 overflow-hidden">
                                        <img src={prod.image || 'https://via.placeholder.com/50'} className="w-full h-full object-cover" />
                                     </div>
                                     <div className="flex-1 min-w-0">
                                         <span className="font-medium text-gray-800 line-clamp-1">{name}</span>
                                         <div className="text-xs text-gray-500">{quantity} x ₹{prod.price}</div>
                                         <div className="font-bold text-gray-700 mt-1">₹{quantity * prod.price}</div>
                                     </div>
                                 </div>
                             );
                        })}
                    </div>
                )}
            </div>

            <div className="p-5 bg-gray-50 border-t space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Item Total</span>
                    <span className="font-bold">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-bold text-green-600">FREE</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between items-center text-lg font-bold text-gray-900">
                    <span>To Pay</span>
                    <span>₹{totalAmount}</span>
                </div>
                
                <button 
                    onClick={handleProceed}
                    disabled={totalAmount === 0}
                    className="w-full bg-secondary text-white py-3 rounded-lg font-bold shadow hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex justify-between px-6 items-center"
                >
                    <span className="flex items-center gap-2"><CreditCard className="w-4 h-4"/> Checkout</span>
                    <span>₹{totalAmount}</span>
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default DeliveryOrderModal;
