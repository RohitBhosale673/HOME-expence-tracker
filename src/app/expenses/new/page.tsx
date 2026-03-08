'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, Textarea, Select } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/lib/types';
import {
  Receipt,
  Upload,
  ArrowLeft,
  DollarSign,
  Calendar,
  User,
  CreditCard,
  CheckCircle,
  X,
} from 'lucide-react';

const paymentModes = [
  { value: 'Cash', label: 'Cash' },
  { value: 'UPI', label: 'UPI' },
  { value: 'Bank', label: 'Bank Transfer' },
];

export default function NewExpensePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category_id: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    payment_mode: 'Bank',
    contractor_name: '',
    receipt: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*').order('name');
      if (data && data.length > 0) {
        setCategories(data);
        setFormData(prev => ({ ...prev, category_id: data[0].id }));
      }
    };
    fetchCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, receipt: file });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let receiptUrl: string | null = null;

      // Upload receipt if exists
      if (formData.receipt) {
        const fileName = `${Date.now()}-${formData.receipt.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(fileName, formData.receipt);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          // Continue without receipt if upload fails
        } else if (uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from('receipts')
            .getPublicUrl(fileName);
          receiptUrl = publicUrl;
        }
      }

      // Save transaction to database
      const { data, error: insertError } = await supabase
        .from('transactions')
        .insert({
          category_id: formData.category_id,
          amount: Number(formData.amount),
          date: formData.date,
          description: formData.description,
          payment_mode: formData.payment_mode,
          contractor_name: formData.contractor_name || null,
          receipt_url: receiptUrl,
        })
        .select();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      console.log('Transaction saved:', data);
      setIsSubmitting(false);
      setIsSuccess(true);

      // Redirect after success
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (err: any) {
      console.error('Error saving expense:', err);
      setError(err.message || 'Failed to save expense. Please try again.');
      setIsSubmitting(false);
    }
  };

  const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Expense Added!</h2>
            <p className="text-slate-500">
              Your expense has been recorded successfully.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Add Expense</h1>
          <p className="text-slate-500">Record a new construction expense</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {categories.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-slate-500 mb-4">No categories found. Please add a category first.</p>
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-indigo-600" />
                Expense Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category */}
              <Select
                label="Category"
                required
                options={[
                  { value: '', label: 'Select a category' },
                  ...categoryOptions,
                ]}
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              />

              {/* Amount and Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="number"
                    label="Amount (₹)"
                    required
                    min="0"
                    step="1"
                    placeholder="0"
                    className="pl-10 font-mono"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="date"
                    label="Date"
                    required
                    className="pl-10"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>

              {/* Description */}
              <Textarea
                label="Description"
                required
                placeholder="e.g., 20 bags of Dalmia Cement for foundation"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              {/* Payment Mode */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Payment Mode
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {paymentModes.map((mode) => (
                    <button
                      key={mode.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, payment_mode: mode.value })}
                      className={cn(
                        'flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all',
                        formData.payment_mode === mode.value
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      )}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span className="text-sm font-medium">{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contractor Name (Optional) */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  label="Contractor Name (Optional)"
                  placeholder="e.g., Sharma Suppliers"
                  className="pl-10"
                  value={formData.contractor_name}
                  onChange={(e) => setFormData({ ...formData, contractor_name: e.target.value })}
                />
              </div>

              {/* Receipt Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Receipt/Photo (Optional)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all',
                    previewUrl ? 'border-indigo-300 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
                  )}
                >
                  {previewUrl ? (
                    <div className="relative">
                      <img src={previewUrl} alt="Receipt preview" className="max-h-48 mx-auto rounded-lg" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData({ ...formData, receipt: null });
                          setPreviewUrl(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600">Click to upload receipt or photo</p>
                      <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 mt-6">
            <Link href="/dashboard">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" loading={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Expense'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
