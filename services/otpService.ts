
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult 
} from "firebase/auth";
import { auth } from "./firebaseConfig";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
    confirmationResult: ConfirmationResult | undefined;
  }
}

/**
 * Completely resets the reCAPTCHA DOM and instance.
 */
export const resetAuthContext = () => {
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = undefined;
    } catch (e) {
      console.warn("Recaptcha cleanup error:", e);
    }
  }
  
  const container = document.getElementById('recaptcha-container');
  if (container) {
    container.innerHTML = '';
  }
  
  window.confirmationResult = undefined;
};

/**
 * Initializes the RecaptchaVerifier.
 */
const initVerifier = () => {
  const container = document.getElementById('recaptcha-container');
  if (!container) {
    console.error("Recaptcha container not found in DOM");
    return null;
  }

  try {
    const verifier = new RecaptchaVerifier(auth, container, {
      'size': 'invisible',
      'callback': () => {
        console.log("reCAPTCHA solved");
      },
      'expired-callback': () => {
        console.warn("reCAPTCHA expired, resetting...");
        resetAuthContext();
      }
    });
    
    window.recaptchaVerifier = verifier;
    return verifier;
  } catch (error) {
    console.error("RecaptchaVerifier initialization failed:", error);
    return null;
  }
};

/**
 * Sends OTP to the provided phone number.
 */
export const requestOtp = async (
  phoneNumber: string
): Promise<{ success: boolean; message: string; code?: string }> => {
  try {
    resetAuthContext();
    
    const verifier = initVerifier();
    if (!verifier) {
      return { success: false, message: 'Security verification failed to initialize.' };
    }

    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

    const result = await signInWithPhoneNumber(auth, formattedPhone, verifier);
    window.confirmationResult = result;
    
    return { success: true, message: 'OTP sent successfully!' };
  } catch (error: any) {
    console.error('Phone Auth Request Error:', error);
    
    const errorCode = error.code || '';
    let errorMessage = 'Security check failed. Please try again.';

    if (errorCode === 'auth/internal-error') {
      errorMessage = 'Internal Error: Please ensure your domain is authorized and Phone Auth is configured correctly in Firebase Console.';
    } else if (errorCode === 'auth/unauthorized-domain') {
      errorMessage = 'This domain is not authorized for authentication.';
    } else if (errorCode === 'auth/too-many-requests') {
      errorMessage = 'Too many attempts. Please try again later.';
    } else if (errorCode === 'auth/invalid-phone-number') {
      errorMessage = 'The phone number provided is not valid.';
    }

    resetAuthContext();
    
    return { 
      success: false, 
      message: errorMessage, 
      code: errorCode 
    };
  }
};

/**
 * Verifies the OTP code.
 */
export const verifyOtp = async (
  otp: string
): Promise<{ success: boolean; user?: any; message: string }> => {
  try {
    if (!window.confirmationResult) {
      return { success: false, message: 'No active session. Please request a new OTP.' };
    }

    const result = await window.confirmationResult.confirm(otp);
    resetAuthContext();
    
    return { 
      success: true, 
      user: result.user, 
      message: 'Verified successfully' 
    };
  } catch (error: any) {
    console.error('OTP Verification Error:', error);
    let msg = 'Invalid OTP code. Please check and try again.';
    if (error.code === 'auth/code-expired') msg = 'OTP code has expired.';
    return { success: false, message: msg };
  }
};
