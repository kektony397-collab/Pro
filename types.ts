
export interface Transaction {
  id: string;
  name: string;
  petrolExpense: number;
  amount: number;
  date: string; 
}

export type Tab = 'dashboard' | 'data' | 'records';

export interface Summary {
  totalRidesAmount: number;
  totalPetrolExpense: number;
  netProfit: number;
}
