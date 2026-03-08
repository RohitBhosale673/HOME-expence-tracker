'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, Select, Textarea } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import type { Category, CategoryWithTotal, DashboardStats, Transaction } from '@/lib/types';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import {
    ArrowRight,
    DollarSign,
    Edit,
    Hammer,
    HardHat,
    Package,
    Plus,
    Receipt,
    Trash2,
    TrendingDown,
    TrendingUp,
    Truck,
    X,
    Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'hammer': Hammer,
  'truck': Truck,
  'hard-hat': HardHat,
  'zap': Zap,
  'package': Package,
  'droplets': Zap,
};

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function EditModal({ isOpen, onClose, title, children }: EditModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-slate-800 mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [categories, setCategories] = useState<CategoryWithTotal[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total_spent: 0,
    total_budget: 0,
    category_count: 0,
    transaction_count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '', budget_limit: '', icon: 'package' });
  const [transactionForm, setTransactionForm] = useState({
    category_id: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    payment_mode: 'Bank',
    contractor_name: '',
  });
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [transactionError, setTransactionError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [catsRes, txnsRes] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('transactions').select('*').order('date', { ascending: false }),
      ]);

      const cats = catsRes.data || [];
      const txns = txnsRes.data || [];

      const catsWithTotal = cats.map((cat: Category) => {
        const catTxns = txns.filter((t: Transaction) => t.category_id === cat.id);
        return {
          ...cat,
          total_spent: catTxns.reduce((sum: number, t: Transaction) => sum + (Number(t.amount) || 0), 0),
          transaction_count: catTxns.length,
        };
      });

      setCategories(catsWithTotal);
      setTransactions(txns);

      const totalSpent = catsWithTotal.reduce((acc, cat) => acc + cat.total_spent, 0);
      const totalBudget = catsWithTotal.reduce((acc, cat) => acc + (Number(cat.budget_limit) || 0), 0);

      setStats({
        total_spent: totalSpent,
        total_budget: totalBudget,
        category_count: cats.length,
        transaction_count: txns.length,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryError(null);
    
    // Validation
    if (!categoryForm.name.trim()) {
      setCategoryError('Category name is required');
      return;
    }
    if (!categoryForm.budget_limit || Number(categoryForm.budget_limit) <= 0) {
      setCategoryError('Budget limit must be greater than 0');
      return;
    }
    
    try {
      if (editingCategory) {
        const { error } = await supabase.from('categories').update({
          name: categoryForm.name.trim(),
          budget_limit: Number(categoryForm.budget_limit),
          icon: categoryForm.icon,
        }).eq('id', editingCategory.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase.from('categories').insert({
          name: categoryForm.name.trim(),
          budget_limit: Number(categoryForm.budget_limit),
          icon: categoryForm.icon,
        });
        
        if (error) throw error;
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
      setCategoryForm({ name: '', budget_limit: '', icon: 'package' });
      fetchData();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save category';
      setCategoryError(errorMessage);
      console.error('Error saving category:', error);
    }
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransactionError(null);
    
    // Validation
    if (!transactionForm.category_id) {
      setTransactionError('Please select a category');
      return;
    }
    if (!transactionForm.amount || Number(transactionForm.amount) <= 0) {
      setTransactionError('Amount must be greater than 0');
      return;
    }
    if (!transactionForm.description.trim()) {
      setTransactionError('Description is required');
      return;
    }
    
    try {
      if (editingTransaction) {
        const { error } = await supabase.from('transactions').update({
          category_id: transactionForm.category_id,
          amount: Number(transactionForm.amount),
          date: transactionForm.date,
          description: transactionForm.description.trim(),
          payment_mode: transactionForm.payment_mode,
          contractor_name: transactionForm.contractor_name || null,
        }).eq('id', editingTransaction.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase.from('transactions').insert({
          category_id: transactionForm.category_id,
          amount: Number(transactionForm.amount),
          date: transactionForm.date,
          description: transactionForm.description.trim(),
          payment_mode: transactionForm.payment_mode,
          contractor_name: transactionForm.contractor_name || null,
        });
        
        if (error) throw error;
      }
      setShowTransactionModal(false);
      setEditingTransaction(null);
      setTransactionForm({
        category_id: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        payment_mode: 'Bank',
        contractor_name: '',
      });
      fetchData();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save transaction';
      setTransactionError(errorMessage);
      console.error('Error saving transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      await supabase.from('transactions').delete().eq('id', id);
      fetchData();
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category? All transactions in this category will also be deleted.')) {
      await supabase.from('categories').delete().eq('id', id);
      fetchData();
    }
  };

  const openEditCategory = (cat: CategoryWithTotal) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      budget_limit: String(cat.budget_limit),
      icon: cat.icon,
    });
    setShowCategoryModal(true);
  };

  const openEditTransaction = (txn: Transaction) => {
    setEditingTransaction(txn);
    setTransactionForm({
      category_id: txn.category_id,
      amount: String(txn.amount),
      date: txn.date,
      description: txn.description || '',
      payment_mode: txn.payment_mode,
      contractor_name: txn.contractor_name || '',
    });
    setShowTransactionModal(true);
  };

  const budgetUsed = stats.total_budget > 0 ? (stats.total_spent / stats.total_budget) * 100 : 0;
  const isOverBudget = stats.total_spent > stats.total_budget;

  const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4 rounded-lg shadow-lg">
        <p className="text-center text-lg font-semibold">Application Created by Bhosale's</p>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500">Track your construction expenses</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setEditingCategory(null); setCategoryForm({ name: '', budget_limit: '', icon: 'package' }); setShowCategoryModal(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Add Category
          </Button>
          <Link href="/expenses/new">
            <Button>
              <Receipt className="w-4 h-4 mr-2" /> Add Expense
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Spent</p>
                <p className="text-2xl font-bold font-mono text-slate-800 mt-1">{formatCurrency(stats.total_spent)}</p>
              </div>
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', isOverBudget ? 'bg-red-100' : 'bg-indigo-100')}>
                <DollarSign className={cn('w-6 h-6', isOverBudget ? 'text-red-600' : 'text-indigo-600')} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Budget</p>
                <p className="text-2xl font-bold font-mono text-slate-800 mt-1">{formatCurrency(stats.total_budget)}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                {isOverBudget ? <TrendingDown className="w-6 h-6 text-red-600" /> : <TrendingUp className="w-6 h-6 text-emerald-600" />}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Categories</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stats.category_count}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Transactions</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stats.transaction_count}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">{formatCurrency(stats.total_spent)} spent of {formatCurrency(stats.total_budget)}</span>
              <span className={cn('font-medium', isOverBudget ? 'text-red-600' : 'text-emerald-600')}>{budgetUsed.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className={cn('h-full rounded-full transition-all', isOverBudget ? 'bg-red-500' : budgetUsed > 80 ? 'bg-amber-500' : 'bg-emerald-500')} style={{ width: `${Math.min(budgetUsed, 100)}%` }} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Expenses</CardTitle>
            <Button variant="outline" size="sm" onClick={() => { setEditingTransaction(null); setTransactionForm({ category_id: categories[0]?.id || '', amount: '', date: new Date().toISOString().split('T')[0], description: '', payment_mode: 'Bank', contractor_name: '' }); setShowTransactionModal(true); }}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {transactions.slice(0, 10).map((txn) => {
                const category = categories.find(c => c.id === txn.category_id);
                const IconComponent = iconMap[category?.icon || 'package'] || Package;
                return (
                  <div key={txn.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{category?.name || 'Unknown'}</p>
                        <p className="text-xs text-slate-500">{txn.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right mr-2">
                        <p className="text-sm font-bold font-mono text-slate-800">{formatCurrency(Number(txn.amount))}</p>
                        <p className="text-xs text-slate-500">{formatDate(txn.date)}</p>
                      </div>
                      <button onClick={() => openEditTransaction(txn)} className="p-1 text-slate-400 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteTransaction(txn.id)} className="p-1 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Spending by Category</CardTitle>
            <Link href="/reports" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">View All <ArrowRight className="w-4 h-4" /></Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {categories.map((category) => {
                const IconComponent = iconMap[category.icon] || Package;
                const percentage = stats.total_spent > 0 ? (category.total_spent / stats.total_spent) * 100 : 0;
                const isOver = Number(category.total_spent) > Number(category.budget_limit);
                return (
                  <div key={category.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{category.name}</p>
                        <p className="text-xs text-slate-500">{category.transaction_count} transactions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right mr-2">
                        <p className={cn('text-sm font-bold font-mono', isOver ? 'text-red-600' : 'text-slate-800')}>{formatCurrency(Number(category.total_spent))}</p>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div className={cn('h-full rounded-full', isOver ? 'bg-red-500' : 'bg-indigo-500')} style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                      <button onClick={() => openEditCategory(category)} className="p-1 text-slate-400 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteCategory(category.id)} className="p-1 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Modal */}
      <EditModal isOpen={showCategoryModal} onClose={() => { setShowCategoryModal(false); setCategoryError(null); }} title={editingCategory ? 'Edit Category' : 'Add Category'}>
        <form onSubmit={handleAddCategory} className="space-y-4">
          {categoryError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {categoryError}
            </div>
          )}
          <Input label="Category Name" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} required placeholder="e.g., Cement" />
          <Input label="Budget Limit (₹)" type="number" value={categoryForm.budget_limit} onChange={e => setCategoryForm({...categoryForm, budget_limit: e.target.value})} required placeholder="e.g., 150000" />
          <Select label="Icon" value={categoryForm.icon} onChange={e => setCategoryForm({...categoryForm, icon: e.target.value})} options={[
            { value: 'package', label: 'Package' },
            { value: 'hammer', label: 'Hammer' },
            { value: 'truck', label: 'Truck' },
            { value: 'hard-hat', label: 'Hard Hat' },
            { value: 'zap', label: 'Electrical' },
            { value: 'droplets', label: 'Plumbing' },
          ]} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => { setShowCategoryModal(false); setCategoryError(null); }}>Cancel</Button>
            <Button type="submit">{editingCategory ? 'Update' : 'Add'}</Button>
          </div>
        </form>
      </EditModal>

      {/* Transaction Modal */}
      <EditModal isOpen={showTransactionModal} onClose={() => { setShowTransactionModal(false); setTransactionError(null); }} title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}>
        <form onSubmit={handleAddTransaction} className="space-y-4">
          {transactionError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {transactionError}
            </div>
          )}
          <Select label="Category" value={transactionForm.category_id} onChange={e => setTransactionForm({...transactionForm, category_id: e.target.value})} options={[{ value: '', label: 'Select category' }, ...categoryOptions]} required />
          <Input label="Amount (₹)" type="number" value={transactionForm.amount} onChange={e => setTransactionForm({...transactionForm, amount: e.target.value})} required />
          <Input label="Date" type="date" value={transactionForm.date} onChange={e => setTransactionForm({...transactionForm, date: e.target.value})} required />
          <Textarea label="Description" value={transactionForm.description} onChange={e => setTransactionForm({...transactionForm, description: e.target.value})} required rows={2} />
          <Select label="Payment Mode" value={transactionForm.payment_mode} onChange={e => setTransactionForm({...transactionForm, payment_mode: e.target.value})} options={[
            { value: 'Cash', label: 'Cash' },
            { value: 'UPI', label: 'UPI' },
            { value: 'Bank', label: 'Bank Transfer' },
          ]} />
          <Input label="Contractor Name" value={transactionForm.contractor_name} onChange={e => setTransactionForm({...transactionForm, contractor_name: e.target.value})} placeholder="Optional" />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => { setShowTransactionModal(false); setTransactionError(null); }}>Cancel</Button>
            <Button type="submit">{editingTransaction ? 'Update' : 'Add'}</Button>
          </div>
        </form>
      </EditModal>
    </div>
  );
}
