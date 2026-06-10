import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { EmployeeUpdateForm } from './EmployeeUpdateForm';
import { ArrowUpRight } from 'lucide-react';

export default async function EmployeeUpdatePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const [
    { data: project },
    { data: checklists }
  ] = await Promise.all([
    supabase.from('projects').select('id, company_name, plan, status, assigned_to, github_url, preview_url, live_url').eq('id', id).single(),
    supabase.from('project_checklists').select('*').eq('project_id', id).order('id')
  ]);

  if (!project) {
    return notFound();
  }

  // Group checklists
  const groupedChecklists: Record<string, any[]> = {};
  checklists?.forEach(c => {
    if (!groupedChecklists[c.category]) groupedChecklists[c.category] = [];
    groupedChecklists[c.category].push(c);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] to-[#e6f5fb] py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-[600px]">
        
        <div className="text-center mb-8">
          <div className="w-[60px] h-[60px] bg-primary rounded-[16px] flex items-center justify-center mx-auto mb-4 shadow-[0_8px_24px_rgba(7,143,205,0.35)]">
            <ArrowUpRight className="text-white w-8 h-8 stroke-[2.5]" />
          </div>
          <h1 className="text-xl font-extrabold text-gray-900 m-0">Project Update Portal</h1>
          <p className="text-sm text-gray-500 mt-1">Submit your progress for <strong>{project.company_name}</strong></p>
        </div>

        <EmployeeUpdateForm 
          project={project} 
          groupedChecklists={groupedChecklists} 
        />
        
      </div>
    </div>
  );
}
