import { create } from 'zustand';

interface ModalStore {
  addModalOpen: boolean;
  detailDrawerOpen: boolean;
  selectedContractId: string | null;
  openAddModal: () => void;
  closeAddModal: () => void;
  openDetailDrawer: (contractId: string) => void;
  closeDetailDrawer: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  addModalOpen: false,
  detailDrawerOpen: false,
  selectedContractId: null,
  openAddModal: () => set({ addModalOpen: true }),
  closeAddModal: () => set({ addModalOpen: false }),
  openDetailDrawer: (contractId) =>
    set({ detailDrawerOpen: true, selectedContractId: contractId }),
  closeDetailDrawer: () =>
    set({ detailDrawerOpen: false, selectedContractId: null }),
}));
