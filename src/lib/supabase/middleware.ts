import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Always call getUser() to refresh the session cookie
  const { data: { user } } = await supabase.auth.getUser();

  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/account?redirect=/admin', request.url));
    }

    // Read role from the profiles table safely
    // Use service-level check — the user is authenticated at this point
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || !['admin', 'superadmin'].includes(profile.role)) {
        return NextResponse.redirect(new URL('/?error=unauthorized', request.url));
      }
    } catch {
      // If profile check fails, deny access
      return NextResponse.redirect(new URL('/account?error=session', request.url));
    }
  }

  // Protect /account/dashboard — must be logged in
  if (request.nextUrl.pathname.startsWith('/account/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/account', request.url));
    }
  }

  return supabaseResponse;
}
