'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  PlusCircle,
  FileBarChart,
  Users,
  Camera,
  Menu,
  X,
  HardHat,
  TrendingUp,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/expenses/new', label: 'Add Expense', icon: PlusCircle },
  { href: '/reports', label: 'Reports', icon: FileBarChart },
  { href: '/contractors', label: 'Contractors', icon: Users },
  { href: '/gallery', label: 'Gallery', icon: Camera },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <HardHat className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">BuildTrack</h1>
              <p className="text-xs text-slate-500">Pro</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  )}
                >
                  <item.icon className={cn('w-5 h-5', isActive && 'text-indigo-600')} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Stats footer */}
          <div className="px-4 py-4 border-t border-slate-100">
            <div className="p-4 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl">
              <div className="flex items-center gap-2 text-white/80 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium">Track Every Rupee</span>
              </div>
              <p className="text-white/60 text-xs">
                Construction expenses made simple
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
