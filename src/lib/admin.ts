import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/** Returns the authenticated admin user or redirects. Use in server components / route handlers. */
export async function requireAdmin() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect('/account?redirect=/admin');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, first_name')
    .eq('id', user.id)
    .single();

  if (!profile || !['admin', 'superadmin'].includes(profile.role)) {
    redirect('/?error=unauthorized');
  }

  return { user, profile, supabase };
}

/** Write an audit log entry. Call from server actions / API routes. */
export async function writeAuditLog({
  supabase,
  adminId,
  adminEmail,
  action,
  resource,
  resourceId,
  description,
  beforeData,
  afterData,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any;
  adminId: string;
  adminEmail?: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'EXPORT' | 'LOGIN' | 'BULK_UPDATE' | 'BULK_DELETE';
  resource: string;
  resourceId?: string;
  description: string;
  beforeData?: Record<string, unknown>;
  afterData?: Record<string, unknown>;
}) {
  try {
    await supabase.from('admin_audit_logs').insert({
      admin_id: adminId,
      admin_email: adminEmail,
      action,
      resource,
      resource_id: resourceId,
      description,
      before_data: beforeData ?? null,
      after_data: afterData ?? null,
    });
  } catch {
    // Non-fatal — never let audit log failure break the main action
    console.warn('[audit] Failed to write audit log:', description);
  }
}
