'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CircleProgress } from '@/components/CircleProgress';
import { Plus } from 'lucide-react';

const STATUSES = ["Requirements", "Development", "Testing", "Review", "Deployment", "Completed"];

function statusColor(s: string) {
  const map: Record<string, string> = {
    Requirements: "#f59e0b", Development: "#078FCD", Testing: "#8b5cf6",
    Review: "#ec4899", Deployment: "#06b6d4", Completed: "#22c55e"
  };
  return map[s] || "#6b7280";
}

function calcFinancials(p: any) {
  const expenses = (p.salary_expense || 0) + (p.domain_cost || 0) + (p.hosting_cost || 0) + (p.other_expenses || 0);
  const received = (p.advance_received || 0) + (p.final_payment_received || 0);
  const pending = (p.project_value || 0) - received;
  return { expenses, received, pending };
}

export function ProjectList({ projects, checklists }: { projects: any[], checklists: any[] }) {
  const [filter, setFilter] = useState("All");
  
  const filtered = filter === "All" ? projects : projects.filter(p => p.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-[22px] font-extrabold text-gray-900 m-0">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">{projects.length} total projects</p>
        </div>
        <Link href="/projects/new" className="bg-primary text-white border-none rounded-xl px-4 py-2.5 text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> New Project
        </Link>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {["All", ...STATUSES].map(s => (
          <button 
            key={s} 
            onClick={() => setFilter(s)} 
            className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium cursor-pointer transition-all ${
              filter === s ? "bg-primary text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-10 bg-white border border-gray-200 rounded-[14px]">
            <p className="text-gray-400 text-sm">No projects found.</p>
          </div>
        ) : (
          filtered.map(p => {
            const projChecklists = checklists.filter(c => c.project_id === p.id);
            const totalTasks = projChecklists.length;
            const completedTasks = projChecklists.filter(c => c.completed).length;
            const pct = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
            
            const { pending } = calcFinancials(p);
            
            return (
              <Link 
                href={`/projects/${p.id}`} 
                key={p.id}
                className="bg-white border border-gray-200 rounded-[14px] p-4 flex items-center gap-4 flex-wrap cursor-pointer transition-all hover:border-primary hover:shadow-sm"
              >
                <CircleProgress pct={pct} size={56} stroke={5} />
                <div className="flex-1 min-w-[160px]">
                  <div className="text-[15px] font-bold text-gray-900">{p.company_name}</div>
                  <div className="text-[13px] text-gray-500 mt-0.5">
                    {p.plan} · {p.assigned_to || 'Unassigned'} {p.deadline ? `· Due ${new Date(p.deadline).toLocaleDateString()}` : ''}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                  <span 
                    className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: `${statusColor(p.status)}18`, color: statusColor(p.status), border: `1px solid ${statusColor(p.status)}40` }}
                  >
                    {p.status}
                  </span>
                  {pending > 0 && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-200">
                      Pending ₹{pending.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
