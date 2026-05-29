import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
    try {
        const { email, source } = await req.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
        }

        const { error } = await supabase
            .from('newsletter_subscribers')
            .upsert({ email: email.toLowerCase().trim(), source: source || 'footer' }, { onConflict: 'email' });

        if (error) {
            // Duplicate email is fine
            if (error.code === '23505') {
                return NextResponse.json({ success: true, message: 'Already subscribed.' });
            }
            throw error;
        }

        return NextResponse.json({ success: true, message: 'Subscribed successfully!' });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Something went wrong.' }, { status: 500 });
    }
}
