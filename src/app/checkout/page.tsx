"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { Shield, Truck, Lock, CheckCircle, Loader, Tag, X } from 'lucide-react';
import { trackCheckoutStart, trackPurchase } from '@/lib/analytics';

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: Record<string, unknown>) => { openIframe: () => void };
    };
  }
}

const NIGERIAN_STATES = ['Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT - Abuja'];

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<'info' | 'payment'>('info');
  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountData, setDiscountData] = useState<{ value: number; type: string } | null>(null);
  const [discountError, setDiscountError] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', street: '', city: '', state: 'Lagos', notes: '' });

  const subtotal = items.reduce((s, i) => s + parseInt(i.price.replace(/[₦,]/g, '')) * i.qty, 0);
  const shipping = subtotal >= 500000 ? 0 : 5000;
  const discountAmt = discountData ? (discountData.type === 'percentage' ? Math.floor(subtotal * discountData.value / 100) : discountData.value) : 0;
  const total = subtotal + shipping - discountAmt;

  useEffect(() => {
    if (items.length > 0) trackCheckoutStart(total, items.length);
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyDiscount = async () => {
    if (!discountCode.trim()) return;
    setDiscountError('');
    const supabase = createClient();
    const { data } = await supabase.from('discount_codes').select('*').eq('code', discountCode.trim().toUpperCase()).eq('is_active', true).single();
    if (!data) { setDiscountError('Invalid or expired discount code.'); return; }
    if (data.minimum_order && subtotal < data.minimum_order) { setDiscountError(`Minimum order of ₦${data.minimum_order.toLocaleString()} required.`); return; }
    if (data.max_uses && data.used_count >= data.max_uses) { setDiscountError('This code has reached its maximum uses.'); return; }
    if (data.expires_at && new Date(data.expires_at) < new Date()) { setDiscountError('This discount code has expired.'); return; }
    setDiscountData({ value: data.value, type: data.type });
  };

  const handlePaystack = async () => {
    if (!window.PaystackPop) { alert('Payment system loading. Please try again.'); return; }

    setLoading(true);

    try {
      // 1. Create order securely on the server
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customer: { firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone },
          shipping: { street: form.street, city: form.city, state: form.state },
          discountCode: discountData ? discountCode : '',
          notes: form.notes
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to initialize checkout');
      }

      // 2. Open Paystack iframe with server-generated reference and total
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_KEY || 'pk_test_placeholder',
        email: form.email,
        amount: data.total * 100,
        currency: 'NGN',
        ref: data.reference,
        metadata: { customer_name: `${form.firstName} ${form.lastName}`, phone: form.phone, custom_fields: [] },
        callback: (response: { reference: string; status: string }) => {
          if (response.status === 'success') {
            trackPurchase(data.orderId, data.total);
            clear();
            router.push(`/order-success?ref=${data.orderNumber}`);
          }
        },
        onClose: () => {
          setLoading(false);
          // Optional: handle payment cancellation
        },
      });
      handler.openIframe();
    } catch (err: any) {
      alert(err.message);
      setLoading(false);
    }
  };

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  if (items.length === 0) return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '120px 24px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px' }}>Your bag is empty.</h1>
      <p style={{ color: '#666', marginBottom: '32px' }}>Looks like you haven&apos;t added anything yet.</p>
      <Link href="/shop" style={{ background: '#fff', color: '#000', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: 700 }}>Continue Shopping</Link>
    </div>
  );

  const inp = { width: '100%', background: '#0d0d0d', border: '1px solid #1d1d1d', color: '#fff', padding: '13px', borderRadius: '10px', outline: 'none', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' as const, transition: 'border-color 0.2s' };

  return (
    <div style={{ maxWidth: 'var(--max-w, 1380px)', margin: '0 auto', padding: 'clamp(40px, 8vw, 72px) clamp(16px, 5vw, 40px)' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 'clamp(28px, 5vw, 48px)' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '24px' }}>
          <span style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.8px' }}>zeuria</span>
          <span style={{ fontSize: '9px', fontWeight: 700, color: '#c8782a', position: 'relative', top: '-5px' }}>®</span>
        </Link>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', fontSize: '13px' }}>
          {[{ key: 'info', label: '1. Details' }, { key: 'payment', label: '2. Payment' }].map(({ key, label }) => (
            <span key={key} style={{ color: step === key ? '#fff' : '#444', fontWeight: step === key ? 600 : 400 }}>{label}</span>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 'clamp(24px, 5vw, 64px)', alignItems: 'start' }}>
        {/* Form */}
        <div>
          {step === 'info' ? (
            <form onSubmit={handleSubmitInfo} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', letterSpacing: '-0.3px' }}>Contact Information</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <input required value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="First name" style={inp} />
                    <input required value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Last name" style={inp} />
                  </div>
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email address" style={inp} />
                  <input required type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="Phone number (e.g. +234 801 234 5678)" style={inp} />
                </div>
              </div>

              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', letterSpacing: '-0.3px' }}>Shipping Address</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input required value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} placeholder="Street address" style={inp} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <input required value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="City" style={inp} />
                    <select required value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} style={{ ...inp, appearance: 'none' }}>
                      {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Order notes (optional)" style={{ ...inp, resize: 'none' }} />
                </div>
              </div>

              <button type="submit" style={{ width: '100%', background: '#fff', color: '#000', border: 'none', borderRadius: '12px', padding: '18px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Continue to Payment →
              </button>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Summary */}
              <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                  <span style={{ color: '#555' }}>Delivering to</span>
                  <span style={{ color: '#ccc' }}>{form.firstName} {form.lastName} · {form.city}, {form.state}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#555' }}>Contact</span>
                  <span style={{ color: '#ccc' }}>{form.email}</span>
                </div>
              </div>

              <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Secure Payment</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { icon: <Shield size={16} />, label: 'Bank-grade encryption', sub: 'Your payment data is encrypted end-to-end by Paystack' },
                  { icon: <CheckCircle size={16} />, label: 'Verified by Paystack', sub: 'Nigeria\'s most trusted payment gateway' },
                  { icon: <Truck size={16} />, label: 'Insured delivery', sub: 'All orders are fully insured during transit' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ color: '#c8782a', flexShrink: 0, marginTop: '1px' }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>{item.label}</div>
                      <div style={{ fontSize: '12px', color: '#555' }}>{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setStep('info')} style={{ flex: 1, background: '#111', color: '#888', border: '1px solid #222', borderRadius: '12px', padding: '16px', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>← Back</button>
                <button onClick={handlePaystack} disabled={loading} style={{ flex: 2, background: loading ? '#333' : '#fff', color: '#000', border: 'none', borderRadius: '12px', padding: '16px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {loading ? <Loader size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Lock size={16} />}
                  {loading ? 'Processing...' : `Pay ₦${total.toLocaleString()}`}
                </button>
              </div>

              <p style={{ fontSize: '11px', color: '#444', textAlign: 'center' }}>
                By paying, you agree to our <Link href="/legal/terms" style={{ color: '#666' }}>Terms</Link> and <Link href="/legal/returns" style={{ color: '#666' }}>Return Policy</Link>.
              </p>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div style={{ background: '#080808', border: '1px solid #141414', borderRadius: '20px', padding: 'clamp(20px, 4vw, 32px)', position: 'sticky', top: '80px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '24px' }}>Order Summary</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            {items.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '52px', height: '52px', background: '#111', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#c8782a', color: '#000', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>{item.qty}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#e0e0e0', lineHeight: 1.3 }}>{item.name}</div>
                  {item.storage && <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>{item.storage}</div>}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff', flexShrink: 0 }}>
                  ₦{(parseInt(item.price.replace(/[₦,]/g, '')) * item.qty).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Discount Code */}
          <div style={{ marginBottom: '20px' }}>
            {!discountData ? (
              <>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Tag size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                    <input value={discountCode} onChange={e => setDiscountCode(e.target.value.toUpperCase())} onKeyDown={e => e.key === 'Enter' && applyDiscount()} placeholder="Discount code" style={{ ...inp, paddingLeft: '34px', padding: '10px 10px 10px 34px' }} />
                  </div>
                  <button onClick={applyDiscount} style={{ background: '#1d1d1d', border: '1px solid #2a2a2a', color: '#ccc', padding: '0 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Apply</button>
                </div>
                {discountError && <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '6px' }}>{discountError}</p>}
              </>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#22c55e', fontWeight: 600 }}><Tag size={13} />{discountCode} applied!</div>
                <button onClick={() => { setDiscountData(null); setDiscountCode(''); }} style={{ background: 'none', border: 'none', color: '#22c55e', cursor: 'pointer', display: 'flex' }}><X size={14} /></button>
              </div>
            )}
          </div>

          <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666' }}><span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666' }}><span>Shipping</span><span style={{ color: shipping === 0 ? '#22c55e' : '#666' }}>{shipping === 0 ? 'FREE' : `₦${shipping.toLocaleString()}`}</span></div>
            {discountAmt > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#22c55e' }}><span>Discount</span><span>-₦{discountAmt.toLocaleString()}</span></div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid #1a1a1a', paddingTop: '16px', marginTop: '4px' }}>
              <span style={{ fontSize: '15px', fontWeight: 600 }}>Total</span>
              <span style={{ fontSize: '24px', fontWeight: 700, color: '#c8782a' }}>₦{total.toLocaleString()}</span>
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
            {['Verve', 'Mastercard', 'Visa', 'USSD'].map(p => <span key={p} style={{ fontSize: '10px', color: '#333', fontWeight: 600, letterSpacing: '0.5px' }}>{p}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}
