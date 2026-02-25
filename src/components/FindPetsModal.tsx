'use client';

import { useEffect, useState, useCallback } from 'react';
import { petsToCareApi, PetToCare } from '@/lib/api';
import SitterRequestCard from '@/components/SitterRequestCard';

interface FindPetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FindPetsModal({ isOpen, onClose }: FindPetsModalProps) {
  const [petsToCare, setpetsToCare] = useState<PetToCare[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPetsLookingForSitter = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await petsToCareApi.getAvailable();
      setpetsToCare(data);
    } catch (err) {
      setError('Failed to load pets looking for sitter');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      void fetchPetsLookingForSitter();
    }
  }, [isOpen, fetchPetsLookingForSitter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Find a Pet to Sit
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : petsToCare.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No pets looking for sitters at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {petsToCare.map((r) => (
                <SitterRequestCard key={r.id} pet={r} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
