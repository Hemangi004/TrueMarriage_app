import { API_V1_BASE_URL } from '../config/api';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export interface RazorpayOrderResponse {
  success: boolean;
  order: {
    key_id: string;
    order_id?: string;
    subscription_id?: string;
    is_subscription?: boolean;
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
  };
}

export interface VerifyPaymentPayload {
  razorpay_order_id?: string;
  razorpay_subscription_id?: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/**
 * Loads Razorpay Standard Checkout SDK if not already in window
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      return resolve(false);
    }
    if (window.Razorpay) {
      return resolve(true);
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay Checkout SDK');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Creates a payment order or recurring subscription on backend
 */
export const createPaymentOrderApi = async (
  planId: string = 'premium_monthly'
): Promise<RazorpayOrderResponse['order']> => {
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
    throw new Error(data?.detail?.message || data?.message || 'Failed to initialize subscription');
  }

  return data.order;
};

/**
 * Verifies payment / subscription signature with backend
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
 * Opens Razorpay Sandbox checkout modal for monthly subscriptions
 */
export const launchRazorpayCheckout = async (options: {
  planId?: string;
  onSuccess?: (paymentResult: any) => void;
  onError?: (err: any) => void;
  onClose?: () => void;
}) => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    alert('Unable to load Razorpay payment gateway. Please check your internet connection.');
    if (options.onError) options.onError(new Error('SDK load error'));
    return;
  }

  try {
    const order = await createPaymentOrderApi(options.planId || 'premium_monthly');

    const rzpOptions: any = {
      key: order.key_id,
      name: 'TrueMarriage Matrimony',
      description: order.plan_name,
      image: '/logo.png',
      prefill: {
        name: order.user_name,
        email: order.user_email,
        contact: order.user_phone,
      },
      theme: {
        color: '#F01472',
      },
      modal: {
        ondismiss: () => {
          if (options.onClose) options.onClose();
        },
      },
      handler: async (response: {
        razorpay_payment_id: string;
        razorpay_order_id?: string;
        razorpay_subscription_id?: string;
        razorpay_signature: string;
      }) => {
        try {
          const verifyResult = await verifyPaymentApi({
            razorpay_order_id: response.razorpay_order_id || (order.is_subscription ? undefined : order.order_id),
            razorpay_subscription_id: response.razorpay_subscription_id || (order.is_subscription ? (order.subscription_id || order.order_id) : undefined),
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          if (options.onSuccess) options.onSuccess(verifyResult);
        } catch (verErr) {
          console.error('Signature verification error:', verErr);
          alert('Payment verification failed. Please contact support if money was debited.');
          if (options.onError) options.onError(verErr);
        }
      },
    };

    if (order.is_subscription && order.subscription_id) {
      rzpOptions.subscription_id = order.subscription_id;
    } else {
      rzpOptions.order_id = order.order_id;
      rzpOptions.amount = order.amount;
      rzpOptions.currency = order.currency;
    }

    const rzp = new window.Razorpay(rzpOptions);
    rzp.on('payment.failed', function (resp: any) {
      console.warn('Payment failed:', resp.error);
      alert(`Payment Failed: ${resp.error?.description || 'Transaction declined'}`);
      if (options.onError) options.onError(resp.error);
    });
    rzp.open();
  } catch (err: any) {
    console.error('Payment checkout initiation failed:', err);
    alert(err?.message || 'Could not initiate payment. Please make sure you are logged in.');
    if (options.onError) options.onError(err);
  }
};

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
export const cancelSubscriptionApi = async (): Promise<{ success: boolean; message: string; subscription: SubscriptionStatus }> => {
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

