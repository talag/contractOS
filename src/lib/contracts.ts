import { supabase } from './supabase';

export interface Contract {
  id: number;
  user_id: string;
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

// Use environment variable for backend URL, fallback to localhost for development
// @ts-ignore - Vite env variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const contractsService = {
  // Extract contract using backend AI service
  async extractContract(file: File): Promise<ExtractedContract> {
    // Check if backend is available (localhost backend can't be accessed from production)
    if (API_BASE_URL.includes('localhost') && window.location.hostname !== 'localhost') {
      throw new Error('AI extraction requires a deployed backend. This feature is only available when running locally.');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contracts/extract`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to extract contract details');
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to backend server. Make sure the backend is running on port 8000.');
      }
      throw error;
    }
  },

  // Save contract to Supabase
  async saveContract(contractData: ExtractedContract): Promise<Contract> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase
      .from('contracts')
      .insert([
        {
          user_id: session.user.id,
          ...contractData,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all contracts for current user
  async getContracts(): Promise<Contract[]> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get a single contract
  async getContract(id: number): Promise<Contract> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a contract
  async deleteContract(id: number): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Not authenticated');
    }

    const { error } = await supabase
      .from('contracts')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) throw error;
  },

  // Export contracts to CSV
  async exportToCSV(): Promise<Blob> {
    const contracts = await this.getContracts();

    // Convert contracts to CSV
    const headers = [
      'ID',
      'File Name',
      'Contact Name',
      'Contact Email',
      'Contact Phone',
      'Start Date',
      'End Date',
      'Contract Value',
      'Payment Terms',
      'Termination Terms',
      'Summary',
      'Created At',
    ];

    const csvRows = [
      headers.join(','),
      ...contracts.map(contract =>
        [
          contract.id,
          `"${contract.file_name}"`,
          `"${contract.contact_name || ''}"`,
          `"${contract.contact_email || ''}"`,
          `"${contract.contact_phone || ''}"`,
          `"${contract.start_date || ''}"`,
          `"${contract.end_date || ''}"`,
          contract.contract_value || '',
          `"${contract.payment_terms || ''}"`,
          `"${contract.termination_terms || ''}"`,
          `"${contract.summary || ''}"`,
          `"${contract.created_at}"`,
        ].join(',')
      ),
    ];

    const csvContent = csvRows.join('\n');
    return new Blob([csvContent], { type: 'text/csv' });
  },

  // Chat analytics (still uses backend for AI processing)
  async chatAnalytics(message: string): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/api/analytics/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
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
