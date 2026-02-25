import { Notyf } from 'notyf';

const API_BASE_URL = 'http://localhost:8080/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  roles: ('OWNER' | 'SITTER')[];
}

export interface AuthResponse {
  token: string;
  id: number;
  username: string;
  email: string;
  roles: ('OWNER' | 'SITTER')[];
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  roles: ('OWNER' | 'SITTER')[];
}

export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Invalid credentials');
    }
    return response.json();
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Registration failed');
    }
    return response.json();
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },

  getUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user && user !== 'undefined' ? JSON.parse(user) : null;
  },

  saveAuth(auth: AuthResponse) {
    localStorage.setItem('token', auth.token);
    const userObj: AuthUser = { id: auth.id, username: auth.username, email: auth.email, roles: auth.roles || [] };
    localStorage.setItem('user', JSON.stringify(userObj));
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

export interface Pet {
  id?: number;
  name: string;
  type: string;
  breed: string;
  age: number;
  weight: number;
  status: string;
  notes: string;
  ownerId: number;
  petStatus: string;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export const userApi = {
  async getAll(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  async getById(id: number): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  async create(user: Omit<User, 'id'>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },

  async update(id: number, user: Omit<User, 'id'>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');
  },
};

export interface PetCareAssignment {
  id: number;
  petName: string;
  petType: string;
  petBreed: string;
  ownerName: string;
  ownerPhone: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED';
  dailyRate: number;
  notes?: string;
}

export interface TakeCareRequest {
  sitterId?: number;
  petId: number;
  startDate: string;
  endDate: string;
  dailyRate: number;
  notes?: string;
  status: string;
}

export const petCareApi = {
  async getMyAssignments(sitterId: number): Promise<PetCareAssignment[]> {
    const token = authApi.getToken();
    const response = await fetch(`${API_BASE_URL}/take-care/sitter/${sitterId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    if (!response.ok) throw new Error('Failed to fetch assignments');
    return response.json();
  },

  async getActiveAssignments(): Promise<PetCareAssignment[]> {
    const token = authApi.getToken();
    const response = await fetch(`${API_BASE_URL}/pet-care/my-assignments?status=active`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    if (!response.ok) throw new Error('Failed to fetch active assignments');
    return response.json();
  },

  async create(data: TakeCareRequest): Promise<void> {
    const token = authApi.getToken();
    const response = await fetch(`${API_BASE_URL}/take-care`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    if (!response.ok) throw new Error('Failed to create take care request');
  },
};

export const petApi = {
  async getAll(token: string): Promise<Pet[]> {
    const response = await fetch(`${API_BASE_URL}/pets`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    if (!response.ok) throw new Error('Failed to fetch pets');
    return response.json();
  },

  async getById(id: number): Promise<Pet> {
    const response = await fetch(`${API_BASE_URL}/pets/${id}`);
    if (!response.ok) throw new Error('Failed to fetch pet');
    return response.json();
  },

  async getByOwner(ownerId: number, token: string): Promise<Pet[]> {
    const response = await fetch(`${API_BASE_URL}/pets/owner/${ownerId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    if (!response.ok) throw new Error('Failed to fetch pets by owner');
    return response.json();
  },

  async create(pet: Omit<Pet, 'id'>, token: string, services: number[]): Promise<Pet> {
    const response = await fetch(`${API_BASE_URL}/pets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ ...pet, services }),
    });
    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    if (!response.ok) throw new Error('Failed to create pet');
    return response.json();
  },

  async update(id: number, pet: Omit<Pet, 'id'>, token: string, services: number[]): Promise<Pet> {
    const response = await fetch(`${API_BASE_URL}/pets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ ...pet, services }),
    });
    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    if (!response.ok) throw new Error('Failed to update pet');
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/pets/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete pet');
  },

  async updateStatus(id: number, status: string): Promise<Pet> {
    const token = authApi.getToken();
    const response = await fetch(`${API_BASE_URL}/pets/${id}/status?status=${status}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    if (!response.ok) throw new Error('Failed to update pet status');
    return response.json();
  },
};

export interface PetToCare {
  id: number;
  ownerName: string;
  initials: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  dateRange: string;
  location: string;
  notes: string;
  dailyRate: number;
  totalAmount: number;
}

export const petsToCareApi = {
  async getAll(): Promise<PetToCare[]> {
    const token = authApi.getToken();
    const response = await fetch(`${API_BASE_URL}/pets-to-care`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    if (!response.ok) throw new Error('Failed to fetch pets to care');
    return response.json();
  },

  async getAvailable(): Promise<PetToCare[]> {
    const token = authApi.getToken();
    const response = await fetch(`${API_BASE_URL}/take-care/available`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    if (!response.ok) return [];
    const data = await response.json();
    return data.map((pet: PetToCare & { owner?: { address?: string } }) => ({
      ...pet,
      location: pet.owner?.address || pet.location || '',
    }));
  },

  async getById(id: number): Promise<PetToCare> {
    const token = authApi.getToken();
    const response = await fetch(`${API_BASE_URL}/pets-to-care/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    if (!response.ok) throw new Error('Failed to fetch pet to care');
    return response.json();
  },

  async applyToSit(petId: number, body: {
    sitterId: number;
    startDate: string;
    endDate: string;
    dailyRate: number;
    totalAmount: number;
    notes: string;
  }): Promise<void> {
    const token = authApi.getToken();
    const response = await fetch(`${API_BASE_URL}/take-care/pet/${petId}/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    if (!response.ok) {
      throw new Error('Failed to apply to sit');
    }
  },
};
