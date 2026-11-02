import { API_V1_BASE_URL } from '../config/api';

declare global {
  interface Window {
    Cashfree?: (options: { mode: 'sandbox' | 'production' }) => {
      checkout: (options: {
        paymentSessionId: string;
        redirectTarget?: '_self' | '_blank' | '_top' | '_modal';
        returnUrl?: string;
      }) => Promise<any>;
    };
    // Kept for backward compatibility if any legacy scripts attach
    Razorpay?: any;
  }
}

export interface CashfreeOrderResponse {
  success: boolean;
  order: {
    order_id: string;
    payment_session_id: string;
    environment: 'sandbox' | 'production';
    app_id: string;
    amount: number;
    amount_due_today?: number;
    trial_days?: number;
    is_trial?: boolean;
    first_charge_date?: string;
    first_charge_amount?: number;
    currency: string;
    plan_id: string;
    plan_name: string;
    user_name: string;
    user_email: string;
    user_phone: string;
    is_subscription?: boolean;
  };
}

// Backward compatibility alias for RazorpayOrderResponse
export type RazorpayOrderResponse = CashfreeOrderResponse;

export interface VerifyPaymentPayload {
  order_id?: string;
  signature?: string;
  cashfree_order_id?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
}

/**
 * Loads Cashfree Web SDK v3 if not already in window
 */
export const loadCashfreeScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      return resolve(false);
    }
    if (window.Cashfree) {
      return resolve(true);
    }

    // Check if script element already exists
    const existing = document.querySelector('script[src="https://sdk.cashfree.com/js/v3/cashfree.js"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Cashfree Payment Gateway SDK');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Backward compatible alias for loading script
 */
export const loadRazorpayScript = loadCashfreeScript;

/**
 * Creates a payment order on backend with Cashfree
 */
export const createPaymentOrderApi = async (
  planId: string = 'premium_monthly'
): Promise<CashfreeOrderResponse['order']> => {
  const token = localStorage.getItem('auth_token') || localStorage.getItem('access_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_V1_BASE_URL}/payments/create-order`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify({ plan_id: planId }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data?.detail?.message || data?.message || 'Failed to initialize payment');
  }

  return data.order;
};

/**
 * Verifies payment status with backend after Cashfree checkout
 */
export const verifyPaymentApi = async (payload: VerifyPaymentPayload): Promise<any> => {
  const token = localStorage.getItem('auth_token') || localStorage.getItem('access_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_V1_BASE_URL}/payments/verify`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data?.detail?.message || data?.message || 'Payment verification failed');
  }

  return data;
};

/**
 * Opens Cashfree Checkout modal or handles drop-in redirect
 */
export const launchCashfreeCheckout = async (options: {
  planId?: string;
  onSuccess?: (paymentResult: any) => void;
  onError?: (err: any) => void;
  onClose?: () => void;
}) => {
  const isLoaded = await loadCashfreeScript();
  if (!isLoaded || typeof window.Cashfree !== 'function') {
    alert('Unable to load Cashfree payment gateway. Please check your internet connection.');
    if (options.onError) options.onError(new Error('SDK load error'));
    return;
  }

  try {
    const order = await createPaymentOrderApi(options.planId || 'premium_monthly');

    if (!order.payment_session_id) {
      throw new Error('Payment session could not be established with Cashfree.');
    }

    const cashfree = window.Cashfree({
      mode: order.environment === 'production' ? 'production' : 'sandbox',
    });

    cashfree
      .checkout({
        paymentSessionId: order.payment_session_id,
        redirectTarget: '_modal',
      })
      .then(async (result: any) => {
        if (result?.error) {
          console.warn('Cashfree payment dismissed or error:', result.error);
          if (options.onClose) options.onClose();
          if (options.onError) options.onError(result.error);
          return;
        }

        // Cashfree modal completed or closed -> verify order status with backend
        try {
          const verifyResult = await verifyPaymentApi({
            order_id: order.order_id,
          });
          if (options.onSuccess) options.onSuccess(verifyResult);
        } catch (verErr: any) {
          console.warn('Payment verification checking result:', verErr);
          if (options.onClose) options.onClose();
        }
      })
      .catch((err: any) => {
        console.error('Cashfree checkout modal error:', err);
        if (options.onError) options.onError(err);
      });
  } catch (err: any) {
    console.error('Payment checkout initiation failed:', err);
    alert(err?.message || 'Could not initiate payment. Please make sure you are logged in.');
    if (options.onError) options.onError(err);
  }
};

// Backward compatibility alias for launchRazorpayCheckout
export const launchRazorpayCheckout = launchCashfreeCheckout;

export interface SubscriptionStatus {
  is_premium: boolean;
  premium_until?: string | null;
  has_subscription: boolean;
  subscription_id?: string | null;
  plan_id: string;
  plan_name: string;
  amount: number;
  currency: string;
  status: string; // 'active', 'cancelled', 'completed', 'expired', 'none'
  is_cancelled: boolean;
  created_at?: string | null;
  is_in_trial?: boolean;
  trial_days?: number;
  trial_ends_at?: string | null;
  days_left_in_trial?: number;
  first_charge_date?: string | null;
  first_charge_amount?: number;
}

/**
 * Activates an immediate 30-day Free Trial of TrueMarriage PRO
 */
export const startFreeTrialApi = async (): Promise<{
  success: boolean;
  message: string;
  trial: {
    is_premium: boolean;
    premium_until: string;
    trial_days: number;
    is_in_trial: boolean;
    days_left_in_trial: number;
  };
}> => {
  const token = localStorage.getItem('auth_token') || localStorage.getItem('access_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_V1_BASE_URL}/payments/start-free-trial`, {
    method: 'POST',
    headers,
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data?.detail?.message || data?.message || 'Failed to activate 30-day free trial');
  }

  return data;
};

/**
 * Fetches the user's active recurring subscription details
 */
export const getSubscriptionStatusApi = async (): Promise<SubscriptionStatus> => {
  const token = localStorage.getItem('auth_token') || localStorage.getItem('access_token');
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_V1_BASE_URL}/payments/subscription-status`, {
    headers,
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data?.detail?.message || data?.message || 'Failed to fetch subscription status');
  }

  return data.subscription;
};

/**
 * Cancels recurring monthly auto-renewal for the user's subscription
 */
export const cancelSubscriptionApi = async (): Promise<{
  success: boolean;
  message: string;
  subscription: SubscriptionStatus;
}> => {
  const token = localStorage.getItem('auth_token') || localStorage.getItem('access_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_V1_BASE_URL}/payments/cancel-subscription`, {
    method: 'POST',
    headers,
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data?.detail?.message || data?.message || 'Failed to cancel subscription');
  }

  return data;
};
