import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customer, shipping, discountCode, notes } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }
    if (!customer?.email || !customer?.firstName) {
      return NextResponse.json({ error: 'Invalid customer details' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Fetch real prices from database
    const itemIds = items.map((i: any) => i.id);
    const { data: dbProducts, error: prodError } = await supabase
      .from('products')
      .select('id, name, price')
      .in('id', itemIds);

    if (prodError || !dbProducts) {
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    // 2. Calculate true subtotal
    let subtotal = 0;
    const validatedItems = items.map((cartItem: any) => {
      const dbProd = dbProducts.find((p: any) => p.id === cartItem.id);
      if (!dbProd) throw new Error(`Product not found: ${cartItem.id}`);
      
      const realPrice = dbProd.price;
      subtotal += realPrice * cartItem.qty;
      
      return {
        id: dbProd.id,
        name: dbProd.name,
        qty: cartItem.qty,
        price: `₦${realPrice.toLocaleString()}`,
        image: cartItem.image,
        storage: cartItem.storage
      };
    });

    // 3. Validate and apply discount
    let discountAmt = 0;
    let appliedDiscountCode = null;

    if (discountCode) {
      const { data: dData } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('code', discountCode.trim().toUpperCase())
        .eq('is_active', true)
        .single();

      if (dData) {
        if (dData.expires_at && new Date(dData.expires_at) < new Date()) {
          return NextResponse.json({ error: 'Discount code expired' }, { status: 400 });
        }
        if (dData.max_uses && dData.used_count >= dData.max_uses) {
          return NextResponse.json({ error: 'Discount code max uses reached' }, { status: 400 });
        }
        if (dData.minimum_order && subtotal < dData.minimum_order) {
          return NextResponse.json({ error: `Minimum order of ₦${dData.minimum_order.toLocaleString()} required` }, { status: 400 });
        }
        
        discountAmt = dData.type === 'percentage' 
          ? Math.floor(subtotal * dData.value / 100) 
          : dData.value;
        appliedDiscountCode = dData.code;
      } else {
        return NextResponse.json({ error: 'Invalid discount code' }, { status: 400 });
      }
    }

    // 4. Calculate shipping & total
    const shippingFee = subtotal >= 500000 ? 0 : 5000;
    const total = subtotal + shippingFee - discountAmt;

    // 5. Create Order
    const { data: { user } } = await supabase.auth.getUser();
    const orderNumber = `ZR-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(Math.random() * 99999).toString().padStart(5, '0')}`;
    const paymentReference = `ZR-PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const { data: order, error: orderError } = await supabase.from('orders').insert({
      order_number: orderNumber,
      user_id: user?.id || null,
      customer_email: customer.email,
      customer_phone: customer.phone,
      customer_name: `${customer.firstName} ${customer.lastName}`.trim(),
      shipping_address: shipping,
      items: validatedItems,
      subtotal,
      shipping_fee: shippingFee,
      discount: discountAmt,
      total,
      discount_code: appliedDiscountCode,
      status: 'pending',
      payment_reference: paymentReference,
      payment_channel: 'Paystack',
      notes: notes || null,
    }).select().single();

    if (orderError || !order) {
      console.error('Order Creation Error:', orderError);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      orderNumber: order.order_number,
      total,
      reference: paymentReference
    });

  } catch (error: any) {
    console.error('Checkout API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
