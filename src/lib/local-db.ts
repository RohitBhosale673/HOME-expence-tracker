import { get, set } from 'idb-keyval';
import type { Category, ProgressPhoto, Transaction } from './types';

const KEYS = {
  CATEGORIES: 'buildtrack_categories',
  TRANSACTIONS: 'buildtrack_transactions',
  PHOTOS: 'buildtrack_photos',
};

// Helper: generate unique IDs safely
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// --- CATEGORIES ---

export async function getCategories(): Promise<Category[]> {
  const data = await get<Category[]>(KEYS.CATEGORIES);
  return data || [];
}

export async function addCategory(
  category: Omit<Category, 'id' | 'created_at'>
): Promise<Category> {
  const categories = await getCategories();
  const newCat: Category = {
    ...category,
    id: generateId(),
    created_at: new Date().toISOString(),
  };
  await set(KEYS.CATEGORIES, [...categories, newCat]);
  return newCat;
}

export async function updateCategory(
  id: string,
  updates: Partial<Category>
): Promise<void> {
  const categories = await getCategories();
  const index = categories.findIndex((c) => c.id === id);
  if (index !== -1) {
    categories[index] = { ...categories[index], ...updates };
    await set(KEYS.CATEGORIES, categories);
  } else {
    throw new Error('Category not found');
  }
}

export async function deleteCategory(id: string): Promise<void> {
  const categories = await getCategories();
  await set(KEYS.CATEGORIES, categories.filter((c) => c.id !== id));
  // Cascade delete transactions
  const transactions = await getTransactions();
  await set(KEYS.TRANSACTIONS, transactions.filter((t) => t.category_id !== id));
}

export async function getCategoryById(id: string): Promise<Category> {
  const categories = await getCategories();
  const cat = categories.find((c) => c.id === id);
  if (!cat) throw new Error('Category not found');
  return cat;
}

// --- TRANSACTIONS ---

export async function getTransactions(): Promise<Transaction[]> {
  const data = await get<Transaction[]>(KEYS.TRANSACTIONS);
  return data || [];
}

export async function addTransaction(
  transaction: Omit<Transaction, 'id' | 'created_at' | 'category'>
): Promise<Transaction> {
  const transactions = await getTransactions();
  const newTxn: Transaction = {
    ...transaction,
    id: generateId(),
    created_at: new Date().toISOString(),
  };
  await set(KEYS.TRANSACTIONS, [...transactions, newTxn]);
  return newTxn;
}

export async function updateTransaction(
  id: string,
  updates: Partial<Transaction>
): Promise<void> {
  const transactions = await getTransactions();
  const index = transactions.findIndex((t) => t.id === id);
  if (index !== -1) {
    transactions[index] = { ...transactions[index], ...updates };
    await set(KEYS.TRANSACTIONS, transactions);
  } else {
    throw new Error('Transaction not found');
  }
}

export async function deleteTransaction(id: string): Promise<void> {
  const transactions = await getTransactions();
  await set(KEYS.TRANSACTIONS, transactions.filter((t) => t.id !== id));
}

// --- PHOTOS ---

export async function getProgressPhotos(): Promise<ProgressPhoto[]> {
  const data = await get<ProgressPhoto[]>(KEYS.PHOTOS);
  return data || [];
}

export async function addProgressPhoto(
  photo: Omit<ProgressPhoto, 'id' | 'uploaded_at'>
): Promise<ProgressPhoto> {
  const photos = await getProgressPhotos();
  const newPhoto: ProgressPhoto = {
    ...photo,
    id: generateId(),
    uploaded_at: new Date().toISOString(),
  };
  await set(KEYS.PHOTOS, [...photos, newPhoto]);
  return newPhoto;
}

export async function updateProgressPhoto(
  id: string,
  updates: Partial<ProgressPhoto>
): Promise<void> {
  const photos = await getProgressPhotos();
  const index = photos.findIndex((p) => p.id === id);
  if (index !== -1) {
    photos[index] = { ...photos[index], ...updates };
    await set(KEYS.PHOTOS, photos);
  } else {
    throw new Error('Photo not found');
  }
}

export async function deleteProgressPhoto(id: string): Promise<void> {
  const photos = await getProgressPhotos();
  await set(KEYS.PHOTOS, photos.filter((p) => p.id !== id));
}

// --- DUMMY DATA SEEDER ---

export async function initDummyData(): Promise<void> {
  if (typeof window === 'undefined') return;

  const demoCats: Category[] = [
    { id: generateId(), name: 'Cement & Sand', budget_limit: 150000, icon: 'package', created_at: new Date().toISOString() },
    { id: generateId(), name: 'Steel & Metal', budget_limit: 200000, icon: 'hammer', created_at: new Date().toISOString() },
    { id: generateId(), name: 'Plumbing', budget_limit: 50000, icon: 'droplets', created_at: new Date().toISOString() },
    { id: generateId(), name: 'Electrical', budget_limit: 75000, icon: 'zap', created_at: new Date().toISOString() },
  ];

  const demoTxns: Transaction[] = [
    {
      id: generateId(),
      category_id: demoCats[0].id,
      amount: 45000,
      date: new Date().toISOString().split('T')[0],
      description: 'UltraTech Cement 100 bags',
      payment_mode: 'Bank',
      contractor_name: 'Shree Traders',
      receipt_url: null,
      created_at: new Date().toISOString(),
    },
    {
      id: generateId(),
      category_id: demoCats[1].id,
      amount: 60000,
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      description: 'TMT Bars 12mm',
      payment_mode: 'UPI',
      contractor_name: 'Tata Steel Hub',
      receipt_url: null,
      created_at: new Date().toISOString(),
    },
  ];

  await set(KEYS.CATEGORIES, demoCats);
  await set(KEYS.TRANSACTIONS, demoTxns);
  await set(KEYS.PHOTOS, []); // Empty photos for demo
  
  // Reloading so that the application fetches new data
  window.location.reload();
}

export async function clearAllData(): Promise<void> {
  if (typeof window === 'undefined') return;

  if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
    await set(KEYS.CATEGORIES, []);
    await set(KEYS.TRANSACTIONS, []);
    await set(KEYS.PHOTOS, []);
    
    window.location.reload();
  }
}
