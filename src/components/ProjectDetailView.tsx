'use client';

import { useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { CircleProgress } from '@/components/CircleProgress';
import { ArrowLeft, Copy, CheckCircle2, DollarSign, Link as LinkIcon, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const STATUSES = ["Requirements", "Development", "Testing", "Review", "Deployment", "Completed"];

function statusColor(s: string) {
  const map: Record<string, string> = {
    Requirements: "#f59e0b", Development: "#078FCD", Testing: "#8b5cf6",
    Review: "#ec4899", Deployment: "#06b6d4", Completed: "#22c55e"
  };
  return map[s] || "#6b7280";
}

export function ProjectDetailView({ 
  initialProject, 
  initialChecklists,
  initialUpdates 
}: { 
  initialProject: any, 
  initialChecklists: any[],
  initialUpdates: any[]
}) {
  const [project, setProject] = useState(initialProject);
  const [checklists, setChecklists] = useState(initialChecklists);
  const [activeTab, setActiveTab] = useState('checklist');
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  
  // Calculate progress
  const totalTasks = checklists.length;
  const completedTasks = checklists.filter(c => c.completed).length;
  const pct = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Group checklists by category
  const groupedChecklists = useMemo(() => {
    const groups: Record<string, any[]> = {};
    checklists.forEach(c => {
      if (!groups[c.category]) groups[c.category] = [];
      groups[c.category].push(c);
    });
    return groups;
  }, [checklists]);

  // Financials
  const expenses = (project.salary_expense || 0) + (project.domain_cost || 0) + (project.hosting_cost || 0) + (project.other_expenses || 0);
  const received = (project.advance_received || 0) + (project.final_payment_received || 0);
  const pending = (project.project_value || 0) - received;
  const profit = (project.project_value || 0) - expenses;

  // Handlers
  const handleToggleTask = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    
    // Optimistic update
    setChecklists(prev => prev.map(c => c.id === id ? { ...c, completed: newStatus } : c));
    
    // Supabase update
    await supabase
      .from('project_checklists')
      .update({ completed: newStatus, completed_at: newStatus ? new Date().toISOString() : null })
      .eq('id', id);
  };

  const handleUpdateField = async (field: string, value: any) => {
    // Optimistic update
    setProject((prev: any) => ({ ...prev, [field]: value }));
    
    // Supabase update
    await supabase
      .from('projects')
      .update({ [field]: value })
      .eq('id', project.id);
  };

  const copyEmployeeLink = () => {
    const url = `${window.location.origin}/update/${project.id}`;
    navigator.clipboard.writeText(url);
    alert("Employee link copied to clipboard!");
  };

  return (
    <div className="max-w-[900px]">
      <Link href="/projects" className="inline-flex items-center gap-2 text-primary text-sm font-semibold mb-5 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Projects
      </Link>

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-[16px] p-6 mb-6 shadow-sm flex flex-col md:flex-row items-start gap-6">
        <div className="shrink-0">
          <CircleProgress pct={pct} size={110} stroke={9} />
        </div>
        
        <div className="flex-1 min-w-0 w-full">
          <h1 className="text-[22px] font-extrabold text-gray-900 m-0 mb-2 truncate">{project.company_name}</h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[13px] font-semibold bg-primary/10 text-primary border border-primary/20">
              {project.plan}
            </span>
            
            {isEditingStatus ? (
              <select 
                value={project.status} 
                onChange={(e) => {
                  handleUpdateField('status', e.target.value);
                  setIsEditingStatus(false);
                }}
                onBlur={() => setIsEditingStatus(false)}
                className="text-xs border border-gray-300 rounded px-2 py-0.5 cursor-pointer outline-none"
                autoFocus
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            ) : (
              <span 
                onClick={() => setIsEditingStatus(true)}
                className="inline-block px-2.5 py-0.5 rounded-full text-[13px] font-semibold cursor-pointer hover:opacity-80 transition-opacity"
                style={{ backgroundColor: `${statusColor(project.status)}18`, color: statusColor(project.status), border: `1px solid ${statusColor(project.status)}40` }}
              >
                {project.status}
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Contact", value: project.contact_person },
              { label: "Assigned", value: project.assigned_to },
              { label: "Deadline", value: project.deadline ? new Date(project.deadline).toLocaleDateString() : '—' },
              { label: "Phone", value: project.phone },
              { label: "Email", value: project.email },
              { label: "Website", value: project.website },
            ].map(i => (
              <div key={i.label} className="min-w-0">
                <div className="text-[11px] text-gray-400 font-medium">{i.label}</div>
                <div className="text-[13px] text-gray-700 font-medium truncate">{i.value || "—"}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 overflow-hidden">
            <span className="text-[13px] text-blue-800 font-medium shrink-0">🔗 Employee Link:</span>
            <div className="flex items-center gap-2 w-full sm:w-auto min-w-0 flex-1">
              <code className="text-xs text-blue-800 bg-white border border-blue-100 rounded px-2 py-1.5 truncate flex-1 block">
                /update/{project.id}
              </code>
              <button 
                onClick={copyEmployeeLink}
                className="shrink-0 bg-primary text-white border-none rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer hover:bg-primary/90 flex items-center gap-1.5"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b border-gray-200 overflow-x-auto">
        {[
          { id: 'checklist', label: 'Checklist', icon: CheckCircle2 },
          { id: 'finance', label: 'Finance', icon: DollarSign },
          { id: 'links', label: 'Links', icon: LinkIcon },
          { id: 'updates', label: 'Updates', icon: MessageSquare }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button 
              key={t.id} 
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                isActive ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 bg-transparent'
              }`}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mb-10">
        
        {/* Checklist Tab */}
        {activeTab === 'checklist' && (
          <div className="grid gap-4">
            {Object.entries(groupedChecklists).map(([category, tasks]) => {
              const catDone = tasks.filter(t => t.completed).length;
              const catTotal = tasks.length;
              const catPct = catTotal === 0 ? 0 : (catDone / catTotal) * 100;
              
              return (
                <div key={category} className="bg-white border border-gray-200 rounded-[14px] p-5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-[15px] text-gray-900">{category}</span>
                    <span className="text-[13px] text-gray-500">{catDone}/{catTotal}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-300" 
                      style={{ width: `${catPct}%`, backgroundColor: catPct === 100 ? '#22c55e' : '#078FCD' }} 
                    />
                  </div>
                  <div className="grid gap-2">
                    {tasks.map(task => (
                      <label key={task.id} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={task.completed} 
                          onChange={() => handleToggleTask(task.id, task.completed)}
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary" 
                        />
                        <span className={`text-sm select-none ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900 group-hover:text-primary'}`}>
                          {task.task_name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Finance Tab */}
        {activeTab === 'finance' && (
          <div className="bg-white border border-gray-200 rounded-[14px] p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <div className="text-[11px] text-gray-500 uppercase font-bold mb-1">Project Value</div>
                <div className="text-xl font-bold text-gray-900">₹{project.project_value?.toLocaleString() || 0}</div>
              </div>
              <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                <div className="text-[11px] text-green-600 uppercase font-bold mb-1">Received</div>
                <div className="text-xl font-bold text-green-700">₹{received.toLocaleString()}</div>
              </div>
              <div className="bg-red-50 rounded-xl p-3 border border-red-100">
                <div className="text-[11px] text-red-600 uppercase font-bold mb-1">Expenses</div>
                <div className="text-xl font-bold text-red-700">₹{expenses.toLocaleString()}</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
                <div className="text-[11px] text-orange-600 uppercase font-bold mb-1">Pending</div>
                <div className="text-xl font-bold text-orange-700">₹{pending.toLocaleString()}</div>
              </div>
              <div className={`rounded-xl p-3 border ${profit >= 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'} col-span-2 sm:col-span-1`}>
                <div className={`text-[11px] uppercase font-bold mb-1 ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>Profit</div>
                <div className={`text-xl font-bold ${profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>₹{profit.toLocaleString()}</div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <h4 className="text-sm font-bold text-gray-900 mb-4">Edit Financial Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { field: "project_value", label: "Project Value (₹)" },
                  { field: "advance_received", label: "Advance Received (₹)" },
                  { field: "final_payment_received", label: "Final Payment (₹)" },
                  { field: "salary_expense", label: "Salary Expense (₹)" },
                  { field: "domain_cost", label: "Domain Cost (₹)" },
                  { field: "hosting_cost", label: "Hosting Cost (₹)" },
                  { field: "other_expenses", label: "Other Expenses (₹)" },
                ].map(({ field, label }) => (
                  <div key={field} className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-gray-700">{label}</label>
                    <input 
                      type="number" 
                      value={project[field] || 0} 
                      onChange={e => handleUpdateField(field, Number(e.target.value))}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Links Tab */}
        {activeTab === 'links' && (
          <div className="bg-white border border-gray-200 rounded-[14px] p-6">
            <div className="grid gap-5">
              {[
                { field: "github_url", label: "GitHub Repository" },
                { field: "preview_url", label: "Vercel Preview URL" },
                { field: "live_url", label: "Live Website URL" },
              ].map(({ field, label }) => (
                <div key={field} className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-gray-700">{label}</label>
                  <div className="flex gap-2">
                    <input 
                      type="url" 
                      value={project[field] || ''} 
                      onChange={e => handleUpdateField(field, e.target.value)}
                      placeholder="https://"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                    />
                    {project[field] && (
                      <a 
                        href={project[field]} 
                        target="_blank" 
                        rel="noreferrer"
                        className="shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 rounded-lg px-4 py-2 text-sm font-semibold flex items-center transition-colors"
                      >
                        Open ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-100 pt-5 mt-6">
              <h4 className="text-sm font-bold text-gray-900 mb-4">Domain Renewal Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-gray-700">Domain Name</label>
                  <input 
                    type="text" 
                    value={project.domain_name || ''} 
                    onChange={e => handleUpdateField('domain_name', e.target.value)}
                    placeholder="example.com"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-gray-700">Renewal Date</label>
                  <input 
                    type="date" 
                    value={project.renewal_date || ''} 
                    onChange={e => handleUpdateField('renewal_date', e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                  />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[13px] font-semibold text-gray-700">Client Email (For Reminders)</label>
                  <input 
                    type="email" 
                    value={project.client_email || ''} 
                    onChange={e => handleUpdateField('client_email', e.target.value)}
                    placeholder="client@example.com"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Updates Tab */}
        {activeTab === 'updates' && (
          <div className="bg-white border border-gray-200 rounded-[14px] p-6">
            {initialUpdates.length === 0 ? (
              <p className="text-gray-500 text-[13px] text-center py-6">No employee updates yet.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {initialUpdates.map(u => (
                  <div key={u.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-sm text-gray-900">{u.employee_name || 'Anonymous'}</span>
                      <span className="text-xs text-gray-400">{new Date(u.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{u.note}</p>
                    {u.screenshot_url && (
                      <a href={u.screenshot_url} target="_blank" rel="noreferrer" className="inline-block mt-3 text-xs font-semibold text-primary hover:underline">
                        View Screenshot ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
