
import React, { useState, useEffect } from 'react';
import { 
  X, Loader2, ShieldCheck, ArrowRight, User as UserIcon, 
  Building2, Apple, AlertCircle, ExternalLink, Settings, 
  HelpCircle, Mail, Phone, Smartphone
} from 'lucide-react';
import { requestOtp, verifyOtp, resetAuthContext } from '../services/otpService';
import { 
  auth, 
  db,
  googleProvider, 
  appleProvider, 
  microsoftProvider 
} from "../services/firebaseConfig";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { UserRole } from '../types';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.43-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg viewBox="0 0 23 23" className="w-5 h-5">
    <path fill="#f35325" d="M1 1h10v10H1z"/>
    <path fill="#81bc06" d="M12 1h10v10H12z"/>
    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
    <path fill="#ffba08" d="M12 12h10v10H12z"/>
  </svg>
);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string, role: UserRole, isNewUser: boolean) => void;
  initialMode?: UserRole;
}

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
  const [errorInfo, setErrorInfo] = useState<{message: string, code?: string} | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Clear any existing reCAPTCHA or OTP session when opening the modal
      resetAuthContext();
      
      setUserRole(initialMode);
      setViewState('INPUT');
      setIsSignUp(false);
      setName('');
      setMobile('');
      setEmail('');
      setOtp('');
      setPassword('');
      setErrorInfo(null);
      
      if (initialMode === UserRole.ADMIN) {
        setAuthMethod('EMAIL');
      } else {
        setAuthMethod('MOBILE');
      }
    }
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const saveUserToFirestore = async (firebaseUser: any, role: UserRole) => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || name || 'New User',
        email: firebaseUser.email || `${mobile}@phone.com`,
        phone: firebaseUser.phoneNumber || mobile,
        role: role,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });
      return true; // isNewUser
    } else {
      await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
      return false; // not new user
    }
  };

  const handleAction = async () => {
    setIsLoading(true);
    setErrorInfo(null);
    try {
      if (authMethod === 'MOBILE') {
        if (viewState === 'INPUT') {
            if (!mobile || mobile.length < 10) {
              setErrorInfo({message: "Enter a valid 10-digit mobile number."});
              setIsLoading(false);
              return;
            }
            const result = await requestOtp(mobile);
            if (result.success) {
              setViewState('OTP');
            } else {
              setErrorInfo({message: result.message, code: result.code});
            }
        } else {
            const result = await verifyOtp(otp);
            if (result.success) {
                const isNew = await saveUserToFirestore(result.user, userRole);
                onLoginSuccess(result.user.phoneNumber || `${mobile}@phone.com`, userRole, isNew);
                onClose();
            } else {
                setErrorInfo({message: result.message});
            }
        }
      } 
      else if (authMethod === 'EMAIL') {
          if (isSignUp) {
              const userCred = await createUserWithEmailAndPassword(auth, email, password);
              if (name && userCred.user) await updateProfile(userCred.user, { displayName: name });
              const isNew = await saveUserToFirestore(userCred.user, userRole);
              onLoginSuccess(userCred.user.email!, userRole, isNew);
          } else {
              const userCred = await signInWithEmailAndPassword(auth, email, password);
              const isNew = await saveUserToFirestore(userCred.user, userRole);
              onLoginSuccess(userCred.user.email!, userRole, isNew);
          }
          onClose();
      }
    } catch (error: any) {
      console.error(error);
      setErrorInfo({message: error.message || "Authentication failed.", code: error.code});
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (providerName: 'google' | 'apple' | 'microsoft') => {
    setIsLoading(true);
    setErrorInfo(null);
    try {
      let provider;
      if (providerName === 'google') provider = googleProvider;
      else if (providerName === 'apple') provider = appleProvider;
      else provider = microsoftProvider;

      const result = await signInWithPopup(auth, provider);
      const isNew = await saveUserToFirestore(result.user, userRole);
      onLoginSuccess(result.user.email!, userRole, isNew);
      onClose();
    } catch (error: any) {
      setErrorInfo({message: error.message, code: error.code});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in font-sans">
      <div className="bg-white w-full h-full md:h-auto md:max-w-4xl md:min-h-[620px] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition">
          <X className="w-5 h-5 text-slate-600" />
        </button>

        <div className="w-full md:w-5/12 bg-slate-900 p-10 text-white flex flex-col justify-between shrink-0">
            <div>
                <div className="flex flex-col mb-10" onClick={() => window.location.reload()}>
                    <h1 className="text-4xl font-logo font-bold tracking-tighter text-slate-400 lowercase leading-none cursor-pointer">dahanu</h1>
                    <span className="text-[10px] font-black text-amber-400 tracking-widest uppercase mt-1">Multiservice Platform</span>
                </div>
                
                <h2 className="text-xl font-bold mb-6 text-white/90">
                    {userRole === UserRole.ADMIN ? 'Admin Portal' : (isSignUp ? 'Create Account' : 'Welcome Back')}
                </h2>
                
                {userRole !== UserRole.ADMIN && (
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => setUserRole(UserRole.USER)} 
                            className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all ${userRole === UserRole.USER ? 'bg-slate-600 text-white border-slate-600 shadow-lg' : 'border-white/20 hover:bg-white/10'}`}
                        >
                            <UserIcon className="w-5 h-5"/>
                            <span className="font-bold text-sm">Customer</span>
                        </button>
                        <button 
                            onClick={() => setUserRole(UserRole.VENDOR)} 
                            className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all ${userRole === UserRole.VENDOR ? 'bg-slate-600 text-white border-slate-600 shadow-lg' : 'border-white/20 hover:bg-white/10'}`}
                        >
                            <Building2 className="w-5 h-5"/>
                            <span className="font-bold text-sm">Business Partner</span>
                        </button>
                    </div>
                )}
            </div>
            
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-400"/> Secure Authentication
            </div>
        </div>

        <div className="w-full md:w-7/12 bg-white p-10 flex flex-col justify-center relative overflow-y-auto no-scrollbar">
            <div className="mb-8">
                <h3 className="text-3xl font-black text-slate-900 mb-1">
                  {isSignUp ? 'Sign Up' : 'Log In'}
                </h3>
                <p className="text-slate-500 text-sm font-medium">Access your multiservice dashboard</p>
            </div>

            {errorInfo && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-red-700 leading-relaxed">{errorInfo.message}</p>
              </div>
            )}

            <div className="space-y-4">
                {authMethod === 'MOBILE' && userRole !== UserRole.ADMIN ? (
                    <div className="space-y-4">
                        {viewState === 'INPUT' ? (
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold border-r border-slate-200 pr-3">+91</span>
                                <input 
                                    type="tel" 
                                    className="w-full border-2 rounded-2xl py-4 pl-16 pr-6 focus:ring-4 focus:ring-slate-500/10 border-slate-100 focus:border-slate-500 outline-none transition-all font-bold text-slate-800"
                                    placeholder="Mobile Number"
                                    value={mobile}
                                    maxLength={10}
                                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>
                        ) : (
                            <div className="space-y-4">
                               <input 
                                    type="text" 
                                    className="w-full border-2 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-slate-500/10 border-slate-100 focus:border-slate-500 outline-none transition-all font-bold text-center tracking-[0.5em] text-2xl text-slate-800"
                                    placeholder="000000"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                />
                                <div className="flex flex-col gap-2">
                                    <button 
                                        onClick={handleAction} 
                                        disabled={isLoading || otp.length < 6}
                                        className="w-full bg-slate-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-slate-600/20 hover:bg-slate-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50"
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : <ShieldCheck className="w-5 h-5"/>}
                                        Verify OTP
                                    </button>
                                    <div className="flex justify-between px-2">
                                        <button onClick={() => setViewState('INPUT')} className="text-[10px] font-bold text-slate-500 hover:underline">Change Number</button>
                                        <button 
                                            onClick={() => {
                                                setViewState('INPUT');
                                                setTimeout(() => handleAction(), 100);
                                            }} 
                                            className="text-[10px] font-bold text-slate-600 hover:underline"
                                        >
                                            Resend OTP
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {isSignUp && (
                          <input 
                              type="text" 
                              className="w-full border-2 border-slate-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-slate-500/10 focus:border-slate-500 outline-none font-medium text-slate-800"
                              placeholder="Full Name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                          />
                        )}
                        <input 
                            type="email" 
                            className="w-full border-2 border-slate-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-slate-500/10 focus:border-slate-500 outline-none font-medium text-slate-800"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input 
                            type="password" 
                            className="w-full border-2 border-slate-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-slate-500/10 focus:border-slate-500 outline-none font-medium text-slate-800"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                )}

                {/* Hide the main button when in OTP view since we added a specific one above */}
                {!(authMethod === 'MOBILE' && viewState === 'OTP' && userRole !== UserRole.ADMIN) && (
                    <button 
                        onClick={handleAction}
                        disabled={isLoading}
                        className="w-full bg-slate-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-slate-600/20 hover:bg-slate-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : <ArrowRight className="w-5 h-5"/>}
                        Continue
                    </button>
                )}

                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-bold tracking-widest">Or continue with</span></div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <button 
                        onClick={() => handleSocialLogin('google')}
                        className="flex items-center justify-center py-3 border-2 border-slate-100 rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
                    >
                        <GoogleIcon />
                    </button>
                    <button 
                        onClick={() => handleSocialLogin('apple')}
                        className="flex items-center justify-center py-3 border-2 border-slate-100 rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
                    >
                        <Apple className="w-5 h-5 text-slate-900" />
                    </button>
                    <button 
                        onClick={() => handleSocialLogin('microsoft')}
                        className="flex items-center justify-center py-3 border-2 border-slate-100 rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
                    >
                        <MicrosoftIcon />
                    </button>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-2xl mt-4">
                    <button onClick={() => setAuthMethod('MOBILE')} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${authMethod === 'MOBILE' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>
                        <div className="flex items-center justify-center gap-2">
                            <Smartphone className="w-3 h-3" /> Mobile
                        </div>
                    </button>
                    <button onClick={() => setAuthMethod('EMAIL')} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${authMethod === 'EMAIL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>
                        <div className="flex items-center justify-center gap-2">
                            <Mail className="w-3 h-3" /> Email
                        </div>
                    </button>
                </div>

                <div className="text-center mt-6">
                    <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm font-bold text-slate-500 hover:text-slate-600 transition">
                      {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
