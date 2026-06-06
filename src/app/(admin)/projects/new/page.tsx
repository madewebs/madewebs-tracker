'use client';

import { useActionState } from 'react';
import { createProject } from './actions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PLANS = [
  { name: "Basic", value: 3999 },
  { name: "Starter", value: 5999 },
  { name: "Professional", value: 9999 },
  { name: "Premium", value: 15000 },
];

export default function NewProjectPage() {
  const [state, formAction, isPending] = useActionState(createProject, null);

  return (
    <div className="max-w-[800px]">
      <Link href="/projects" className="inline-flex items-center gap-2 text-primary text-sm font-semibold mb-6 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Projects
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 m-0">Create New Project</h1>
        <p className="text-sm text-gray-500 mt-1">Enter the client and project details to start tracking.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-[14px] shadow-sm overflow-hidden">
        <form action={formAction} className="p-6">
          <div className="grid gap-8">
            
            {/* Client Info */}
            <div>
              <h3 className="text-[15px] font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Client Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="company_name">Company Name <span className="text-red-500">*</span></Label>
                  <Input type="text" id="company_name" name="company_name" required />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="contact_person">Contact Person</Label>
                  <Input type="text" id="contact_person" name="contact_person" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input type="tel" id="phone" name="phone" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input type="email" id="email" name="email" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="website">Current Website</Label>
                  <Input type="url" id="website" name="website" placeholder="https://" />
                </div>
              </div>
            </div>

            {/* Project Info */}
            <div>
              <h3 className="text-[15px] font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Project Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="plan">Plan</Label>
                  <select name="plan" id="plan" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="">Select Plan...</option>
                    {PLANS.map(p => (
                      <option key={p.name} value={p.name}>{p.name} (₹{p.value})</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="assigned_to">Assigned Employee</Label>
                  <Input type="text" id="assigned_to" name="assigned_to" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input type="date" id="deadline" name="deadline" />
                </div>
              </div>
            </div>

            {/* Financials */}
            <div>
              <h3 className="text-[15px] font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Financials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="project_value">Project Value (₹)</Label>
                  <Input type="number" id="project_value" name="project_value" defaultValue="0" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="advance_received">Advance Received (₹)</Label>
                  <Input type="number" id="advance_received" name="advance_received" defaultValue="0" />
                </div>
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-[15px] font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Project Links (Optional)</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="github_url">GitHub Repository URL</Label>
                  <Input type="url" id="github_url" name="github_url" placeholder="https://github.com/..." />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="preview_url">Vercel Preview URL</Label>
                  <Input type="url" id="preview_url" name="preview_url" placeholder="https://..." />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="live_url">Live Website URL</Label>
                  <Input type="url" id="live_url" name="live_url" placeholder="https://..." />
                </div>
              </div>
            </div>

          </div>

          {state?.error && (
            <div className="mt-6 text-red-600 bg-red-50 p-3 rounded-lg text-sm border border-red-200">
              {state.error}
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
            <Button 
              type="submit" 
              disabled={isPending}
            >
              {isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
