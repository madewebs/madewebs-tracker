import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Globe, Building2, Mail, Calendar, ExternalLink } from 'lucide-react';

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default async function DomainsPage() {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, company_name, domain_name, renewal_date, client_email')
    .not('domain_name', 'is', null)
    .not('domain_name', 'eq', '')
    .order('renewal_date', { ascending: true });

  if (error) {
    console.error("Error fetching domains:", error);
  }

  const domains = projects || [];

  return (
    <div className="max-w-[1200px] w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 m-0">Domains</h1>
        <p className="text-sm text-gray-500 mt-1">Track upcoming domain renewals across all projects.</p>
      </div>

      {domains.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-[14px] p-8 text-center text-gray-400 shadow-sm">
          No domains found. Make sure to add domain names to your projects.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {domains.map(d => {
            const days = d.renewal_date ? daysUntil(d.renewal_date) : null;
            let statusColor = "bg-gray-100 text-gray-600 border-gray-200";
            let statusText = "Unknown";
            
            if (days !== null) {
              if (days < 0) {
                statusColor = "bg-red-100 text-red-700 border-red-200";
                statusText = `Expired ${Math.abs(days)}d ago`;
              } else if (days <= 30) {
                statusColor = "bg-orange-100 text-orange-700 border-orange-200";
                statusText = `Renews in ${days}d`;
              } else {
                statusColor = "bg-green-100 text-green-700 border-green-200";
                statusText = `Active (${days}d left)`;
              }
            }

            return (
              <div key={d.id} className="bg-white border border-gray-200 rounded-[14px] p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
                
                {/* Left Section: Domain Icon & Name */}
                <div className="flex items-center gap-4 md:w-1/4 shrink-0 overflow-hidden">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 w-full">
                    <h3 className="font-semibold text-gray-900 text-base whitespace-nowrap overflow-x-auto" title={d.domain_name}>
                      {d.domain_name}
                    </h3>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-wide font-bold border ${statusColor}`}>
                        {statusText}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Middle Section: Project, Email, Renewal details */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 text-sm text-gray-600 min-w-0 w-full bg-gray-50/50 md:bg-transparent p-3 sm:p-0 rounded-lg">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                    <Link href={`/projects/${d.id}`} className="hover:text-blue-600 transition-colors font-semibold text-gray-800 truncate" title={d.company_name}>
                      {d.company_name}
                    </Link>
                  </div>
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="truncate" title={d.client_email || 'No email'}>
                      {d.client_email || <span className="text-gray-400 italic">No email</span>}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> 
                      {d.renewal_date ? new Date(d.renewal_date).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' }) : 'No renewal date'}
                    </div>
                  </div>
                </div>

                {/* Right Section: External Link */}
                <div className="flex md:shrink-0 justify-end mt-1 md:mt-0">
                  <a href={`https://${d.domain_name}`} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-blue-700 transition-colors bg-white hover:bg-blue-50 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold border border-gray-200 hover:border-blue-200 shadow-sm w-full md:w-auto justify-center">
                    Visit Site <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
