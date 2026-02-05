'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { petsToCareApi, PetToCare } from '@/lib/api';
import SitterRequestCard from '@/components/SitterRequestCard';

export default function SittersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
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
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      void fetchPetsLookingForSitter();
    }
  }, [isAuthenticated, fetchPetsLookingForSitter]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-orange-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-orange-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Find a Pet to Sit</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Pet owners looking for sitters</p>
            </div>
          </div>
        </header>

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
  );
}
