'use server';

import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';

const CHECKLIST_TEMPLATE = {
  Requirements: ["Logo Received", "Content Received", "Images Received", "Business Information Received"],
  Development: ["Homepage Complete", "Internal Pages Complete", "Responsive Design Complete", "Forms Working", "SEO Setup Complete"],
  Testing: ["Mobile Tested", "Desktop Tested", "Form Tested", "Speed Checked"],
  Deployment: ["Domain Purchased", "DNS Configured", "SSL Active", "Analytics Setup", "Website Live"]
};

export async function createProject(prevState: any, formData: FormData) {
  const projectData = {
    company_name: formData.get('company_name'),
    contact_person: formData.get('contact_person'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    website: formData.get('website'),
    plan: formData.get('plan'),
    assigned_to: formData.get('assigned_to'),
    deadline: formData.get('deadline') || null,
    project_value: Number(formData.get('project_value')) || 0,
    advance_received: Number(formData.get('advance_received')) || 0,
    github_url: formData.get('github_url'),
    preview_url: formData.get('preview_url'),
    live_url: formData.get('live_url'),
    status: 'Requirements',
  };

  // Insert Project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert([projectData])
    .select()
    .single();

  if (projectError || !project) {
    console.error("Error creating project:", projectError);
    return { error: projectError?.message || "Failed to create project" };
  }

  // Generate Checklists for the project
  const checklistInserts = [];
  for (const [category, tasks] of Object.entries(CHECKLIST_TEMPLATE)) {
    for (const task of tasks) {
      checklistInserts.push({
        project_id: project.id,
        category,
        task_name: task,
        completed: false
      });
    }
  }

  const { error: checklistError } = await supabase
    .from('project_checklists')
    .insert(checklistInserts);

  if (checklistError) {
    console.error("Error generating checklists:", checklistError);
    // Even if checklists fail, the project was created. We can still redirect, but ideally handle it.
  }

  redirect('/projects');
}
