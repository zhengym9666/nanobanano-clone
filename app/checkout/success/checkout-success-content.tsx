"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface PaymentVerificationResult {
  success: boolean;
  message: string;
  checkout?: any;
  customer?: any;
  product?: any;
}

export default function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [verification, setVerification] = useState<PaymentVerificationResult | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // 从 URL 参数获取 checkout session ID
        const checkoutId = searchParams.get('checkout_id') || searchParams.get('session_id');
        const sessionId = searchParams.get('session') || searchParams.get('id');

        // 尝试从多个可能的参数名获取 session ID
        const finalSessionId = checkoutId || sessionId || searchParams.get('session_id');

        if (!finalSessionId) {
          throw new Error('No session ID found in URL parameters');
        }

        console.log('Verifying payment with session ID:', finalSessionId);

        // 调用验证 API
        const response = await fetch('/api/creem/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId: finalSessionId,
          }),
        });

        const result = await response.json();
        console.log('Verification result:', result);

        setVerification(result);

        if (result.success) {
          // 支付成功，可以显示成功页面
          console.log('Payment verified successfully');
        } else {
          // 支付验证失败
          console.error('Payment verification failed:', result.message);
        }

      } catch (error) {
        console.error('Payment verification error:', error);
        setVerification({
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error occurred',
        });
      } finally {
        setLoading(false);
      }
    };

    // 延迟执行以确保 useSearchParams 已准备好
    const timer = setTimeout(() => {
      verifyPayment();
    }, 100);

    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleReturnHome = () => {
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Payment...</h2>
          <p className="text-gray-600">Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  if (!verification) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verification Error</h2>
          <p className="text-gray-600 mb-6">Unable to verify payment status.</p>
          <button
            onClick={handleReturnHome}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (!verification.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Verification Failed</h2>
          <p className="text-gray-600 mb-4">{verification.message}</p>
          <p className="text-sm text-gray-500 mb-6">
            We couldn&apos;t verify your payment. If you were charged, please contact our support team.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleReturnHome}
              className="w-full bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90"
            >
              Return to Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your payment has been verified successfully.
        </p>
        
        {verification.product && (
          <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Order Details</h3>
            <p className="text-sm text-gray-600">Product: {verification.product.name}</p>
            {verification.customer && (
              <p className="text-sm text-gray-600">Email: {verification.customer.email}</p>
            )}
          </div>
        )}
        
        <button
          onClick={handleReturnHome}
          className="w-full bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90"
        >
          Continue to App
        </button>
      </div>
    </div>
  );
}