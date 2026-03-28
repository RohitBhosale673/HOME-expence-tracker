'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, Select, Textarea } from '@/components/ui/input';
import { getTransactions, getCategories, deleteTransaction, updateTransaction } from '@/lib/local-db';
import type { Category, Transaction } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Calendar,
  CreditCard,
  DollarSign,
  Edit,
  FileText,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

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

export default function ContractorsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContractor, setSelectedContractor] = useState<string>('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category_id: '',
    amount: '',
    date: '',
    description: '',
    payment_mode: 'Bank',
    contractor_name: '',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const rawTxns = await getTransactions();
      const rawCats = await getCategories();
      
      setTransactions([...rawTxns].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setCategories([...rawCats].sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const allContractors = Array.from(new Set(transactions.map((t) => t.contractor_name).filter(Boolean))) as string[];

  const filteredTransactions = transactions.filter(txn =>
    !selectedContractor || txn.contractor_name === selectedContractor
  );

  const contractorPayments = filteredTransactions.reduce((acc, txn) => {
    if (txn.contractor_name) {
      acc[txn.contractor_name] = (acc[txn.contractor_name] || 0) + Number(txn.amount);
    }
    return acc;
  }, {} as Record<string, number>);

  const totalPaid = Object.values(contractorPayments).reduce((a, b) => a + b, 0);

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
    setError(null);
    
    // Validation
    if (!formData.category_id) {
      setError('Please select a category');
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, {
          category_id: formData.category_id,
          amount: Number(formData.amount),
          date: formData.date,
          description: formData.description.trim(),
          payment_mode: formData.payment_mode as any,
          contractor_name: formData.contractor_name || null,
        });
      }
      setShowEditModal(false);
      setEditingTransaction(null);
      fetchData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save transaction';
      setError(errorMessage);
      console.error('Error saving transaction:', err);
    }
  };

  const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Contractor Ledger</h1>
          <p className="text-slate-500">Track payments to contractors and vendors</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-72">
          <Select label="Select Contractor" options={[
            { value: '', label: 'All Contractors' },
            ...allContractors.map((c) => ({ value: c, label: c })),
          ]} value={selectedContractor} onChange={(e) => setSelectedContractor(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Contractors</p>
                <p className="text-xl font-bold text-slate-800 mt-1">{Object.keys(contractorPayments).length}</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center"><Users className="w-5 h-5 text-indigo-600" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Paid</p>
                <p className="text-xl font-bold font-mono text-slate-800 mt-1">{formatCurrency(totalPaid)}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center"><DollarSign className="w-5 h-5 text-emerald-600" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Transactions</p>
                <p className="text-xl font-bold text-slate-800 mt-1">{filteredTransactions.length}</p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center"><FileText className="w-5 h-5 text-amber-600" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {!selectedContractor && Object.keys(contractorPayments).length > 0 && (
        <Card>
          <CardHeader><CardTitle>Payment Summary by Contractor</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Contractor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Transactions</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Total Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Object.entries(contractorPayments).sort((a, b) => b[1] - a[1]).map(([contractor, total]) => {
                    const count = filteredTransactions.filter(t => t.contractor_name === contractor).length;
                    return (
                      <tr key={contractor} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedContractor(contractor)}>
                        <td className="px-6 py-4 text-sm font-medium text-slate-800">{contractor}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{count} payments</td>
                        <td className="px-6 py-4 text-right"><span className="font-mono font-bold text-slate-800">{formatCurrency(total)}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>{selectedContractor ? `Payments to ${selectedContractor}` : 'All Contractor Payments'}</CardTitle>
          {selectedContractor && <button onClick={() => setSelectedContractor('')} className="text-sm text-indigo-600 hover:text-indigo-700">Clear filter</button>}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{formatDate(txn.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="font-mono font-bold text-slate-800">{formatCurrency(Number(txn.amount))}</span></td>
                    <td className="px-6 py-4 text-sm text-slate-700 max-w-xs truncate">{txn.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><Badge variant={txn.payment_mode === 'Cash' ? 'warning' : txn.payment_mode === 'UPI' ? 'info' : 'default'}>{txn.payment_mode}</Badge></td>
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
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No transactions found</p>
            </div>
          )}
        </CardContent>
      </Card>

      <EditModal isOpen={showEditModal} onClose={() => { setShowEditModal(false); setError(null); }} title="Edit Transaction">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}
          <Select label="Category" value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} options={[{ value: '', label: 'Select category' }, ...categoryOptions]} required />
          <Input label="Amount (₹)" type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
          <Input label="Date" type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
          <Textarea label="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required rows={2} />
          <Select label="Payment Mode" value={formData.payment_mode} onChange={e => setFormData({...formData, payment_mode: e.target.value})} options={[{ value: 'Cash', label: 'Cash' }, { value: 'UPI', label: 'UPI' }, { value: 'Bank', label: 'Bank Transfer' }]} />
          <Input label="Contractor Name" value={formData.contractor_name} onChange={e => setFormData({...formData, contractor_name: e.target.value})} placeholder="Optional" />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => { setShowEditModal(false); setError(null); }}>Cancel</Button>
            <Button type="submit">Update</Button>
          </div>
        </form>
      </EditModal>
    </div>
  );
}
