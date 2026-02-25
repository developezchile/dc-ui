'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PetCareAssignment, petCareApi } from '@/lib/api';
import ActivePetCareCard from '@/components/ActivePetCareCard';
import FindPetsModal from '@/components/FindPetsModal';
import { PawPrint, LogOut } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [assignments, setAssignments] = useState<PetCareAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'UPCOMING' | 'COMPLETED'>('ALL');
  const [isFindPetsModalOpen, setIsFindPetsModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const loadAssignments = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const data = await petCareApi.getMyAssignments(user.id);
        setAssignments(data);
      } catch (err) {
        console.error('Failed to load assignments:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAssignments();
  }, [user]);

  const filteredAssignments = filter === 'ALL' 
    ? assignments 
    : assignments.filter(a => a.status === filter);

  const activeCount = assignments.filter(a => a.status === 'ACTIVE').length;
  const upcomingCount = assignments.filter(a => a.status === 'UPCOMING').length;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-orange-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sitter Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {user ? `Welcome back, ${user.username}!` : 'Manage your pet care assignments'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFindPetsModalOpen(true)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <PawPrint className="w-5 h-5" />
              </button>
              <button
                onClick={() => { logout(); router.push('/login'); }}
                className="p-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Active Assignments</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{activeCount}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming</p>
            <p className="text-3xl font-bold text-amber-500 dark:text-amber-400">{upcomingCount}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Completed</p>
            <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">
              {assignments.filter(a => a.status === 'COMPLETED').length}
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {(['ALL', 'ACTIVE', 'UPCOMING', 'COMPLETED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium uppercase transition-colors ${
                filter === status
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {filter === 'ALL' 
                ? "You don't have any pet care assignments yet." 
                : `No ${filter} assignments found.`}
            </p>
            <button
              onClick={() => setIsFindPetsModalOpen(true)}
              className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Find Pets to Care For
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssignments.map((assignment) => (
              <ActivePetCareCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        )}
      </div>
      <FindPetsModal
        isOpen={isFindPetsModalOpen}
        onClose={() => setIsFindPetsModalOpen(false)}
      />
    </div>
  );
}
