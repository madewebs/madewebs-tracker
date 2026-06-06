import { supabase } from '@/lib/supabase';
import { DashboardCharts } from '@/components/DashboardCharts';
import { Folder, CheckCircle, CreditCard, TrendingDown, TrendingUp, Clock, Eye, RefreshCw, AlertTriangle, Globe } from 'lucide-react';
import Link from 'next/link';

function fmtCurrency(v: number) {
  return "₹" + Number(v || 0).toLocaleString("en-IN");
}

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function StatCard({ label, value, icon: Icon, color, sub }: any) {
  return (
    <div className="bg-white border border-gray-200 rounded-[14px] p-4 flex flex-col gap-1.5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">{label}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15`, color }}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {sub && <div className="text-xs text-gray-400">{sub}</div>}
    </div>
  );
}

export default async function DashboardPage() {
  const { data: projects, error } = await supabase.from('projects').select('*');
  
  const activeProjects = projects?.filter(p => p.status !== 'Completed') || [];
  const completedProjects = projects?.filter(p => p.status === 'Completed') || [];
  
  let revenue = 0, expenses = 0, profit = 0, pending = 0;
  
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyDataMap: Record<string, { month: string, revenue: number, profit: number }> = {};
  
  // Initialize last 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const m = monthNames[d.getMonth()];
    monthlyDataMap[m] = { month: m, revenue: 0, profit: 0 };
  }

  projects?.forEach(p => {
    const pExpenses = (p.salary_expense || 0) + (p.domain_cost || 0) + (p.hosting_cost || 0) + (p.other_expenses || 0);
    const pReceived = (p.advance_received || 0) + (p.final_payment_received || 0);
    const pPending = (p.project_value || 0) - pReceived;
    const pProfit = (p.project_value || 0) - pExpenses;
    
    revenue += pReceived;
    expenses += pExpenses;
    profit += pProfit;
    pending += pPending;

    if (p.created_at) {
      const date = new Date(p.created_at);
      const m = monthNames[date.getMonth()];
      if (monthlyDataMap[m]) {
        monthlyDataMap[m].revenue += pReceived;
        monthlyDataMap[m].profit += pProfit;
      }
    }
  });

  const monthlyData = Object.values(monthlyDataMap);

  const pendingReview = activeProjects.filter(p => p.status === 'Review');
  const domainRenewals = activeProjects.filter(p => p.renewal_date && daysUntil(p.renewal_date) <= 30 && daysUntil(p.renewal_date) > 0);
  
  const upcomingDeadlines = activeProjects
    .filter(p => p.deadline)
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);

  const inactiveProjects = activeProjects.filter(p => {
    const days = Math.floor((new Date().getTime() - new Date(p.updated_at).getTime()) / (1000 * 60 * 60 * 24));
    return days >= 7;
  });

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold text-gray-900 m-0">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back — here's what's happening today.</p>
      </div>

      {/* Alerts */}
      {(inactiveProjects.length > 0 || domainRenewals.length > 0) && (
        <div className="flex flex-wrap gap-2.5 mb-5">
          {inactiveProjects.map(p => (
            <div key={p.id} className="bg-orange-50 border border-orange-200 rounded-lg px-3.5 py-2 text-[13px] text-orange-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> <strong>{p.company_name}</strong> — inactive for 7+ days
            </div>
          ))}
          {domainRenewals.map(p => (
            <div key={p.id} className="bg-blue-50 border border-blue-200 rounded-lg px-3.5 py-2 text-[13px] text-blue-700 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> <strong>{p.domain_name}</strong> renews in {daysUntil(p.renewal_date)} day{daysUntil(p.renewal_date) !== 1 ? 's' : ''}
            </div>
          ))}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4 mb-7">
        <StatCard label="Active Projects" value={activeProjects.length} icon={Folder} color="#078FCD" />
        <StatCard label="Completed" value={completedProjects.length} icon={CheckCircle} color="#22c55e" />
        <StatCard label="Revenue" value={fmtCurrency(revenue)} icon={CreditCard} color="#8b5cf6" />
        <StatCard label="Expenses" value={fmtCurrency(expenses)} icon={TrendingDown} color="#ef4444" />
        <StatCard label="Profit" value={fmtCurrency(profit)} icon={TrendingUp} color="#22c55e" />
        <StatCard label="Pending Payment" value={fmtCurrency(pending)} icon={Clock} color="#f59e0b" />
        <StatCard label="Pending Review" value={pendingReview.length} icon={Eye} color="#ec4899" />
        <StatCard label="Domain Renewals" value={domainRenewals.length} icon={RefreshCw} color="#06b6d4" sub="within 30 days" />
      </div>

      <DashboardCharts data={monthlyData} />

      {/* Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        
        {/* Upcoming Deadlines */}
        <div className="bg-white border border-gray-200 rounded-[14px] p-5">
          <h3 className="text-[15px] font-bold text-gray-900 m-0 mb-3.5 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" /> Upcoming Deadlines
          </h3>
          {upcomingDeadlines.length === 0 ? <p className="text-gray-400 text-[13px]">No upcoming deadlines.</p> :
            <div className="flex flex-col">
              {upcomingDeadlines.map(p => {
                const d = daysUntil(p.deadline);
                return (
                  <Link href={`/projects/${p.id}`} key={p.id} className="flex justify-between items-center py-2.5 border-b border-gray-100 hover:bg-gray-50 -mx-2 px-2 rounded-md transition-colors">
                    <div>
                      <div className="text-[13px] font-semibold text-gray-900">{p.company_name}</div>
                      <div className="text-xs text-gray-400">{new Date(p.deadline).toLocaleDateString()}</div>
                    </div>
                    <span className={`text-xs font-semibold ${d <= 3 ? 'text-red-500' : d <= 7 ? 'text-orange-500' : 'text-green-500'}`}>
                      {d <= 0 ? "Overdue" : `${d}d`}
                    </span>
                  </Link>
                );
              })}
            </div>
          }
        </div>

        {/* Pending Payments */}
        <div className="bg-white border border-gray-200 rounded-[14px] p-5">
          <h3 className="text-[15px] font-bold text-gray-900 m-0 mb-3.5 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-gray-400" /> Pending Payments
          </h3>
          {(() => {
            const pendingList = projects?.filter(p => (p.project_value || 0) - ((p.advance_received || 0) + (p.final_payment_received || 0)) > 0) || [];
            if (pendingList.length === 0) return <p className="text-gray-400 text-[13px]">No pending payments.</p>;
            return (
              <div className="flex flex-col">
                {pendingList.map(p => {
                  const pPending = (p.project_value || 0) - ((p.advance_received || 0) + (p.final_payment_received || 0));
                  return (
                    <div key={p.id} className="flex justify-between items-center py-2.5 border-b border-gray-100">
                      <div>
                        <div className="text-[13px] font-semibold text-gray-900">{p.company_name}</div>
                        <div className="text-xs text-gray-400">Value: {fmtCurrency(p.project_value)}</div>
                      </div>
                      <span className="text-[13px] font-bold text-orange-500">{fmtCurrency(pPending)}</span>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>

        {/* Review Projects */}
        <div className="bg-white border border-gray-200 rounded-[14px] p-5">
          <h3 className="text-[15px] font-bold text-gray-900 m-0 mb-3.5 flex items-center gap-2">
            <Eye className="w-4 h-4 text-gray-400" /> Waiting Review
          </h3>
          {pendingReview.length === 0 ? <p className="text-gray-400 text-[13px]">No projects awaiting review.</p> :
            <div className="flex flex-col">
              {pendingReview.map(p => (
                <Link href={`/projects/${p.id}`} key={p.id} className="flex justify-between items-center py-2.5 border-b border-gray-100 hover:bg-gray-50 -mx-2 px-2 rounded-md transition-colors">
                  <div>
                    <div className="text-[13px] font-semibold text-gray-900">{p.company_name}</div>
                    <div className="text-xs text-gray-400">{p.assigned_to}</div>
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-600 border border-pink-200">
                    Review
                  </span>
                </Link>
              ))}
            </div>
          }
        </div>

        {/* Domain Renewals */}
        <div className="bg-white border border-gray-200 rounded-[14px] p-5">
          <h3 className="text-[15px] font-bold text-gray-900 m-0 mb-3.5 flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-400" /> Domain Renewals
          </h3>
          {domainRenewals.length === 0 ? <p className="text-gray-400 text-[13px]">No upcoming renewals.</p> :
            <div className="flex flex-col">
              {domainRenewals.map(p => {
                const d = daysUntil(p.renewal_date);
                return (
                  <div key={p.id} className="flex justify-between items-center py-2.5 border-b border-gray-100">
                    <div>
                      <div className="text-[13px] font-semibold text-gray-900">{p.domain_name}</div>
                      <div className="text-xs text-gray-400">{p.company_name} · {new Date(p.renewal_date).toLocaleDateString()}</div>
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${d <= 7 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>
                      {d}d
                    </span>
                  </div>
                );
              })}
            </div>
          }
        </div>

      </div>
    </div>
  );
}
