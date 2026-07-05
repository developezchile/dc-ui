'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {petApi, Pet, authApi, petCareApi, TakeCareRequest, takeCareApi, TakeCare} from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import PetTable from '@/components/PetTable';
import PetForm from '@/components/PetForm';
import TakeCareForm from '@/components/TakeCareForm';
import PaymentModal from '@/components/PaymentModal';
import Modal from '@/components/Modal';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isTakeCareModalOpen, setIsTakeCareModalOpen] = useState(false);
  const [selectedPetForCare, setSelectedPetForCare] = useState<Pet | null>(null);
  const [activeSittings, setActiveSittings] = useState<TakeCare[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedTakeCare, setSelectedTakeCare] = useState<TakeCare | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
    if (!authLoading && isAuthenticated && user?.roles?.includes('SITTER') && !user?.roles?.includes('OWNER')) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, user, router]);

  const fetchPets = useCallback(async () => {
    if (!user?.id) return;
    try {
      const token = authApi.getToken() || '';
      setLoading(true);
      setError(null);
      const data = await petApi.getByOwner(user.id, token);
      setPets(data);
      const takeCareResults = await Promise.all(
        data.filter(p => p.id).map(p => takeCareApi.getByPet(p.id!).catch(() => []))
      );
      const onSitter = takeCareResults.flat().filter((tc: TakeCare) => tc.status === 'ON_SITTER');
      setActiveSittings(onSitter);
    } catch (err) {
      setError('Failed to load pets. Make sure the API is running on localhost:8080');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const handleCreate = () => {
    setEditingPet(null);
    setIsModalOpen(true);
  };

  const handleEdit = (pet: Pet) => {
    setEditingPet(pet);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await petApi.delete(deletingId);
      await fetchPets();
      setIsDeleteModalOpen(false);
      setDeletingId(null);
    } catch (err) {
      setError('Failed to delete pet');
      console.error(err);
    }
  };

  const handleLookingForSitter = (id: number) => {
    const pet = pets.find(p => p.id === id);
    if (pet) {
      setSelectedPetForCare(pet);
      setIsTakeCareModalOpen(true);
    }
  };

  const handleTakeCareSubmit = async (data: TakeCareRequest) => {
    try {
      await petCareApi.create(data);
      await fetchPets();
      setIsTakeCareModalOpen(false);
      setSelectedPetForCare(null);
    } catch (err) {
      setError('Failed to create take care request');
      console.error(err);
    }
  };

  const handleSubmit = async (petData: Omit<Pet, 'petId'>) => {
    try {
      const token = authApi.getToken() || '';
      const services: number[] = [];
      if (editingPet?.id) {
        await petApi.update(editingPet.id, petData, token, services);
      } else {
        await petApi.create(petData, token, services);
      }
      await fetchPets();
      setIsModalOpen(false);
      setEditingPet(null);
    } catch (err) {
      setError(editingPet ? 'Failed to update pet' : 'Failed to create pet');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Dos Colas
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Pet Management System
              </p>
            </div>
            <div className="flex items-center gap-3">
              {!authLoading && user && (
                <span className="text-xl text-gray-600 dark:text-gray-400">
                  Hi, {user.username}. You are: {user.roles?.join(', ') || 'No roles'}
                </span>
              )}
              {user?.roles?.includes('SITTER') && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 text-gray-900 bg-amber-300 rounded-lg hover:bg-amber-400 transition-colors font-medium"
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
                      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                    />
                  </svg>
                  Sitter Dashboard
                </Link>
              )}
              {user?.roles?.includes('OWNER') && (
                <button
                  onClick={handleCreate}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Pet
                </button>
              )}
                <button
                    onClick={() => { logout(); router.push('/login'); }}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            <div className="flex items-center gap-2">
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
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        <main className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
          <PetTable
            pets={pets}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onLookingForSitter={handleLookingForSitter}
            loading={loading}
          />
        </main>

        {activeSittings.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Active Sittings — Pending Payment
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeSittings.map((tc) => (
                <div
                  key={tc.id}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white">{tc.petName}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                      ON SITTER
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>Sitter: <span className="text-gray-900 dark:text-white">{tc.sitterName}</span></p>
                    <p>{tc.startDate} → {tc.endDate}</p>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                      ${tc.totalAmount}
                    </span>
                    <button
                      onClick={() => { setSelectedTakeCare(tc); setIsPaymentModalOpen(true); }}
                      className="px-3 py-1.5 text-sm text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                    >
                      Pay Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPet(null);
          }}
          title={editingPet ? 'Edit Pet' : 'Add New Pet'}
        >
          <PetForm
            pet={editingPet}
            ownerId={user?.id ?? 0}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsModalOpen(false);
              setEditingPet(null);
            }}
          />
        </Modal>

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingId(null);
          }}
          title="Confirm Delete"
        >
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this pet? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeletingId(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={isTakeCareModalOpen}
          onClose={() => {
            setIsTakeCareModalOpen(false);
            setSelectedPetForCare(null);
          }}
          title="Find a Sitter"
        >
          {selectedPetForCare && (
            <TakeCareForm
              petId={selectedPetForCare.id!}
              petName={selectedPetForCare.name}
              onSubmit={handleTakeCareSubmit}
              onCancel={() => {
                setIsTakeCareModalOpen(false);
                setSelectedPetForCare(null);
              }}
            />
          )}
        </Modal>

        <Modal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedTakeCare(null);
          }}
          title="Payment Summary"
        >
          {selectedTakeCare && user && (
            <PaymentModal
              takeCare={selectedTakeCare}
              userId={user.id}
              onClose={() => {
                setIsPaymentModalOpen(false);
                setSelectedTakeCare(null);
              }}
            />
          )}
        </Modal>
      </div>
    </div>
  );
}
