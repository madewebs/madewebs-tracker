'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function submitEmployeeUpdate(projectId: string, prevState: any, formData: FormData) {
  const employee_name = formData.get('employee_name');
  const note = formData.get('note');
  const screenshot_url = formData.get('screenshot_url');

  if (!note) {
    return { error: "A progress note is required." };
  }

  const { error } = await supabase
    .from('employee_updates')
    .insert([{
      project_id: projectId,
      employee_name,
      note,
      screenshot_url: screenshot_url || null
    }]);

  if (error) {
    console.error("Error submitting update:", error);
    return { error: "Failed to submit update. Please try again." };
  }

  // Handle checklist updates
  const taskUpdates = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('task_completed_') && value === 'on') {
      const taskId = key.replace('task_completed_', '');
      taskUpdates.push({
        id: taskId,
        completed: true,
        completed_at: new Date().toISOString()
      });
    }
  }

  if (taskUpdates.length > 0) {
    for (const update of taskUpdates) {
      await supabase
        .from('project_checklists')
        .update({ completed: true, completed_at: update.completed_at })
        .eq('id', update.id);
    }
  }

  // Fetch updated checklists to calculate auto-status
  const { data: allChecklists } = await supabase.from('project_checklists').select('*').eq('project_id', projectId);
  const { data: proj } = await supabase.from('projects').select('status').eq('id', projectId).single();
  
  let newStatus = proj?.status;
  if (allChecklists && proj) {
    const getGroup = (cat: string) => allChecklists.filter(c => c.category === cat);
    const isDone = (tasks: any[]) => tasks.length > 0 && tasks.every(t => t.completed);
    
    const req = getGroup('Requirements');
    const dev = getGroup('Development');
    const test = getGroup('Testing');
    const dep = getGroup('Deployment');

    if (!isDone(req)) newStatus = 'Requirements';
    else if (!isDone(dev)) newStatus = 'Development';
    else if (!isDone(dep)) newStatus = 'Deployment';
    else if (!isDone(test)) {
      const testCompletedCount = test.filter(t => t.completed).length;
      newStatus = testCompletedCount === 0 ? 'Review' : 'Testing';
    } else newStatus = 'Completed';
  }

  // Update URLs and potentially status
  const updates: any = {};
  
  const github_url = formData.get('github_url');
  const preview_url = formData.get('preview_url');
  const live_url = formData.get('live_url');
  
  if (github_url !== null) updates.github_url = github_url;
  if (preview_url !== null) updates.preview_url = preview_url;
  if (live_url !== null) updates.live_url = live_url;
  if (newStatus && newStatus !== proj?.status) updates.status = newStatus;

  if (Object.keys(updates).length > 0) {
    await supabase.from('projects').update(updates).eq('id', projectId);
  }

  revalidatePath(`/update/${projectId}`);
  revalidatePath(`/projects/${projectId}`);
  
  return { success: true };
}
