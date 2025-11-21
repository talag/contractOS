const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Contract {
  id: number;
  file_name: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  start_date: string | null;
  end_date: string | null;
  contract_value: number | null;
  payment_terms: string | null;
  termination_terms: string | null;
  summary: string | null;
  created_at: string;
}

export interface ExtractedContract {
  file_name: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  start_date: string | null;
  end_date: string | null;
  contract_value: number | null;
  payment_terms: string | null;
  termination_terms: string | null;
  summary: string | null;
}

export interface User {
  id: number;
  email: string;
  username: string;
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

// Helper function to get auth headers
function getAuthHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const authToken = token || localStorage.getItem('token');
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  return headers;
}

export const api = {
  // Authentication endpoints
  async signup(email: string, username: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to sign up');
    }

    return response.json();
  },

  async login(username: string, password: string): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to login');
    }

    return response.json();
  },

  async getCurrentUser(token?: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to get user info');
    }

    return response.json();
  },

  // Contract endpoints
  async extractContract(file: File): Promise<ExtractedContract> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/contracts/extract`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to extract contract details');
    }

    return response.json();
  },

  async saveContract(contractData: ExtractedContract): Promise<Contract> {
    const response = await fetch(`${API_BASE_URL}/api/contracts/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(contractData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to save contract');
    }

    return response.json();
  },

  async getContracts(): Promise<Contract[]> {
    const response = await fetch(`${API_BASE_URL}/api/contracts`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch contracts');
    }

    return response.json();
  },

  async getContract(id: number): Promise<Contract> {
    const response = await fetch(`${API_BASE_URL}/api/contracts/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch contract');
    }

    return response.json();
  },

  async deleteContract(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/contracts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete contract');
    }
  },

  async exportToCSV(): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/api/contracts/export/csv`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to export contracts');
    }

    return response.blob();
  },

  async chatAnalytics(message: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/api/analytics/chat`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to process chat');
    }

    const data = await response.json();
    return data.response;
  },
};
