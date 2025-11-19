export interface Contract {
  id: string;
  name: string;
  pointOfContact: string;
  startDate: string;
  endDate: string;
  value: number;
  status: 'Active' | 'Expired' | 'Upcoming';
  summary: string | null;
  paymentTerms: string | null;
  terminationTerms: string | null;
}
