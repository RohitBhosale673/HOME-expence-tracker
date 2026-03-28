'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Textarea, Select } from '@/components/ui/input';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import type { CategoryWithTotal, Transaction, Category } from '@/lib/types';
import { getCategories, getTransactions, deleteTransaction, updateTransaction, addTransaction } from '@/lib/local-db';
import {
  ArrowLeft,
  Download,
  Filter,
  Hammer,
  Truck,
  HardHat,
  Zap,
  Droplets,
  Paintbrush,
  Square,
  Layers,
  Mountain,
  Blocks,
  Package,
  Calendar,
  DollarSign,
  FileText,
  User,
  CreditCard,
  Edit,
  Trash2,
  Plus,
  X,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'hammer': Hammer, 'truck': Truck, 'hard-hat': HardHat, 'zap': Zap,
  'droplets': Droplets, 'paintbrush': Paintbrush, 'square': Square,
  'layers': Layers, 'mountain': Mountain, 'blocks': Blocks, 'package': Package,
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
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-slate-800 mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default function CategoryDetailPage() {
  const params = useParams();
  const categoryId = params.category_id as string;

  const [category, setCategory] = useState<CategoryWithTotal | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    category_id: '',
    amount: '',
    date: '',
    description: '',
    payment_mode: 'Bank',
    contractor_name: '',
  });

  const fetchData = useCallback(async () => {
    if (!categoryId) return;
    setLoading(true);
    try {
      const rawCats = await getCategories();
      const rawTxns = await getTransactions();
      
      const cat = rawCats.find(c => c.id === categoryId);
      const txns = rawTxns
        .filter(t => t.category_id === categoryId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
      const allCats = [...rawCats].sort((a, b) => a.name.localeCompare(b.name));

      if (cat) {
        const totalSpent = txns.reduce((sum: number, t: Transaction) => sum + (Number(t.amount) || 0), 0);
        setCategory({
          ...cat,
          total_spent: totalSpent,
          transaction_count: txns.length,
        });
      }
      setTransactions(txns);
      setCategories(allCats);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  }, [categoryId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleEdit = (txn: Transaction) => {
    setEditingTransaction(txn);
    setFormData({
      category_id: txn.category_id,
      amount: String(txn.amount),
      date: txn.date,
      description: txn.description || '',
      payment_mode: txn.payment_mode,
      contractor_name: txn.contractor_name || '',
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this transaction?')) {
      await deleteTransaction(id);
      fetchData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, {
          category_id: formData.category_id,
          amount: Number(formData.amount),
          date: formData.date,
          description: formData.description,
          payment_mode: formData.payment_mode as any,
          contractor_name: formData.contractor_name || null,
        });
      } else {
        await addTransaction({
          category_id: categoryId,
          amount: Number(formData.amount),
          date: formData.date,
          description: formData.description,
          payment_mode: formData.payment_mode as any,
          contractor_name: formData.contractor_name || null,
          receipt_url: null,
        });
      }
      setShowEditModal(false);
      setEditingTransaction(null);
      setFormData({ category_id: '', amount: '', date: new Date().toISOString().split('T')[0], description: '', payment_mode: 'Bank', contractor_name: '' });
      fetchData();
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Amount', 'Description', 'Payment Mode', 'Contractor'];
    const rows = filteredTransactions.map((txn) => [txn.date, txn.amount, txn.description, txn.payment_mode, txn.contractor_name || '']);
    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${category?.name}-expenses.csv`;
    a.click();
  };

  if (loading || !category) {
    return <div className="flex items-center justify-center min-h-[60vh]">Loading...</div>;
  }

  const IconComponent = iconMap[category.icon] || Package;
  const isOverBudget = Number(category.total_spent) > Number(category.budget_limit);
  const remaining = Number(category.budget_limit) - Number(category.total_spent);
  const percentage = Number(category.budget_limit) > 0 ? (Number(category.total_spent) / Number(category.budget_limit)) * 100 : 0;

  const filteredTransactions = transactions.filter(txn => paymentFilter === 'all' ? true : txn.payment_mode === paymentFilter);
  const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/reports" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <IconComponent className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{category.name}</h1>
              <p className="text-slate-500">Expense breakdown</p>
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={() => { setEditingTransaction(null); setFormData({ category_id: categoryId, amount: '', date: new Date().toISOString().split('T')[0], description: '', payment_mode: 'Bank', contractor_name: '' }); setShowEditModal(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add
        </Button>
        <Button variant="outline" onClick={exportToCSV}>
          <Download className="w-4 h-4 mr-2" /> Export
        </Button>
      </div>

      <Card className={cn('border-2', isOverBudget ? 'border-red-200 bg-red-50' : 'border-indigo-200 bg-indigo-50')}>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">Grand Total</p>
              <p className={cn('text-3xl font-bold font-mono', isOverBudget ? 'text-red-700' : 'text-indigo-700')}>{formatCurrency(Number(category.total_spent))}</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-slate-500 mb-1">Budget</p>
                <p className="font-mono font-medium text-slate-700">{formatCurrency(Number(category.budget_limit))}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">{isOverBudget ? 'Over by' : 'Remaining'}</p>
                <p className={cn('font-mono font-medium', isOverBudget ? 'text-red-600' : 'text-emerald-600')}>{formatCurrency(Math.abs(remaining))}</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600">{percentage.toFixed(1)}% used</span>
              <span className="text-slate-500">of budget</span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div className={cn('h-full rounded-full', isOverBudget ? 'bg-red-500' : percentage > 80 ? 'bg-amber-500' : 'bg-emerald-500')} style={{ width: `${Math.min(percentage, 100)}%` }} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>All Transactions ({filteredTransactions.length})</CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="all">All Payments</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Bank">Bank Transfer</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase"><div className="flex items-center gap-1"><Calendar className="w-3 h-3" />Date</div></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase"><div className="flex items-center gap-1"><DollarSign className="w-3 h-3" />Amount</div></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase"><div className="flex items-center gap-1"><FileText className="w-3 h-3" />Description</div></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase"><div className="flex items-center gap-1"><CreditCard className="w-3 h-3" />Mode</div></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase"><div className="flex items-center gap-1"><User className="w-3 h-3" />Contractor</div></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{formatDate(txn.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="font-mono font-bold text-slate-800">{formatCurrency(Number(txn.amount))}</span></td>
                    <td className="px-6 py-4 text-sm text-slate-700 max-w-xs truncate">{txn.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><Badge variant={txn.payment_mode === 'Cash' ? 'warning' : txn.payment_mode === 'UPI' ? 'info' : 'default'}>{txn.payment_mode}</Badge></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{txn.contractor_name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(txn)} className="p-1 text-slate-400 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(txn.id)} className="p-1 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredTransactions.length === 0 && (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No transactions found</p>
            </div>
          )}
        </CardContent>
      </Card>

      <EditModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Category" value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} options={[{ value: '', label: 'Select category' }, ...categoryOptions]} required />
          <Input label="Amount (₹)" type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
          <Input label="Date" type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
          <Textarea label="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required rows={2} />
          <Select label="Payment Mode" value={formData.payment_mode} onChange={e => setFormData({...formData, payment_mode: e.target.value})} options={[{ value: 'Cash', label: 'Cash' }, { value: 'UPI', label: 'UPI' }, { value: 'Bank', label: 'Bank Transfer' }]} />
          <Input label="Contractor Name" value={formData.contractor_name} onChange={e => setFormData({...formData, contractor_name: e.target.value})} placeholder="Optional" />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button type="submit">{editingTransaction ? 'Update' : 'Add'}</Button>
          </div>
        </form>
      </EditModal>
    </div>
  );
}
