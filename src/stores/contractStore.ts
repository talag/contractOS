import { create } from 'zustand';
import { Contract } from '@/types/contract';
import { api, Contract as ApiContract } from '@/lib/api';

interface ContractStore {
  contracts: Contract[];
  addContract: (contract: Contract) => void;
  deleteContract: (id: string) => void;
  fetchContracts: () => Promise<void>;
}

export const useContractStore = create<ContractStore>((set) => ({
  contracts: [],
  addContract: (contract) =>
    set((state) => ({
      contracts: [contract, ...state.contracts],
    })),
  deleteContract: (id) =>
    set((state) => ({
      contracts: state.contracts.filter((c) => c.id !== id),
    })),
  fetchContracts: async () => {
    try {
      const apiContracts = await api.getContracts();
      // Transform API contracts to store contracts
      const contracts: Contract[] = apiContracts.map((apiContract: ApiContract) => ({
        id: String(apiContract.id),
        name: apiContract.file_name,
        pointOfContact: apiContract.contact_name || 'N/A',
        startDate: apiContract.start_date || 'N/A',
        endDate: apiContract.end_date || 'N/A',
        value: apiContract.contract_value || 0,
        status: determineStatus(apiContract.start_date, apiContract.end_date),
        summary: apiContract.summary,
        paymentTerms: apiContract.payment_terms,
        terminationTerms: apiContract.termination_terms,
      }));
      set({ contracts });
    } catch (error) {
      console.error('Failed to fetch contracts:', error);
    }
  },
}));

// Helper function to determine contract status
function determineStatus(startDate: string | null, endDate: string | null): 'Active' | 'Expired' | 'Upcoming' {
  if (!startDate || !endDate) return 'Active';

  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return 'Upcoming';
  if (now > end) return 'Expired';
  return 'Active';
}
