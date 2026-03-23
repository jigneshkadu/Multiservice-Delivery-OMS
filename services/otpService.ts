
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
 * Resets only the OTP confirmation result, keeping the reCAPTCHA verifier alive.
 */
export const resetAuthContext = () => {
  window.confirmationResult = undefined;
  console.log("Auth context reset (confirmation result cleared)");
};

/**
 * Completely clears the reCAPTCHA verifier. Use this only on fatal errors.
 */
export const clearVerifier = () => {
  console.log('Clearing reCAPTCHA verifier...');
  
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
      console.log("reCAPTCHA verifier instance cleared");
    } catch (e) {
      console.warn("Error clearing reCAPTCHA verifier instance:", e);
    }
    window.recaptchaVerifier = undefined;
  }

  // ALWAYS clear the container HTML to prevent "already rendered" errors
  const container = document.getElementById('recaptcha-container');
  if (container) {
    container.innerHTML = '';
    console.log("reCAPTCHA container HTML cleared");
  }
};

/**
 * Initializes the RecaptchaVerifier as a singleton.
 */
const initVerifier = () => {
  console.log('Initializing reCAPTCHA verifier...');
  console.log(`Current domain: ${window.location.hostname}`);
  // Reuse existing verifier if it's already initialized
  if (window.recaptchaVerifier) {
    console.log('Reusing existing reCAPTCHA verifier');
    return window.recaptchaVerifier;
  }

  const container = document.getElementById('recaptcha-container');
  if (!container) {
    console.error("Recaptcha container not found in DOM! Make sure index.html has <div id=\"recaptcha-container\"></div>");
    return null;
  }

  try {
    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response: any) => {
        console.log("reCAPTCHA solved successfully", response ? "Token received" : "No token");
      },
      'expired-callback': () => {
        console.warn("reCAPTCHA expired, clearing verifier...");
        clearVerifier();
      }
    });
    
    window.recaptchaVerifier = verifier;
    console.log('reCAPTCHA verifier initialized successfully');
    return verifier;
  } catch (error: any) {
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
    console.log(`Requesting OTP for ${phoneNumber}...`);
    
    // CRITICAL: Always clear any existing verifier before a new request
    // to prevent "Security check is already active" or "already rendered" errors.
    clearVerifier();
    resetAuthContext();
    
    // Give the DOM a tiny moment to clear if needed
    await new Promise(resolve => setTimeout(resolve, 100));

    const verifier = initVerifier();
    if (!verifier) {
      return { success: false, message: 'Security verification failed to initialize. Please refresh the page.' };
    }

    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
    console.log(`Attempting to send OTP to: ${formattedPhone}`);

    const result = await signInWithPhoneNumber(auth, formattedPhone, verifier);
    window.confirmationResult = result;
    
    console.log("SMS request accepted by Firebase. Awaiting user input...");
    return { success: true, message: 'OTP sent successfully! Please check your mobile.' };
  } catch (error: any) {
    console.error('Phone Auth Request Error:', error);
    
    // Clear verifier on ANY error to allow a clean retry
    clearVerifier();
    
    const errorCode = error.code || '';
    const rawMessage = error.message || '';
    let errorMessage = `Failed to send OTP: ${rawMessage} (${errorCode})`;

    if (errorCode === 'auth/internal-error') {
      errorMessage = 'Firebase internal error. This often happens if Phone Auth is not enabled or the domain is not authorized.';
    } else if (errorCode === 'auth/unauthorized-domain') {
      errorMessage = `Domain (${window.location.hostname}) is not authorized in your Firebase Console. Please add it to Authentication > Settings > Authorized domains.`;
    } else if (errorCode === 'auth/operation-not-allowed') {
      errorMessage = 'Phone Authentication is DISABLED in your Firebase Console. Please enable it under Authentication > Sign-in method.';
    } else if (errorCode === 'auth/too-many-requests') {
      errorMessage = 'Too many attempts. Please wait a few minutes or try a different number.';
    } else if (errorCode === 'auth/invalid-phone-number') {
      errorMessage = 'The phone number format is invalid. Please enter a 10-digit number.';
    } else if (errorCode === 'auth/quota-exceeded') {
      errorMessage = 'SMS quota for this project has been exceeded. Please check your Firebase billing.';
    } else if (rawMessage.includes('already been rendered') || rawMessage.includes('already active')) {
      errorMessage = 'Security check was already active. We have reset it, please try clicking Continue again.';
    } else if (rawMessage.includes('reCAPTCHA') || errorCode.includes('captcha')) {
      errorMessage = 'Security verification (reCAPTCHA) failed. Please ensure your domain is authorized and you are not blocking scripts.';
    }

    console.warn(`User-friendly error: ${errorMessage}`);
    
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
