import { supabase } from '@/lib/supabase';
import { ProjectDetailView } from '@/components/ProjectDetailView';
import { notFound } from 'next/navigation';

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const [
    { data: project },
    { data: checklists },
    { data: updates }
  ] = await Promise.all([
    supabase.from('projects').select('*').eq('id', id).single(),
    supabase.from('project_checklists').select('*').eq('project_id', id).order('id'),
    supabase.from('employee_updates').select('*').eq('project_id', id).order('created_at', { ascending: false })
  ]);

  if (!project) {
    return notFound();
  }

  return (
    <ProjectDetailView 
      initialProject={project} 
      initialChecklists={checklists || []} 
      initialUpdates={updates || []} 
    />
  );
}
