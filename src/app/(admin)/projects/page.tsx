import { supabase } from '@/lib/supabase';
import { ProjectList } from '@/components/ProjectList';

export default async function ProjectsPage() {
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: checklists, error: checklistsError } = await supabase
    .from('project_checklists')
    .select('*');

  if (projectsError) {
    console.error("Error fetching projects:", projectsError);
  }

  return <ProjectList projects={projects || []} checklists={checklists || []} />;
}
