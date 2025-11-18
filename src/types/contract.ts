export interface Contract {
  id: string;
  name: string;
  pointOfContact: string;
  startDate: string;
  endDate: string;
  value: number;
  status: 'Active' | 'Expired' | 'Upcoming';
}
