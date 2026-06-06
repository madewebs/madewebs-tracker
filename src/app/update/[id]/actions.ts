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
  // Form data will contain keys like 'task_completed_<task_id>' = 'on'
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
    // Supabase upsert requires the full primary key, assuming 'id' is enough for update
    for (const update of taskUpdates) {
      await supabase
        .from('project_checklists')
        .update({ completed: true, completed_at: update.completed_at })
        .eq('id', update.id);
    }
  }

  revalidatePath(`/update/${projectId}`);
  revalidatePath(`/projects/${projectId}`);
  
  return { success: true };
}
