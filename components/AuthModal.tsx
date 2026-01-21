
import React, { useState, useEffect } from 'react';
import { X, Loader2, ShoppingBag, Stethoscope, Truck, PartyPopper, Layers, Bike, Smartphone } from 'lucide-react';
import { requestOtp, verifyOtp } from '../services/otpService';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string, role: UserRole, isNewUser: boolean) => void;
  initialMode?: UserRole;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess, initialMode = UserRole.USER }) => {
  const [userType, setUserType] = useState<UserRole>(initialMode);
  const [viewState, setViewState] = useState<'MOBILE_INPUT' | 'OTP' | 'SOCIAL_PENDING'>('MOBILE_INPUT');
  
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState(''); 
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUserType(initialMode);
    setViewState('MOBILE_INPUT');
    setMobile('');
    setEmail('');
    setOtp('');
    setPassword('');
    setIsLoading(false);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    if (userType === UserRole.ADMIN) {
        if (email.trim().toLowerCase() === 'admin' && (password === 'admin' || password === 'admin123')) {
            onLoginSuccess('admin@dahanu.com', UserRole.ADMIN, false);
            onClose();
        } else {
            alert('Invalid Admin Credentials. \nHint: \nUser: admin \nPass: admin123');
        }
        return;
    }

    if (mobile.length < 10) return alert('Enter valid 10-digit mobile number');
    
    setIsLoading(true);
    const result = await requestOtp(mobile, 'recaptcha-container');
    setIsLoading(false);

    if (result.success) {
        setViewState('OTP');
    } else {
        alert(result.message);
    }
  };

  const handleVerify = async () => {
    if (otp.length < 4) return alert('Please enter the OTP');

    setIsLoading(true);
    const result = await verifyOtp(mobile, otp);
    setIsLoading(false);

    if (result.success) {
      const generatedEmail = `${mobile}@${userType.toLowerCase()}.com`;
      onLoginSuccess(generatedEmail, userType, true);
      onClose();
    } else {
      alert(result.message);
    }
  };

  const handleSocialLogin = (provider: 'Google' | 'Microsoft') => {
      setViewState('SOCIAL_PENDING');
      setIsLoading(true);
      setTimeout(() => {
          setIsLoading(false);
          const mockEmail = `${provider.toLowerCase()}_user@gmail.com`;
          onLoginSuccess(mockEmail, UserRole.USER, true);
          onClose();
      }, 2000);
  };

  const renderSocialLinks = () => (
    <div className="space-y-3 mt-6">
        <div className="flex items-center gap-4 text-gray-400 mb-4">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Or continue with</span>
            <div className="h-px bg-gray-200 flex-1"></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
            <button 
                onClick={() => handleSocialLogin('Google')}
                className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-bold text-xs text-gray-700"
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.51 6.16-4.51z" fill="#EA4335"/>
                </svg>
                Google
            </button>
            <button 
                onClick={() => handleSocialLogin('Microsoft')}
                className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-bold text-xs text-gray-700"
            >
                <svg className="w-4 h-4" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z"/>
                    <path fill="#81bc06" d="M12 1h10v10H1z"/>
                    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                    <path fill="#ffba08" d="M12 12h10v10H12z"/>
                </svg>
                Microsoft
            </button>
        </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm md:p-4 animate-fade-in font-sans">
      <div className="bg-white w-full h-full md:h-[528px] md:max-w-3xl md:rounded-lg flex flex-col md:flex-row overflow-hidden relative shadow-2xl">
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-50 p-1 rounded-full transition-colors text-white/90 hover:text-white hover:bg-white/10 md:text-gray-400 md:hover:text-gray-800 md:hover:bg-gray-100"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-full md:w-2/5 h-[35%] md:h-full bg-primary p-6 md:p-10 flex flex-col justify-between text-white relative overflow-hidden shrink-0">
            <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">
                    {userType === UserRole.ADMIN ? 'Admin' : userType === UserRole.RIDER ? 'Rider' : 'Login'}
                </h2>
                <p className="text-base md:text-lg text-white/90 leading-snug font-medium max-w-[80%] md:max-w-full">
                    {userType === UserRole.ADMIN 
                        ? 'System management.' 
                        : userType === UserRole.RIDER 
                        ? 'Access your Delivery Dashboard.'
                        : 'Access Orders, Wishlist & More'}
                </p>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 top-0 flex items-end justify-center pb-6 md:pb-12 pointer-events-none">
                <div className="relative scale-90 md:scale-110 origin-bottom md:origin-center">
                    <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-150"></div>
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm flex items-center justify-center relative">
                         <div className="grid grid-cols-2 gap-3 md:gap-4 p-3 md:p-4">
                            <div className="bg-white/20 p-1.5 md:p-2 rounded-lg flex items-center justify-center">
                                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                            <div className="bg-white/20 p-1.5 md:p-2 rounded-lg flex items-center justify-center">
                                 <Stethoscope className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                            <div className="bg-white/20 p-1.5 md:p-2 rounded-lg flex items-center justify-center">
                                 <Truck className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                            <div className="bg-white/20 p-1.5 md:p-2 rounded-lg flex items-center justify-center">
                                 <PartyPopper className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                         </div>
                         <div className="absolute inset-0 flex items-center justify-center">
                             <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-primary">
                                {userType === UserRole.RIDER ? <Bike className="w-5 h-5 md:w-6 md:h-6 text-primary" /> : <Layers className="w-5 h-5 md:w-6 md:h-6 text-primary" />}
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="w-full md:w-3/5 h-full bg-white p-6 md:p-10 flex flex-col justify-between relative overflow-y-auto no-scrollbar">
            
            <div className="flex-1 flex flex-col">
                {userType !== UserRole.ADMIN && userType !== UserRole.RIDER && (
                    <div className="flex gap-4 md:gap-6 mb-6 md:mb-8 border-b border-gray-200 pb-1 overflow-x-auto no-scrollbar whitespace-nowrap">
                        <button 
                            onClick={() => { setUserType(UserRole.USER); setViewState('MOBILE_INPUT'); }}
                            className={`text-xs md:text-sm font-semibold pb-2 transition-colors ${userType === UserRole.USER ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            Standard User
                        </button>
                        <button 
                            onClick={() => { setUserType(UserRole.VENDOR); setViewState('MOBILE_INPUT'); }}
                            className={`text-xs md:text-sm font-semibold pb-2 transition-colors ${userType === UserRole.VENDOR ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            Business Partner
                        </button>
                    </div>
                )}

                {viewState === 'SOCIAL_PENDING' && (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <p className="font-bold text-gray-800">Redirecting to Secure Login...</p>
                        <p className="text-xs text-gray-400">Verifying your credentials with provider</p>
                    </div>
                )}

                {viewState === 'MOBILE_INPUT' && (
                    <div className="space-y-6 mt-2">
                         {userType === UserRole.ADMIN ? (
                             <>
                                <div className="relative group">
                                     <input 
                                         type="text" 
                                         className="w-full py-2 border-b border-gray-300 focus:border-primary outline-none text-gray-800 transition-colors bg-transparent peer"
                                         value={email}
                                         onChange={(e) => setEmail(e.target.value)}
                                         placeholder=" "
                                     />
                                     <label className="absolute left-0 top-2 text-gray-500 text-sm transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-primary peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:text-xs">Admin ID</label>
                                 </div>
                                 <div className="relative group">
                                     <input 
                                         type="password" 
                                         className="w-full py-2 border-b border-gray-300 focus:border-primary outline-none text-gray-800 transition-colors bg-transparent peer"
                                         value={password}
                                         onChange={(e) => setPassword(e.target.value)}
                                         placeholder=" "
                                     />
                                     <label className="absolute left-0 top-2 text-gray-500 text-sm transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-primary peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:text-xs">Password</label>
                                 </div>
                                 <div className="text-xs text-gray-400">Demo: admin / admin123</div>
                                 <button onClick={handleSendOtp} className="w-full bg-secondary text-white font-bold py-3 rounded-sm shadow-sm hover:bg-orange-600 transition">
                                     Login
                                 </button>
                             </>
                         ) : (
                             <>
                                 <div className="relative group">
                                    <div className="absolute left-0 top-2 text-gray-800 text-sm font-bold pr-2 border-r mr-2">+91</div>
                                    <input 
                                        type="tel" 
                                        className="w-full py-2 pl-12 border-b border-gray-300 focus:border-primary outline-none text-gray-800 transition-colors bg-transparent peer"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                                        maxLength={10}
                                        placeholder=" "
                                    />
                                    <label className="absolute left-12 top-2 text-gray-500 text-sm transition-all peer-focus:-top-3 peer-focus:left-0 peer-focus:text-xs peer-focus:text-primary peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:left-0 peer-not-placeholder-shown:text-xs">Mobile Number</label>
                                 </div>
                                 
                                 <p className="text-[10px] text-gray-400 mt-6 leading-relaxed">
                                    By continuing, you agree to Dahanu Multiservice Platform's <span className="text-primary cursor-pointer">Terms</span> and <span className="text-primary cursor-pointer">Privacy Policy</span>.
                                 </p>

                                 <div id="recaptcha-container"></div>

                                 <button 
                                    onClick={handleSendOtp}
                                    disabled={isLoading}
                                    className="w-full bg-secondary text-white font-bold py-3 rounded-sm shadow-sm hover:bg-orange-600 transition mt-2 flex items-center justify-center gap-2"
                                 >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Smartphone className="w-4 h-4"/>}
                                    {isLoading ? 'Sending...' : 'Request OTP'}
                                 </button>
                                 
                                 {userType === UserRole.USER && renderSocialLinks()}
                             </>
                         )}
                    </div>
                )}

                {viewState === 'OTP' && (
                    <div className="space-y-6 mt-4 animate-fade-in">
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            Verification code sent to <br/>
                            <span className="font-bold text-gray-900">+91 {mobile}</span> 
                            <button onClick={() => { setViewState('MOBILE_INPUT'); setOtp(''); }} className="text-primary ml-2 text-xs font-bold underline">Change</button>
                        </div>

                        <div className="relative group flex justify-center">
                            <input 
                                type="text" 
                                className="w-full max-w-[200px] py-2 border-b-2 border-primary outline-none text-gray-800 transition-colors bg-transparent peer text-center tracking-[0.7em] text-2xl font-black"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                                autoFocus
                                placeholder="0000"
                            />
                        </div>

                        <div className="text-center">
                             <p className="text-xs text-gray-500">Didn't receive code? <button className="text-primary font-bold">Resend</button></p>
                        </div>

                        <button 
                            onClick={handleVerify}
                            disabled={isLoading}
                            className="w-full bg-secondary text-white font-bold py-3 rounded-sm shadow-sm hover:bg-orange-600 transition mt-4 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Layers className="w-4 h-4"/>}
                            {isLoading ? 'Verifying...' : 'Verify & Continue'}
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-8 text-center pb-4 md:pb-0">
                <p className="text-[10px] text-gray-400">© 2024 Dahanu Multiservice. Secure 256-bit SSL encrypted.</p>
            </div>

        </div>
      </div>
    </div>
  );
};

export default AuthModal;
