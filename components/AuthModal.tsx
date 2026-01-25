
import React, { useState, useEffect } from 'react';
import { X, Loader2, ShieldCheck, ArrowRight, User as UserIcon, Building2, Apple } from 'lucide-react';
import { requestOtp, verifyOtp } from '../services/otpService';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string, role: UserRole, isNewUser: boolean) => void;
  initialMode?: UserRole;
}

// Standard Brand Icons as SVGs
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg viewBox="0 0 23 23" className="w-5 h-5">
    <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
    <path fill="#f35325" d="M1 1h10v10H1z"/>
    <path fill="#81bc06" d="M12 1h10v10H12z"/>
    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
    <path fill="#ffba08" d="M12 12h10v10H12z"/>
  </svg>
);

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess, initialMode = UserRole.USER }) => {
  const [userRole, setUserRole] = useState<UserRole>(initialMode);
  const [authMethod, setAuthMethod] = useState<'MOBILE' | 'EMAIL'>('MOBILE');
  const [viewState, setViewState] = useState<'INPUT' | 'OTP'>('INPUT');
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUserRole(initialMode);
      setViewState('INPUT');
      setIsSignUp(false);
      setName('');
      setMobile('');
      setEmail('');
      setOtp('');
      setPassword('');
      // Force Email for Admin
      if (initialMode === UserRole.ADMIN) {
        setAuthMethod('EMAIL');
      } else {
        setAuthMethod('MOBILE');
      }
    }
  }, [initialMode, isOpen]);

  // Sync auth method when role changes manually
  useEffect(() => {
    if (userRole === UserRole.ADMIN) {
      setAuthMethod('EMAIL');
    }
  }, [userRole]);

  if (!isOpen) return null;

  const handleAction = async () => {
    setIsLoading(true);
    try {
      if (authMethod === 'MOBILE' && viewState === 'INPUT') {
          const result = await requestOtp(mobile);
          if (result.success) setViewState('OTP');
          else alert(result.message);
      } 
      else if (authMethod === 'EMAIL') {
          if (isSignUp && !name) {
              alert("Please enter your name to sign up.");
              setIsLoading(false);
              return;
          }
          
          if (userRole === UserRole.ADMIN) {
            if ((email === 'admin@dahanu.com' || email === 'admin') && password === 'admin123') {
              onLoginSuccess('admin@dahanu.com', UserRole.ADMIN, false);
              onClose();
            } else {
              alert("Invalid Admin Credentials. (admin@dahanu.com / admin123)");
            }
          } else {
            // Simulate Firebase Email Auth
            onLoginSuccess(email || 'user@dahanu.com', userRole, isSignUp);
            onClose();
          }
      }
      else if (viewState === 'OTP') {
          const result = await verifyOtp(mobile, otp);
          if (result.success) {
              onLoginSuccess(`${mobile}@dahanu.com`, userRole, true);
              onClose();
          } else alert(result.message);
      }
    } catch (error) {
      alert("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
        onLoginSuccess(`social_${provider}@dahanu.com`, userRole, false);
        onClose();
        setIsLoading(false);
    }, 1000);
  };

  // Only show selection for non-specialist roles on this specific page
  const showPersonaSwitcher = userRole !== UserRole.ADMIN && userRole !== UserRole.RIDER;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in font-sans">
      <div className="bg-white w-full h-full md:h-auto md:max-w-4xl md:min-h-[620px] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
        <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-black/5 rounded-full hover:bg-black/10 transition">
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Left Side: Role Selection (Hidden for Admin/Rider to keep UI clean) */}
        <div className="w-full md:w-5/12 bg-[#1a1c2e] p-10 text-white flex flex-col justify-between overflow-hidden shrink-0">
            <div className="relative z-10">
                <div className="flex flex-col mb-10">
                    <h1 className="text-4xl font-logo font-bold tracking-tighter lowercase leading-none">dahanu</h1>
                    <span className="text-[10px] font-black text-yellow-400 tracking-widest uppercase mt-1">Multi-Service Platform</span>
                </div>
                
                <h2 className="text-xl font-bold mb-6 text-white/90">
                    {userRole === UserRole.ADMIN ? 'Administrator' : userRole === UserRole.RIDER ? 'Logistics Partner' : (isSignUp ? 'Join' : 'Welcome')}
                </h2>
                
                {showPersonaSwitcher && (
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => setUserRole(UserRole.USER)} 
                            className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all ${userRole === UserRole.USER ? 'bg-white text-gray-900 border-white shadow-lg' : 'border-white/20 hover:bg-white/10'}`}
                        >
                            <UserIcon className="w-5 h-5"/>
                            <span className="font-bold text-sm">Customer</span>
                        </button>
                        <button 
                            onClick={() => setUserRole(UserRole.VENDOR)} 
                            className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all ${userRole === UserRole.VENDOR ? 'bg-white text-gray-900 border-white shadow-lg' : 'border-white/20 hover:bg-white/10'}`}
                        >
                            <Building2 className="w-5 h-5"/>
                            <span className="font-bold text-sm">Business Partner</span>
                        </button>
                    </div>
                )}

                {(userRole === UserRole.ADMIN || userRole === UserRole.RIDER) && (
                    <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
                        <p className="text-sm text-white/60 leading-relaxed font-medium">
                            {userRole === UserRole.ADMIN ? 'Authorized personnel only. Accessing this area requires cryptographic keys and administrative credentials.' : 'Deliver joy to the community. Access your dashboard to view active tasks and track earnings.'}
                        </p>
                    </div>
                )}
            </div>
            
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-4 h-4"/> Firebase Protected
            </div>
        </div>

        {/* Right Side: Auth Methods - Lavender Theme */}
        <div className="w-full md:w-7/12 bg-lavender p-10 flex flex-col justify-center overflow-y-auto no-scrollbar">
            <div className="mb-6">
                <h3 className="text-3xl font-black text-white mb-1">
                  {userRole === UserRole.ADMIN ? 'System Portal' : (isSignUp ? 'Create Account' : 'Welcome Back')}
                </h3>
                <p className="text-white/80 font-medium text-sm">
                  {userRole === UserRole.ADMIN ? 'Log in to administrative dashboard' : (isSignUp ? 'Sign up to access all local services.' : 'Sign in to your account to continue.')}
                </p>
            </div>

            {/* Social Login Section (Hide for Admin) */}
            {userRole !== UserRole.ADMIN && (
              <>
                <div className="grid grid-cols-3 gap-3 mb-8">
                    <button 
                      onClick={() => handleSocialLogin('google')}
                      className="flex flex-col items-center justify-center gap-2 p-3 bg-white rounded-2xl hover:bg-gray-50 transition-all active:scale-95 shadow-md"
                    >
                      <GoogleIcon />
                      <span className="text-[10px] font-black text-gray-500 uppercase">Google</span>
                    </button>
                    <button 
                      onClick={() => handleSocialLogin('microsoft')}
                      className="flex flex-col items-center justify-center gap-2 p-3 bg-white rounded-2xl hover:bg-gray-50 transition-all active:scale-95 shadow-md"
                    >
                      <MicrosoftIcon />
                      <span className="text-[10px] font-black text-gray-500 uppercase">Microsoft</span>
                    </button>
                    <button 
                      onClick={() => handleSocialLogin('apple')}
                      className="flex flex-col items-center justify-center gap-2 p-3 bg-white rounded-2xl hover:bg-gray-50 transition-all active:scale-95 shadow-md"
                    >
                      <Apple className="w-5 h-5 text-black" fill="currentColor" />
                      <span className="text-[10px] font-black text-gray-500 uppercase">Apple</span>
                    </button>
                </div>

                <div className="relative mb-8 text-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/20"></div></div>
                    <span className="relative px-4 bg-lavender text-[10px] font-black text-white uppercase tracking-[0.2em]">Or use direct method</span>
                </div>
              </>
            )}

            {/* Manual Login Toggles (Hide for Admin as Admin is Email only) */}
            {userRole !== UserRole.ADMIN && (
              <div className="flex bg-white/10 p-1 rounded-2xl mb-6 border border-white/20">
                  <button onClick={() => setAuthMethod('MOBILE')} className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${authMethod === 'MOBILE' ? 'bg-white text-gray-900 shadow-xl' : 'text-white'}`}>
                      Mobile OTP
                  </button>
                  <button onClick={() => setAuthMethod('EMAIL')} className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${authMethod === 'EMAIL' ? 'bg-white text-gray-900 shadow-xl' : 'text-white'}`}>
                      Email ID
                  </button>
              </div>
            )}

            {/* Inputs */}
            <div className="space-y-4">
                {authMethod === 'MOBILE' && userRole !== UserRole.ADMIN ? (
                    <div className="space-y-1">
                        {viewState === 'INPUT' ? (
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold border-r pr-3">+91</span>
                                <input 
                                    type="tel" 
                                    className="w-full bg-white rounded-2xl py-4 pl-16 pr-6 focus:ring-4 focus:ring-white/20 outline-none transition-all font-bold"
                                    placeholder="Mobile Number"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                />
                            </div>
                        ) : (
                            <input 
                                type="text" 
                                className="w-full bg-white rounded-2xl py-4 px-6 focus:ring-4 focus:ring-white/20 outline-none transition-all font-bold text-center tracking-[0.5em] text-xl"
                                placeholder="0000"
                                maxLength={4}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        )}
                    </div>
                ) : (
                    <>
                        {isSignUp && userRole !== UserRole.ADMIN && (
                          <input 
                              type="text" 
                              className="w-full bg-white rounded-2xl py-4 px-6 focus:ring-4 focus:ring-white/20 outline-none font-medium"
                              placeholder="Full Name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                          />
                        )}
                        <input 
                            type="email" 
                            className="w-full bg-white rounded-2xl py-4 px-6 focus:ring-4 focus:ring-white/20 outline-none font-medium"
                            placeholder={userRole === UserRole.ADMIN ? "Admin Email (admin@dahanu.com)" : "Email Address"}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input 
                            type="password" 
                            className="w-full bg-white rounded-2xl py-4 px-6 focus:ring-4 focus:ring-white/20 outline-none font-medium"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </>
                )}

                <button 
                    onClick={handleAction}
                    disabled={isLoading}
                    className="w-full bg-[#1a1c2e] text-white font-black py-4 rounded-2xl shadow-2xl hover:brightness-125 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : <ArrowRight className="w-5 h-5"/>}
                    {viewState === 'OTP' ? 'Verify OTP' : (userRole === UserRole.ADMIN ? 'Enter System' : (isSignUp ? 'Create Account' : 'Continue'))}
                </button>

                {userRole !== UserRole.ADMIN && (
                  <div className="text-center mt-6">
                    {isSignUp ? (
                      <p className="text-sm text-white font-medium">
                        Already have an account?{' '}
                        <button onClick={() => setIsSignUp(false)} className="font-black underline underline-offset-4 decoration-2">Sign In</button>
                      </p>
                    ) : (
                      <p className="text-sm text-white font-medium">
                        Don't have an account?{' '}
                        <button onClick={() => setIsSignUp(true)} className="font-black underline underline-offset-4 decoration-2">Sign Up</button>
                      </p>
                    )}
                  </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
