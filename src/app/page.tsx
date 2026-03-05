'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4 text-slate-800">Application Created by Bhosale's</h1>
        <p className="text-lg text-gray-600 mb-8">Redirecting to dashboard in 5 seconds...</p>
        <button 
          onClick={() => router.push('/dashboard')}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go to Dashboard Now
        </button>
      </div>
    </div>
  );
}
