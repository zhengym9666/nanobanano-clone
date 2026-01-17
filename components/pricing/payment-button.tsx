"use client"

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

interface PaymentButtonProps {
  planId: string;
  planName: string;
  planType: 'subscription' | 'one-time';
  amount: number; // 以分为单位
  disabled?: boolean;
}

export function PaymentButton({ planId, planName, planType, amount, disabled = false }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handlePayment = async () => {
    console.log('Payment button clicked', { planId, planName, planType, amount, user });
    
    if (!user) {
      console.log('User not logged in, showing error');
      setError('Please sign in to purchase a plan');
      return;
    }

    try {
      console.log('Starting payment process...');
      setLoading(true);
      setError(null);

      // 检查是否处于支付测试模式
      const isPaymentTestMode = process.env.NEXT_PUBLIC_PAYMENT_TEST_MODE === 'true';
      console.log('Payment test mode:', isPaymentTestMode);

      if (isPaymentTestMode) {
        // 支付测试模式：直接跳转到支付成功页面
        console.log('Running in payment test mode, skipping actual payment process');
        window.location.href = `/checkout/success?session_id=test_payment&email=${encodeURIComponent(user.email)}`;
      } else {
        // 正常支付模式：执行实际支付流程
        console.log('Running in normal payment mode, proceeding with actual payment');
        const requestBody = {
          productId: planId,
          planType,
          userId: user.id,
          amount, // 以分为单位
          currency: 'USD',
        };
        console.log('Request body:', requestBody);

        // 创建支付会话
        const response = await fetch('/api/creem/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (!response.ok) {
          console.error('API response not ok:', response.status, data);
          throw new Error(data.error || data.message || `Failed to create payment session (${response.status})`);
        }

        console.log('Payment session created successfully:', data);

        // 重定向到Creem支付页面
        const checkoutUrl = data.checkoutUrl || data.url || data.redirectUrl;
        if (checkoutUrl) {
          console.log('Redirecting to checkout URL:', checkoutUrl);
          window.location.href = checkoutUrl;
        } else {
          console.error('No checkout URL in response:', data);
          throw new Error('No checkout URL returned from API');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during payment';
      console.error('Payment error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handlePayment}
        disabled={disabled || loading || !user}
        className={`w-full rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 ${disabled || loading || !user ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Processing...' : 'Purchase'}
      </button>
      {!user && <p className="mt-2 text-sm text-red-600">Please sign in to purchase</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}