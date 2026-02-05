'use client';

import {Pet} from '@/lib/api';

interface PetTableProps {
  pets: Pet[];
  onEdit: (pet: Pet) => void;
  onDelete: (id: number) => void;
  onLookingForSitter: (id: number) => void;
  loading: boolean;
}

export default function PetTable({ pets, onEdit, onDelete, onLookingForSitter, loading }: PetTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mx-auto mb-4 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 12H4M12 4v16"
          />
        </svg>
        <p>No pets found. Add your first pet!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Name</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Species</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Breed</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Age</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Weight</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Status</th>
            <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pets.map((pet) => (
            <tr
              key={pet.id}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{pet.name}</td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{pet.type}</td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{pet.breed}</td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{pet.age} years</td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{pet.weight} kg</td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{pet.status}</td>
              <td className="py-3 px-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => pet.id && onLookingForSitter(pet.id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors dark:hover:bg-green-900/30"
                    title="Looking for Sitter"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onEdit(pet)}
                    className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors dark:hover:bg-orange-900/30"
                    title="Edit"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => pet.id && onDelete(pet.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:hover:bg-red-900/30"
                    title="Delete"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
