import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Initialize a supabase client with the Service Role key to bypass RLS
// because webhooks are unauthenticated requests from Paystack.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const secret = process.env.PAYSTACK_SECRET_KEY || 'sk_test_placeholder';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    // Verify Signature
    const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
    if (hash !== signature) {
      console.error('Paystack Webhook: Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    // Handle Charge Success Event
    if (event.event === 'charge.success') {
      const { reference, amount } = event.data;
      
      // Find the order by reference
      const { data: order, error: findError } = await supabase
        .from('orders')
        .select('id, status, discount_code')
        .eq('payment_reference', reference)
        .single();

      if (findError || !order) {
        console.error(`Paystack Webhook: Order not found for reference ${reference}`);
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // If it's already paid/processing, just return success
      if (order.status !== 'pending') {
        return NextResponse.json({ success: true, message: 'Already processed' });
      }

      // Update Order Status to 'paid' (or 'processing')
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'paid', updated_at: new Date().toISOString() })
        .eq('id', order.id);

      if (updateError) {
        console.error('Paystack Webhook: Failed to update order status', updateError);
        return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
      }

      // Increment discount used count if a code was used
      if (order.discount_code) {
        const { data: dData } = await supabase
          .from('discount_codes')
          .select('used_count')
          .eq('code', order.discount_code)
          .single();

        if (dData) {
          await supabase
            .from('discount_codes')
            .update({ used_count: dData.used_count + 1 })
            .eq('code', order.discount_code);
        }
      }

      console.log(`Paystack Webhook: Successfully processed order ${order.id}`);
      return NextResponse.json({ success: true });
    }

    // Acknowledge other events
    return NextResponse.json({ success: true, message: 'Event ignored' });

  } catch (error: any) {
    console.error('Paystack Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
