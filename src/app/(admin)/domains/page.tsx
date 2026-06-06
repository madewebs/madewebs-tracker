import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Globe, RefreshCw } from 'lucide-react';

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
    <div className="max-w-[1000px]">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 m-0">Domains</h1>
        <p className="text-sm text-gray-500 mt-1">Track upcoming domain renewals across all projects.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-[14px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold text-[13px] uppercase tracking-wide">
              <tr>
                <th className="px-6 py-4">Domain Name</th>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Client Email</th>
                <th className="px-6 py-4">Renewal Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {domains.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No domains found. Make sure to add domain names to your projects.
                  </td>
                </tr>
              ) : (
                domains.map(d => {
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
                    <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <a href={`https://${d.domain_name}`} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                          {d.domain_name}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/projects/${d.id}`} className="text-gray-600 hover:text-primary transition-colors">
                          {d.company_name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {d.client_email || <span className="text-gray-300 italic">None</span>}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        {d.renewal_date ? new Date(d.renewal_date).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColor}`}>
                          {statusText}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
