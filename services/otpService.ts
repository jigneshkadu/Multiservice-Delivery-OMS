
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
 * Resets the confirmation result and clears the verifier to prevent "already rendered" errors.
 */
export const resetAuthContext = () => {
  window.confirmationResult = undefined;
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = undefined;
    } catch (e) {
      console.warn("Error clearing reCAPTCHA verifier:", e);
    }
  }
  
  // Also clear the container HTML just in case
  const container = document.getElementById('recaptcha-container');
  if (container) {
    container.innerHTML = '';
  }
};

/**
 * Initializes the RecaptchaVerifier as a singleton.
 */
const initVerifier = () => {
  // Debug log to help user verify their config
  console.log("Initializing reCAPTCHA for Project:", auth.config.apiKey.substring(0, 10) + "...");

  // If it already exists, use it.
  if (window.recaptchaVerifier) {
    return window.recaptchaVerifier;
  }

  const container = document.getElementById('recaptcha-container');
  if (!container) {
    console.error("Recaptcha container not found in DOM");
    return null;
  }

  // Ensure container is clean
  container.innerHTML = '';
  
  try {
    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': () => {
        console.log("reCAPTCHA solved");
      },
      'expired-callback': () => {
        console.warn("reCAPTCHA expired");
        resetAuthContext();
      }
    });
    
    window.recaptchaVerifier = verifier;
    return verifier;
  } catch (error: any) {
    console.error("RecaptchaVerifier initialization failed:", error);
    // If it's already rendered, we might have a global state issue.
    // Try to reset and return null so the caller can handle it.
    resetAuthContext();
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
    // Don't reset the whole context, just the confirmation result
    resetAuthContext();
    
    const verifier = initVerifier();
    if (!verifier) {
      return { success: false, message: 'Security verification failed to initialize.' };
    }

    // Explicitly render the verifier to ensure it's ready
    try {
      await verifier.render();
      console.log("reCAPTCHA verifier rendered successfully");
    } catch (renderError) {
      console.warn("reCAPTCHA render warning (might already be rendered):", renderError);
    }

    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
    console.log(`Attempting to send OTP to: ${formattedPhone}`);

    const result = await signInWithPhoneNumber(auth, formattedPhone, verifier);
    window.confirmationResult = result;
    
    console.log("SMS request accepted by Firebase. Waiting for delivery...");
    return { success: true, message: 'OTP sent successfully!' };
  } catch (error: any) {
    console.error('Phone Auth Request Error:', error);
    // ... rest of the error handling remains the same
    
    const errorCode = error.code || '';
    const rawMessage = error.message || '';
    let errorMessage = `Security check failed: ${rawMessage} (${errorCode})`;

    if (errorCode === 'auth/internal-error') {
      errorMessage = 'Internal Error: Please ensure your domain is authorized and Phone Auth is configured correctly in Firebase Console.';
    } else if (errorCode === 'auth/unauthorized-domain') {
      errorMessage = `This domain (${window.location.hostname}) is not authorized for authentication. Please add it to the Authorized Domains in Firebase Console.`;
    } else if (errorCode === 'auth/operation-not-allowed') {
      errorMessage = 'Phone Authentication is not enabled in your Firebase Console. Please enable it under Authentication > Sign-in method.';
    } else if (errorCode === 'auth/too-many-requests') {
      errorMessage = 'Too many attempts. Please try again later.';
    } else if (errorCode === 'auth/invalid-phone-number') {
      errorMessage = 'The phone number provided is not valid.';
    } else if (errorCode === 'auth/captcha-check-failed') {
      errorMessage = 'reCAPTCHA verification failed. Please try again.';
    } else if (rawMessage.includes('already been rendered')) {
      errorMessage = 'reCAPTCHA error. Please refresh the page and try again.';
      resetAuthContext();
    }

    // On error, clear the context to try fresh next time
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
