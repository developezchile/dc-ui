'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function PaymentResultContent() {
  const params = useSearchParams();
  const router = useRouter();

  const status = params.get('status') ?? 'UNKNOWN';
  const amount = params.get('amount');
  const buyOrder = params.get('buyOrder');
  const authCode = params.get('authCode');
  const card = params.get('card');

  const isSuccess = status === 'COMPLETED';
  const isCancelled = status === 'CANCELLED';

  return (
    <div className="min-h-screen bg-orange-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 max-w-md w-full text-center space-y-6">

        {isSuccess ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment successful</h1>
            <p className="text-gray-500 dark:text-gray-400">Your payment was processed correctly.</p>
          </div>
        ) : isCancelled ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment cancelled</h1>
            <p className="text-gray-500 dark:text-gray-400">You cancelled the payment. No charge was made.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment failed</h1>
            <p className="text-gray-500 dark:text-gray-400">The transaction was rejected. Please try again.</p>
          </div>
        )}

        {isSuccess && (amount || buyOrder || authCode || card) && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left space-y-2 text-sm">
            {amount && (
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Amount</span>
                <span className="font-medium text-gray-900 dark:text-white">${amount} CLP</span>
              </div>
            )}
            {buyOrder && (
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Order</span>
                <span className="font-mono text-gray-900 dark:text-white text-xs">{buyOrder}</span>
              </div>
            )}
            {authCode && (
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Auth code</span>
                <span className="font-medium text-gray-900 dark:text-white">{authCode}</span>
              </div>
            )}
            {card && (
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Card</span>
                <span className="font-medium text-gray-900 dark:text-white">**** {card}</span>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => router.push('/')}
          className="w-full px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors font-medium"
        >
          Back to home
        </button>
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense>
      <PaymentResultContent />
    </Suspense>
  );
}
