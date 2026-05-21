"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, ShoppingBag, Users, Package, ArrowUpRight, Eye } from 'lucide-react';

type Stat = { label: string; value: string | number; sub: string; icon: React.ReactNode; color: string };
type RecentOrder = { id: string; order_number: string; customer_name: string; total: number; status: string; created_at: string };
type ChartPoint = { date: string; revenue: number; orders: number };

export default function AdminOverview() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [topProducts, setTopProducts] = useState<{ name: string; views: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();

      const [
        { count: totalOrders },
        { data: paidOrders },
        { count: totalCustomers },
        { count: totalProducts },
        { data: orders7d },
        { data: recent },
        { data: topViewed },
      ] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total').eq('status', 'paid').neq('status', 'cancelled'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('orders').select('total, created_at, status').gte('created_at', new Date(Date.now() - 7 * 864e5).toISOString()).order('created_at'),
        supabase.from('orders').select('id, order_number, customer_name, total, status, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('analytics_events').select('metadata').eq('event_type', 'product_view').limit(200),
      ]);

      const totalRevenue = (paidOrders || []).reduce((s, o) => s + (o.total || 0), 0);

      setStats([
        { label: 'Total Revenue', value: `₦${totalRevenue.toLocaleString()}`, sub: 'All time paid orders', icon: <TrendingUp size={18} />, color: '#c8782a' },
        { label: 'Total Orders', value: totalOrders || 0, sub: 'All time', icon: <ShoppingBag size={18} />, color: '#3b82f6' },
        { label: 'Customers', value: totalCustomers || 0, sub: 'Registered accounts', icon: <Users size={18} />, color: '#8b5cf6' },
        { label: 'Active Products', value: totalProducts || 0, sub: 'Live in store', icon: <Package size={18} />, color: '#22c55e' },
      ]);

      // Build 7-day chart
      const days: Record<string, { revenue: number; orders: number }> = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date(Date.now() - i * 864e5);
        days[d.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })] = { revenue: 0, orders: 0 };
      }
      (orders7d || []).forEach(o => {
        const key = new Date(o.created_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
        if (days[key]) { days[key].revenue += o.total; days[key].orders += 1; }
      });
      setChartData(Object.entries(days).map(([date, v]) => ({ date, ...v })));

      setRecentOrders(recent || []);

      // Aggregate top products from analytics
      const productCounts: Record<string, number> = {};
      (topViewed || []).forEach(e => {
        const name = (e.metadata as Record<string, string>)?.name;
        if (name) productCounts[name] = (productCounts[name] || 0) + 1;
      });
      setTopProducts(Object.entries(productCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, views]) => ({ name, views })));

      setLoading(false);
    };
    load();
  }, []);

  const statusColor: Record<string, string> = {
    pending: '#f59e0b', paid: '#3b82f6', processing: '#8b5cf6',
    shipped: '#06b6d4', delivered: '#22c55e', cancelled: '#ef4444'
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: '32px', height: '32px', border: '2px solid #222', borderTopColor: '#c8782a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-1px', marginBottom: '4px' }}>Overview</h1>
        <p style={{ color: '#555', fontSize: '14px' }}>Your store at a glance.</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {stats.map(stat => (
          <div key={stat.label} style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ color: stat.color, background: `${stat.color}15`, padding: '8px', borderRadius: '8px' }}>{stat.icon}</div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.8px', color: '#fff', marginBottom: '4px' }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: '#444', marginBottom: '2px' }}>{stat.label}</div>
            <div style={{ fontSize: '11px', color: '#333' }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Revenue Chart */}
        <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>Revenue (7 days)</h2>
              <p style={{ fontSize: '12px', color: '#555' }}>Daily revenue breakdown</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c8782a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#c8782a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: '8px', color: '#fff', fontSize: '12px' }} formatter={(v) => [`₦${Number(v).toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#c8782a" strokeWidth={2} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Top Viewed Products</h2>
          {topProducts.length === 0 ? (
            <p style={{ color: '#444', fontSize: '13px' }}>No product views tracked yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {topProducts.map((p, i) => (
                <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', background: '#181818', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#666', flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1, fontSize: '13px', color: '#ccc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#555', fontSize: '12px', flexShrink: 0 }}><Eye size={12} />{p.views}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600 }}>Recent Orders</h2>
          <Link href="/admin/orders" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#c8782a', textDecoration: 'none', fontSize: '13px' }}>View all <ArrowUpRight size={13} /></Link>
        </div>
        {recentOrders.length === 0 ? (
          <p style={{ color: '#444', fontSize: '13px' }}>No orders yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                  {['Order', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: '11px', color: '#555', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #111' }}>
                    <td style={{ padding: '12px', fontSize: '13px', fontWeight: 600, color: '#c8782a' }}>{order.order_number}</td>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#ccc' }}>{order.customer_name}</td>
                    <td style={{ padding: '12px', fontSize: '13px', fontWeight: 600 }}>₦{order.total?.toLocaleString()}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ background: `${statusColor[order.status] || '#666'}18`, border: `1px solid ${statusColor[order.status] || '#666'}30`, color: statusColor[order.status] || '#666', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, textTransform: 'capitalize' }}>{order.status}</span>
                    </td>
                    <td style={{ padding: '12px', fontSize: '12px', color: '#555' }}>{new Date(order.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
