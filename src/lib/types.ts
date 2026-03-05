export interface Category {
  id: string;
  name: string;
  budget_limit: number;
  icon: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  category_id: string;
  amount: number;
  date: string;
  description: string;
  payment_mode: 'Cash' | 'UPI' | 'Bank';
  contractor_name: string | null;
  receipt_url: string | null;
  created_at: string;
  category?: Category;
}

export interface ProgressPhoto {
  id: string;
  image_url: string;
  description: string | null;
  uploaded_at: string;
}

export interface CategoryWithTotal extends Category {
  total_spent: number;
  transaction_count: number;
}

export interface DashboardStats {
  total_spent: number;
  total_budget: number;
  category_count: number;
  transaction_count: number;
}
