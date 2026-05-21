import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// One-time bootstrap endpoint to promote a user to superadmin
// Protected by a secret token
export async function POST(request: Request) {
  const { email, token } = await request.json();

  // Simple hardcoded secret to prevent unauthorized access
  if (token !== process.env.ADMIN_BOOTSTRAP_SECRET && token !== 'ZEURIA_BOOTSTRAP_2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();

  // Find user by email
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== email) {
    return NextResponse.json({ error: 'User not found or not authenticated as this email' }, { status: 404 });
  }

  // Promote to superadmin
  const { error } = await supabase
    .from('profiles')
    .update({ role: 'superadmin' })
    .eq('id', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, message: `${email} is now a superadmin` });
}
