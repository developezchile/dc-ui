'use client';

import { useState } from 'react';
import { TakeCareRequest } from '@/lib/api';

interface TakeCareFormProps {
  petId: number;
  petName: string;
  onSubmit: (data: TakeCareRequest) => void;
  onCancel: () => void;
}

export default function TakeCareForm({ petId, petName, onSubmit, onCancel }: TakeCareFormProps) {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    dailyRate: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      petId,
      startDate: formData.startDate,
      endDate: formData.endDate,
      dailyRate: parseFloat(formData.dailyRate),
      notes: formData.notes || undefined,
      status: 'LOOKING_FOR_SITTER',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Looking for a sitter for <span className="font-semibold">{petName}</span>
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Start Date
        </label>
        <input
          type="date"
          required
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          End Date
        </label>
        <input
          type="date"
          required
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Daily Rate ($)
        </label>
        <input
          type="number"
          required
          min="0"
          step="0.01"
          value={formData.dailyRate}
          onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          placeholder="25.00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notes (optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          placeholder="Special instructions or requirements..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
        >
          Find Sitter
        </button>
      </div>
    </form>
  );
}
