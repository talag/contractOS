import { create } from 'zustand';
import { Contract } from '@/types/contract';

interface ContractStore {
  contracts: Contract[];
  addContract: (contract: Contract) => void;
  deleteContract: (id: string) => void;
}

const initialContracts: Contract[] = [
  {
    id: '1',
    name: 'Software Development Agreement',
    pointOfContact: 'Alice Johnson',
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    value: 75000,
    status: 'Active',
  },
  {
    id: '2',
    name: 'Marketing Services Contract',
    pointOfContact: 'Bob Smith',
    startDate: '2023-06-01',
    endDate: '2024-05-31',
    value: 45000,
    status: 'Active',
  },
  {
    id: '3',
    name: 'Office Lease Agreement',
    pointOfContact: 'Carol Williams',
    startDate: '2023-01-01',
    endDate: '2025-12-31',
    value: 120000,
    status: 'Active',
  },
  {
    id: '4',
    name: 'IT Support Contract',
    pointOfContact: 'David Brown',
    startDate: '2023-03-15',
    endDate: '2024-03-14',
    value: 30000,
    status: 'Expired',
  },
  {
    id: '5',
    name: 'Consulting Services Agreement',
    pointOfContact: 'Emma Davis',
    startDate: '2024-07-01',
    endDate: '2025-06-30',
    value: 95000,
    status: 'Upcoming',
  },
];

export const useContractStore = create<ContractStore>((set) => ({
  contracts: initialContracts,
  addContract: (contract) =>
    set((state) => ({
      contracts: [contract, ...state.contracts],
    })),
  deleteContract: (id) =>
    set((state) => ({
      contracts: state.contracts.filter((c) => c.id !== id),
    })),
}));
