import { create } from 'zustand';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Chart {
  id: string;
  title: string;
  type: 'line' | 'bar';
}

interface AnalyticsStore {
  messages: Message[];
  charts: Chart[];
  addMessage: (message: Message) => void;
  addChart: (chart: Chart) => void;
  removeChart: (id: string) => void;
}

const initialCharts: Chart[] = [
  { id: 'chart-1', title: 'Contract Value Over Time', type: 'line' },
  { id: 'chart-2', title: 'Expiration Timeline', type: 'bar' },
];

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  messages: [
    {
      role: 'assistant',
      content: 'Hello! I can help you analyze your contracts. Try asking me about contract values, expiration dates, or request custom visualizations.',
    },
  ],
  charts: initialCharts,
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  addChart: (chart) =>
    set((state) => ({
      charts: [...state.charts, chart],
    })),
  removeChart: (id) =>
    set((state) => ({
      charts: state.charts.filter((c) => c.id !== id),
    })),
}));
