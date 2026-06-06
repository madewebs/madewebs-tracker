import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export async function GET(request: Request) {
  try {
    // Validate cron request (optional, usually protected by a secret header in Vercel)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { data: projects, error } = await supabase
      .from('projects')
      .select('id, company_name, domain_name, renewal_date, client_email')
      .not('domain_name', 'is', null)
      .not('renewal_date', 'is', null);

    if (error) throw error;

    const sentEmails = [];

    for (const project of projects || []) {
      if (!project.renewal_date || !project.domain_name) continue;

      const daysLeft = daysUntil(project.renewal_date);

      // Check if it's one of the target reminder days: 30, 7, 5, 1
      if ([30, 7, 5, 1].includes(daysLeft)) {
        
        // Prepare recipients
        const to = ['madeworkspot@gmail.com'];
        if (project.client_email) {
          to.push(project.client_email);
        }

        // Send Email via Resend
        await resend.emails.send({
          from: 'MadeWebs <noreply@madewebs.com>',
          to,
          subject: 'Domain Renewal Reminder',
          text: `Hello,\n\nThis is a reminder that your domain is scheduled for renewal soon.\n\nDomain: ${project.domain_name}\nRenewal Date: ${new Date(project.renewal_date).toLocaleDateString()}\n\nPlease renew the domain before expiry to avoid service interruptions.\n\nThank you,\nMadeWebs`,
        });

        // Also send Internal Alert to madeworkspot@gmail.com
        await resend.emails.send({
          from: 'MadeWebs <noreply@madewebs.com>',
          to: 'madeworkspot@gmail.com',
          subject: 'Domain Renewal Alert',
          text: `Client: ${project.company_name}\nDomain: ${project.domain_name}\nRenewal Date: ${new Date(project.renewal_date).toLocaleDateString()}\n\nReminder sent successfully.`,
        });

        sentEmails.push({ domain: project.domain_name, days: daysLeft });
      }
    }

    return NextResponse.json({ success: true, sentEmails });

  } catch (err: any) {
    console.error('Cron Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
