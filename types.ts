export enum RiskTolerance {
  Conservative = 'Conservative',
  Moderate = 'Moderate',
  Aggressive = 'Aggressive',
}

export interface UserProfile {
  name: string;
  age: number;
  income: number;
  savings: number;
  monthlyExpenses: number;
  riskTolerance: RiskTolerance;
  financialGoals: string[];
  currency: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  category?: string;
}

export interface ChartPayload {
  type: 'pie' | 'bar' | 'line';
  title: string;
  data: ChartDataPoint[];
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
  chartData?: ChartPayload;
  isThinking?: boolean;
  groundings?: any[];
}

export interface MarketNews {
  title: string;
  url: string;
  source?: string;
}