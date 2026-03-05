'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { formatCurrency, cn } from '@/lib/utils';
import type { CategoryWithTotal, Transaction, Category } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import {
  FileBarChart,
  TrendingUp,
  TrendingDown,
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

export default function ReportsPage() {
  const [categories, setCategories] = useState<CategoryWithTotal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'spent'>('name');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', budget_limit: '', icon: 'package' });

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
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredCategories = categories
    .filter(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => sortBy === 'name' ? a.name.localeCompare(b.name) : Number(b.total_spent) - Number(a.total_spent));

  const totalSpent = categories.reduce((acc, cat) => acc + Number(cat.total_spent), 0);
  const totalBudget = categories.reduce((acc, cat) => acc + Number(cat.budget_limit), 0);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await supabase.from('categories').update({
          name: categoryForm.name,
          budget_limit: Number(categoryForm.budget_limit),
          icon: categoryForm.icon,
        }).eq('id', editingCategory.id);
      } else {
        await supabase.from('categories').insert({
          name: categoryForm.name,
          budget_limit: Number(categoryForm.budget_limit),
          icon: categoryForm.icon,
        });
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
      setCategoryForm({ name: '', budget_limit: '', icon: 'package' });
      fetchData();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Delete this category and all its transactions?')) {
      await supabase.from('categories').delete().eq('id', id);
      fetchData();
    }
  };

  const openEditCategory = (cat: CategoryWithTotal) => {
    setEditingCategory(cat);
    setCategoryForm({ name: cat.name, budget_limit: String(cat.budget_limit), icon: cat.icon });
    setShowCategoryModal(true);
  };

  const iconOptions = [
    { value: 'package', label: 'Package' }, { value: 'hammer', label: 'Hammer' },
    { value: 'truck', label: 'Truck' }, { value: 'hard-hat', label: 'Hard Hat' },
    { value: 'zap', label: 'Electrical' }, { value: 'droplets', label: 'Plumbing' },
    { value: 'paintbrush', label: 'Painting' }, { value: 'square', label: 'Tiles' },
    { value: 'layers', label: 'Steel' }, { value: 'mountain', label: 'Sand' },
    { value: 'blocks', label: 'Bricks' },
  ];

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
          <p className="text-slate-500">Detailed expense breakdown by category</p>
        </div>
        <Button onClick={() => { setEditingCategory(null); setCategoryForm({ name: '', budget_limit: '', icon: 'package' }); setShowCategoryModal(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Spent</p>
                <p className="text-xl font-bold font-mono text-slate-800 mt-1">{formatCurrency(totalSpent)}</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center"><TrendingUp className="w-5 h-5 text-indigo-600" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Budget</p>
                <p className="text-xl font-bold font-mono text-slate-800 mt-1">{formatCurrency(totalBudget)}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center"><FileBarChart className="w-5 h-5 text-emerald-600" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Remaining</p>
                <p className={cn('text-xl font-bold font-mono mt-1', totalBudget - totalSpent < 0 ? 'text-red-600' : 'text-emerald-600')}>
                  {formatCurrency(totalBudget - totalSpent)}
                </p>
              </div>
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', totalBudget - totalSpent < 0 ? 'bg-red-100' : 'bg-amber-100')}>
                {totalBudget - totalSpent < 0 ? <TrendingDown className="w-5 h-5 text-red-600" /> : <TrendingUp className="w-5 h-5 text-amber-600" />}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <input type="text" placeholder="Search categories..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          className="px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <select value={sortBy} onChange={e => setSortBy(e.target.value as 'name' | 'spent')}
          className="px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="name">Sort by Name</option>
          <option value="spent">Sort by Spent</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCategories.map((category) => {
          const IconComponent = iconMap[category.icon] || Package;
          const percentage = Number(category.budget_limit) > 0 ? (Number(category.total_spent) / Number(category.budget_limit)) * 100 : 0;
          const isOverBudget = Number(category.total_spent) > Number(category.budget_limit);
          const remaining = Number(category.budget_limit) - Number(category.total_spent);

          return (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-slate-600" />
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEditCategory(category)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteCategory(category.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">{category.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{category.transaction_count} transactions</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Spent</span>
                    <span className={cn('font-mono font-medium', isOverBudget ? 'text-red-600' : 'text-slate-800')}>{formatCurrency(Number(category.total_spent))}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full', isOverBudget ? 'bg-red-500' : percentage > 80 ? 'bg-amber-500' : 'bg-emerald-500')} style={{ width: `${Math.min(percentage, 100)}%` }} />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Budget</span>
                    <span className="text-slate-500 font-mono">{formatCurrency(Number(category.budget_limit))}</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
                  <span className="text-slate-500">{isOverBudget ? 'Over by' : 'Remaining'}</span>
                  <span className={cn('font-medium font-mono', isOverBudget ? 'text-red-600' : 'text-emerald-600')}>{formatCurrency(Math.abs(remaining))}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No categories found</p>
        </div>
      )}

      <EditModal isOpen={showCategoryModal} onClose={() => setShowCategoryModal(false)} title={editingCategory ? 'Edit Category' : 'Add Category'}>
        <form onSubmit={handleAddCategory} className="space-y-4">
          <Input label="Category Name" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} required placeholder="e.g., Cement" />
          <Input label="Budget Limit (₹)" type="number" value={categoryForm.budget_limit} onChange={e => setCategoryForm({...categoryForm, budget_limit: e.target.value})} required placeholder="e.g., 150000" />
          <Select label="Icon" value={categoryForm.icon} onChange={e => setCategoryForm({...categoryForm, icon: e.target.value})} options={iconOptions} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowCategoryModal(false)}>Cancel</Button>
            <Button type="submit">{editingCategory ? 'Update' : 'Add'}</Button>
          </div>
        </form>
      </EditModal>
    </div>
  );
}
