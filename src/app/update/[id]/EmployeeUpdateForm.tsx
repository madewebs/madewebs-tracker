'use client';

import { useActionState } from 'react';
import { submitEmployeeUpdate } from './actions';
import { Send, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const CATEGORY_ORDER = ["Requirements", "Development", "Deployment", "Testing"];

export function EmployeeUpdateForm({ project, groupedChecklists }: { project: any, groupedChecklists: Record<string, any[]> }) {
  const submitWithId = submitEmployeeUpdate.bind(null, project.id);
  const [state, formAction, isPending] = useActionState(submitWithId, null);

  if (state?.success) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Update Submitted!</h2>
        <p className="text-sm text-gray-500">Thank you for updating the project progress. The dashboard has been synced.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden">
      <form action={formAction} className="p-6 md:p-8">
        
        <div className="mb-6 flex flex-col gap-2">
          <Label htmlFor="employee_name">Your Name</Label>
          <Input 
            type="text" 
            id="employee_name"
            name="employee_name" 
            defaultValue={project.assigned_to || ''}
            required 
            placeholder="John Doe"
          />
        </div>

        <div className="mb-8">
          <h3 className="text-[15px] font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Pending Tasks</h3>
          <div className="grid gap-5">
            {CATEGORY_ORDER.map(category => {
              const tasks = groupedChecklists[category];
              if (!tasks) return null;
              
              const pendingTasks = tasks.filter(t => !t.completed);
              if (pendingTasks.length === 0) return null;

              return (
                <div key={category}>
                  <div className="text-[13px] font-bold text-gray-500 uppercase tracking-wide mb-2.5">{category}</div>
                  <div className="grid gap-2.5 pl-1">
                    {pendingTasks.map(task => (
                      <label key={task.id} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          name={`task_completed_${task.id}`}
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary" 
                        />
                        <span className="text-[14px] text-gray-800 group-hover:text-primary transition-colors">
                          {task.task_name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-[15px] font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Project Links (Optional)</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="github_url">GitHub Repository</Label>
              <Input type="url" id="github_url" name="github_url" defaultValue={project.github_url || ''} placeholder="https://github.com/..." />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="preview_url">Vercel / Test Link</Label>
              <Input type="url" id="preview_url" name="preview_url" defaultValue={project.preview_url || ''} placeholder="https://..." />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="live_url">Live Domain</Label>
              <Input type="url" id="live_url" name="live_url" defaultValue={project.live_url || ''} placeholder="https://..." />
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-2">
          <Label htmlFor="note">Progress Note <span className="text-red-500">*</span></Label>
          <Textarea 
            id="note"
            name="note" 
            required 
            rows={4}
            placeholder="What did you work on today? Any blockers?"
          />
        </div>

        <div className="mb-6 flex flex-col gap-2">
          <Label htmlFor="screenshot_url" className="flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-gray-400" /> Screenshot URL (Optional)
          </Label>
          <Input 
            type="url" 
            id="screenshot_url"
            name="screenshot_url" 
            placeholder="https://..."
          />
          <p className="text-xs text-gray-400 mt-1">Upload an image to a hosting service and paste the link here.</p>
        </div>

        {state?.error && (
          <div className="mb-6 text-red-600 bg-red-50 p-3 rounded-lg text-sm border border-red-200">
            {state.error}
          </div>
        )}

        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full font-semibold flex items-center gap-2"
          size="lg"
        >
          {isPending ? 'Submitting...' : <><Send className="w-4 h-4" /> Submit Update</>}
        </Button>

      </form>
    </div>
  );
}
