'use client';

import { useState, useActionState } from 'react';
import { login } from './actions';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] to-[#e6f5fb] flex items-center justify-center p-6">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <div className="w-[70px] h-[70px] bg-primary rounded-[18px] flex items-center justify-center mx-auto mb-4 shadow-[0_8px_24px_rgba(7,143,205,0.35)]">
            <ArrowUpRight className="text-white w-10 h-10 stroke-[2.5]" />
          </div>
          <h1 className="text-[26px] font-extrabold text-gray-900 m-0">MadeWebs Tracker</h1>
          <p className="text-sm text-gray-500 mt-1.5">Project Operations Dashboard</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Sign in to your account</h2>
          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email"
                name="email"
                type="email" 
                placeholder="admin@madewebs.com"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                name="password"
                type="password" 
                placeholder="••••••••"
                required
              />
            </div>
            
            {state?.error && (
              <div className="text-red-500 text-[13px] bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {state.error}
              </div>
            )}
            
            <Button 
              type="submit"
              disabled={isPending}
              className="mt-2 w-full font-semibold"
              size="lg"
            >
              {isPending ? "Signing in..." : "Sign In →"}
            </Button>
          </form>
        </div>
        <p className="text-center text-xs text-gray-400 mt-5">
          Internal MadeWebs tool — no public access
        </p>
      </div>
    </div>
  );
}
