'use client';

import { PetCareAssignment } from '@/lib/api';

interface ActivePetCareCardProps {
  assignment: PetCareAssignment;
}

export default function ActivePetCareCard({ assignment }: ActivePetCareCardProps) {
  const statusStyles: Record<string, string> = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    upcoming: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    completed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  };

  const formatDateRange = (start: string, end: string) => {
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${new Date(start).toLocaleDateString('en-US', opts)} - ${new Date(end).toLocaleDateString('en-US', opts)}`;
  };

  const calculateDaysLeft = () => {
    const endMs = new Date(assignment.endDate).getTime();
    const nowMs = Date.now();
    return Math.ceil((endMs - nowMs) / 86400000);
  };

  return (
    <article className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow">
      <header className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-orange-500 dark:text-orange-400 font-bold text-lg">
            {assignment.petName.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{assignment.petName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{assignment.petBreed} · {assignment.petType}</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[assignment.status]}`}>
          {assignment.status}
        </span>
      </header>

      <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
        <p><span className="font-medium">Owner:</span> {assignment.ownerName}</p>
        <p><span className="font-medium">Contact:</span> {assignment.ownerPhone}</p>
        <p><span className="font-medium">Period:</span> {formatDateRange(assignment.startDate, assignment.endDate)}</p>
      </div>

      {assignment.notes && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg italic">
          &quot;{assignment.notes}&quot;
        </p>
      )}

      <footer className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
        <p className="text-gray-900 dark:text-white">
          <span className="text-2xl font-bold">${assignment.dailyRate}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">/day</span>
        </p>
        {assignment.status === 'active' && (
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Days left</p>
            <p className="text-xl font-bold text-orange-500 dark:text-orange-400">{calculateDaysLeft()}</p>
          </div>
        )}
      </footer>
    </article>
  );
}
