"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, ShoppingBag, LogOut, User, ArrowUpRight, Clock } from 'lucide-react';

type Order = {
  id: string;
  order_number: string;
  total: number;
  status: string;
  created_at: string;
  items: { name: string; qty: number }[];
};

type Profile = {
  first_name: string;
  last_name: string;
  role: string;
};

export default function AccountDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/account'); return; }
      const [{ data: prof }, { data: ords }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
      ]);
      setProfile(prof);
      setOrders(ords || []);
      setLoading(false);
    };
    load();
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const statusColor: Record<string, string> = {
    pending: '#f59e0b', paid: '#3b82f6', processing: '#8b5cf6',
    shipped: '#06b6d4', delivered: '#22c55e', cancelled: '#ef4444', refunded: '#6b7280'
  };

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '32px', height: '32px', border: '2px solid #333', borderTopColor: '#c8782a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#666', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Your Account</div>
          <h1 style={{ fontSize: '40px', fontWeight: 700, letterSpacing: '-1.5px' }}>
            Hello, {profile?.first_name || 'there'}.
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {profile?.role && ['admin', 'superadmin'].includes(profile.role) && (
            <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(200,120,42,0.1)', border: '1px solid rgba(200,120,42,0.3)', color: '#c8782a', padding: '10px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
              Admin Dashboard <ArrowUpRight size={14} />
            </Link>
          )}
          <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#111', border: '1px solid #222', color: '#888', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px' }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '48px' }}>
        {[
          { icon: <ShoppingBag size={20} />, label: 'Total Orders', value: orders.length },
          { icon: <Package size={20} />, label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length },
          { icon: <Clock size={20} />, label: 'In Progress', value: orders.filter(o => ['paid', 'processing', 'shipped'].includes(o.status)).length },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#090909', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' }}>
            <div style={{ color: '#c8782a', marginBottom: '12px' }}>{stat.icon}</div>
            <div style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-1px', marginBottom: '4px' }}>{stat.value}</div>
            <div style={{ fontSize: '13px', color: '#666' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Orders */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px', letterSpacing: '-0.5px' }}>Order History</h2>
        {orders.length === 0 ? (
          <div style={{ background: '#090909', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
            <ShoppingBag size={40} style={{ color: '#333', margin: '0 auto 16px' }} />
            <p style={{ color: '#555' }}>No orders yet. Time to treat yourself.</p>
            <Link href="/shop" style={{ display: 'inline-block', marginTop: '16px', background: '#fff', color: '#000', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>Shop Now</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {orders.map(order => (
              <div key={order.id} style={{ background: '#090909', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{order.order_number}</div>
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    {order.items?.length} item{order.items?.length !== 1 ? 's' : ''} · {new Date(order.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#c8782a', marginBottom: '6px' }}>₦{order.total.toLocaleString()}</div>
                  <div style={{ display: 'inline-block', background: `${statusColor[order.status]}20`, border: `1px solid ${statusColor[order.status]}40`, color: statusColor[order.status], padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, textTransform: 'capitalize', letterSpacing: '0.5px' }}>
                    {order.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
