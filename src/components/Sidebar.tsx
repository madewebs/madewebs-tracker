'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Home, Folder, DollarSign, Globe, Plus, Menu, ArrowUpRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { logout } from '@/app/login/actions';

const NAV = [
  { id: '/', icon: Home, label: 'Dashboard' },
  { id: '/projects', icon: Folder, label: 'Projects' },
  { id: '/domains', icon: Globe, label: 'Domains' },
  { id: '/projects/new', icon: Plus, label: 'New Project' },
];

export function Sidebar({ 
  mobileMenuOpen = false, 
  setMobileMenuOpen = () => {} 
}: { 
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (v: boolean) => void;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  return (
    <div className={cn(
      "bg-slate-900 flex flex-col h-[100dvh] fixed md:sticky top-0 left-0 z-50 transition-transform duration-300 ease-in-out border-r border-slate-800 shrink-0",
      collapsed ? "md:w-16" : "md:w-[230px]",
      "w-[260px]", // Fixed width on mobile
      mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
    )}>
      <div className="p-4 border-b border-white/10 flex items-center gap-2.5">
        <div className="w-[34px] h-[34px] bg-primary rounded-lg shrink-0 flex items-center justify-center shadow-sm">
          <ArrowUpRight className="text-white w-5 h-5 stroke-[2.5]" />
        </div>
        
        {!collapsed && (
          <div className="flex-1 min-w-0 opacity-100 transition-opacity duration-200">
            <div className="text-white font-bold text-sm leading-tight truncate">MadeWebs</div>
            <div className="text-slate-400 text-[11px] truncate">Tracker</div>
          </div>
        )}
        
        <button 
          onClick={() => {
            if (window.innerWidth < 768) {
              setMobileMenuOpen(false);
            } else {
              setCollapsed(!collapsed);
            }
          }}
          className={cn(
            "text-slate-400 hover:text-white transition-colors p-1 shrink-0 bg-transparent border-none cursor-pointer",
            collapsed && "mx-auto hidden md:block"
          )}
        >
          <span className="md:hidden"><X className="w-5 h-5" /></span>
          <span className="hidden md:block"><Menu className="w-5 h-5" /></span>
        </button>
      </div>

      <nav className="flex-1 px-2 py-3 overflow-y-auto">
        <div className="flex flex-col gap-1">
          {NAV.map((n) => {
            const isActive = pathname === n.id || (n.id !== '/' && pathname.startsWith(n.id));
            const Icon = n.icon;
            
            return (
              <Link 
                key={n.id} 
                href={n.id}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg border-none cursor-pointer text-left transition-all duration-150 whitespace-nowrap",
                  isActive 
                    ? "bg-primary/10 text-primary font-semibold" 
                    : "bg-transparent text-slate-400 font-normal hover:bg-slate-800 hover:text-slate-200"
                )}
                title={collapsed ? n.label : undefined}
              >
                <Icon className={cn("shrink-0", (collapsed && !mobileMenuOpen) ? "w-[18px] h-[18px] mx-auto md:block hidden" : "w-4 h-4", mobileMenuOpen && "w-4 h-4 mx-0 block")} />
                {(!collapsed || mobileMenuOpen) && <span>{n.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-white/10 mt-auto">
        {(!collapsed || mobileMenuOpen) ? (
          <>
            <div className="text-[11px] text-slate-500 mb-0.5">Logged in as</div>
            <div className="text-xs text-slate-400 font-medium truncate mb-3">admin@madewebs.com</div>
            <button 
              onClick={() => logout()}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer text-left w-full flex items-center gap-2"
            >
              <ArrowUpRight className="w-4 h-4 rotate-90" /> Sign out
            </button>
          </>
        ) : (
          <button 
            onClick={() => logout()}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer w-full flex justify-center hidden md:flex"
            title="Sign out"
          >
            <ArrowUpRight className="w-4 h-4 rotate-90" />
          </button>
        )}
      </div>
    </div>
  );
}
