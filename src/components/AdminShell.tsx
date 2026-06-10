'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Menu, ArrowUpRight } from 'lucide-react';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />

      <main className="flex-1 overflow-x-hidden w-full flex flex-col">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between md:hidden z-30">
          <div className="flex items-center gap-2">
            <div className="w-[30px] h-[30px] bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <ArrowUpRight className="text-white w-[18px] h-[18px] stroke-[2.5]" />
            </div>
            <div className="font-extrabold text-gray-900 text-[15px] tracking-tight">MadeWebs</div>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Menu className="w-[22px] h-[22px]" />
          </button>
        </header>

        <div className="max-w-[1400px] mx-auto w-full p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
