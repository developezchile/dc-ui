'use client';

import { useState } from 'react';
import { TakeCare, paymentApi } from '@/lib/api';

interface PaymentModalProps {
  takeCare: TakeCare;
  userId: number;
  onClose: () => void;
}

export default function PaymentModal({ takeCare, userId, onClose }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    try {
      const payment = await paymentApi.create({
        userId,
        petId: takeCare.petId,
        amount: takeCare.totalAmount,
        currency: 'CLP',
        description: `Pet sitting for ${takeCare.petName} (${takeCare.startDate} to ${takeCare.endDate})`,
      });

      if (!payment.transbankToken || !payment.transbankUrl) {
        throw new Error('Missing Transbank redirect info');
      }

      // Submit a hidden form POST to Webpay (Transbank requires POST, not GET redirect)
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = payment.transbankUrl;

      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'token_ws';
      input.value = payment.transbankToken;

      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
    } catch {
      setError('Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Pet</span>
          <span className="font-medium text-gray-900 dark:text-white">{takeCare.petName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Sitter</span>
          <span className="font-medium text-gray-900 dark:text-white">{takeCare.sitterName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Dates</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {takeCare.startDate} → {takeCare.endDate}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Daily rate</span>
          <span className="font-medium text-gray-900 dark:text-white">${takeCare.dailyRate}</span>
        </div>
        <div className="border-t border-orange-200 dark:border-orange-800 pt-2 flex justify-between">
          <span className="font-semibold text-gray-900 dark:text-white">Total</span>
          <span className="font-bold text-orange-600 dark:text-orange-400 text-lg">
            ${takeCare.totalAmount} CLP
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        You will be redirected to Transbank Webpay to complete your payment securely.
      </p>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handlePay}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Redirecting…
            </>
          ) : (
            'Pay with Webpay'
          )}
        </button>
      </div>
    </div>
  );
}
