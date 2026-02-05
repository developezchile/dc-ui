'use client';

import { useState } from 'react';
import { PetToCare, petsToCareApi, authApi } from '@/lib/api';

interface SitterRequestProps {
  pet: PetToCare;
}

export default function SitterRequestCard({ pet }: SitterRequestProps) {
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    try {
      const user = authApi.getUser();
      const today = new Date().toISOString().split('T')[0];
      await petsToCareApi.applyToSit(pet.id, {
        sitterId: user?.id ?? 0,
        startDate: today,
        endDate: today,
        dailyRate: pet.rate,
        notes: '',
      });
      alert('Application submitted successfully!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to apply');
    } finally {
      setIsApplying(false);
    }
  };

  const {
    ownerName,
    initials,
    name,
    type,
    breed,
    age,
    dateRange,
    location,
    notes,
    rate,
  } = pet;

  return (
    <article className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow">
      {/* Owner Section */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-orange-500 dark:text-orange-400 font-semibold text-sm">
            {initials}
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Owner</p>
            <p className="font-semibold text-gray-900 dark:text-white">{ownerName}</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          {type}
        </span>
      </div>

      {/* Pet Info Section */}
      <div className="mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Pet Name</p>
        <p className="text-lg font-bold text-gray-900 dark:text-white">{name}</p>
      </div>

      {/* Pet Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Breed</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{breed}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Age</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{age}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Location</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{location}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Date Range</p>
          <div className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{dateRange}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Notes</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{notes}</p>
      </div>

      {/* Rate & Action */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Rate</p>
          <p className="text-gray-900 dark:text-white">
            <span className="text-2xl font-bold">${rate}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">/day</span>
          </p>
        </div>
        <button
          onClick={handleApply}
          disabled={isApplying}
          className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isApplying ? 'Applying...' : 'Apply to Sit'}
        </button>
      </div>
    </article>
  );
}
