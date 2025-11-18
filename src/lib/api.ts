const API_BASE_URL = 'http://localhost:8000';

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

export const api = {
  async uploadContract(file: File): Promise<Contract> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/contracts/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to upload contract');
    }

    return response.json();
  },

  async getContracts(): Promise<Contract[]> {
    const response = await fetch(`${API_BASE_URL}/api/contracts`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch contracts');
    }

    return response.json();
  },

  async getContract(id: number): Promise<Contract> {
    const response = await fetch(`${API_BASE_URL}/api/contracts/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch contract');
    }

    return response.json();
  },

  async deleteContract(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/contracts/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete contract');
    }
  },

  async exportToCSV(): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/api/contracts/export/csv`);
    
    if (!response.ok) {
      throw new Error('Failed to export contracts');
    }

    return response.blob();
  },

  async chatAnalytics(message: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/api/analytics/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
