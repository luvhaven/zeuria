"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, Package, MapPin, CreditCard, Phone, Mail } from 'lucide-react';

const STATUSES = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
const statusColor: Record<string, string> = {
  pending: '#f59e0b', paid: '#3b82f6', processing: '#8b5cf6',
  shipped: '#06b6d4', delivered: '#22c55e', cancelled: '#ef4444', refunded: '#6b7280'
};

type Order = {
  id: string; order_number: string; customer_name: string; customer_email: string;
  customer_phone: string; total: number; subtotal: number; shipping_fee: number;
  discount: number; status: string; payment_reference: string; payment_channel: string;
  shipping_address: Record<string, string>; items: Array<{ name: string; qty: number; price: string; image?: string; storage?: string }>;
  notes: string; created_at: string;
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('orders').select('*').eq('id', id).single();
      setOrder(data);
      setLoading(false);
    };
    load();
  }, [id]);

  const updateStatus = async (newStatus: string) => {
    if (!order) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    setOrder(o => o ? { ...o, status: newStatus } : o);
    setSaving(false);
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}><div style={{ width: '32px', height: '32px', border: '2px solid #222', borderTopColor: '#c8782a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /></div>;
  if (!order) return <div style={{ padding: '60px', textAlign: 'center', color: '#555' }}>Order not found.</div>;

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <Link href="/admin/orders" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555', textDecoration: 'none', fontSize: '14px' }}><ArrowLeft size={16} /> Orders</Link>
        <span style={{ color: '#333' }}>/</span>
        <span style={{ color: '#c8782a', fontSize: '14px', fontWeight: 600 }}>{order.order_number}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.8px', marginBottom: '4px' }}>{order.order_number}</h1>
          <p style={{ color: '#555', fontSize: '13px' }}>{new Date(order.created_at).toLocaleString('en-NG', { dateStyle: 'full', timeStyle: 'short' })}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: '#555' }}>Status:</span>
          <div style={{ position: 'relative' }}>
            <select value={order.status} onChange={e => updateStatus(e.target.value)} disabled={saving} style={{ appearance: 'none', background: `${statusColor[order.status]}15`, border: `1px solid ${statusColor[order.status]}40`, color: statusColor[order.status], padding: '8px 32px 8px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, textTransform: 'capitalize', cursor: 'pointer', outline: 'none', fontFamily: 'inherit' }}>
              {STATUSES.map(s => <option key={s} value={s} style={{ background: '#111', color: '#fff' }}>{s}</option>)}
            </select>
            <ChevronDown size={12} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: statusColor[order.status], pointerEvents: 'none' }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* Order Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><Package size={16} color="#c8782a" /> Items Ordered</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {order.items?.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: '16px', borderBottom: '1px solid #111' }}>
                  {item.image && <div style={{ width: '56px', height: '56px', background: '#111', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}><img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: '#555' }}>{item.storage || ''} · Qty: {item.qty}</div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#c8782a' }}>{item.price}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666' }}><span>Subtotal</span><span>₦{order.subtotal?.toLocaleString()}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666' }}><span>Shipping</span><span>₦{order.shipping_fee?.toLocaleString()}</span></div>
              {order.discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#22c55e' }}><span>Discount</span><span>-₦{order.discount?.toLocaleString()}</span></div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 700, color: '#fff', paddingTop: '10px', borderTop: '1px solid #1a1a1a' }}><span>Total</span><span style={{ color: '#c8782a' }}>₦{order.total?.toLocaleString()}</span></div>
            </div>
          </div>
        </div>

        {/* Customer & Payment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Customer</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>{order.customer_name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#666' }}><Mail size={13} />{order.customer_email}</div>
              {order.customer_phone && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#666' }}><Phone size={13} />{order.customer_phone}</div>}
            </div>
          </div>

          <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={15} color="#c8782a" /> Shipping Address</h2>
            <div style={{ fontSize: '13px', color: '#888', lineHeight: 1.7 }}>
              {order.shipping_address?.street}<br />
              {order.shipping_address?.city}, {order.shipping_address?.state}<br />
              Nigeria
            </div>
          </div>

          <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><CreditCard size={15} color="#c8782a" /> Payment</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#555' }}>Reference</span><span style={{ color: '#888', fontFamily: 'monospace' }}>{order.payment_reference || '—'}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#555' }}>Channel</span><span style={{ color: '#888' }}>{order.payment_channel || 'Paystack'}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
