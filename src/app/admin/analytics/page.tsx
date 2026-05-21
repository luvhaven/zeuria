"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Eye, ShoppingCart, CreditCard, Users } from 'lucide-react';

const COLORS = ['#c8782a', '#3b82f6', '#8b5cf6', '#22c55e', '#06b6d4'];

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(30);
  const [revenueData, setRevenueData] = useState<{ date: string; revenue: number; orders: number }[]>([]);
  const [eventCounts, setEventCounts] = useState<{ name: string; count: number; icon: React.ReactNode; color: string }[]>([]);
  const [topProducts, setTopProducts] = useState<{ name: string; views: number }[]>([]);
  const [conversionRate, setConversionRate] = useState(0);
  const [deviceData, setDeviceData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const supabase = createClient();
      const since = new Date(Date.now() - range * 864e5).toISOString();

      const [{ data: orders }, { data: events }] = await Promise.all([
        supabase.from('orders').select('total, status, created_at').gte('created_at', since).order('created_at'),
        supabase.from('analytics_events').select('event_type, metadata, created_at').gte('created_at', since),
      ]);

      // Build daily revenue chart
      const days: Record<string, { revenue: number; orders: number }> = {};
      for (let i = range - 1; i >= 0; i--) {
        const d = new Date(Date.now() - i * 864e5);
        days[d.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })] = { revenue: 0, orders: 0 };
      }
      (orders || []).forEach(o => {
        const key = new Date(o.created_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
        if (days[key] && o.status !== 'cancelled') { days[key].revenue += o.total; days[key].orders += 1; }
      });
      setRevenueData(Object.entries(days).map(([date, v]) => ({ date, ...v })));

      // Event counts
      const evts = events || [];
      const counts: Record<string, number> = {};
      evts.forEach(e => { counts[e.event_type] = (counts[e.event_type] || 0) + 1; });
      setEventCounts([
        { name: 'Page Views', count: counts['page_view'] || 0, icon: <Eye size={18} />, color: '#3b82f6' },
        { name: 'Product Views', count: counts['product_view'] || 0, icon: <ShoppingCart size={18} />, color: '#8b5cf6' },
        { name: 'Add to Cart', count: counts['add_to_cart'] || 0, icon: <ShoppingCart size={18} />, color: '#c8782a' },
        { name: 'Checkouts', count: counts['checkout_start'] || 0, icon: <CreditCard size={18} />, color: '#22c55e' },
        { name: 'Purchases', count: counts['purchase'] || 0, icon: <CreditCard size={18} />, color: '#06b6d4' },
      ]);

      // Conversion
      const views = counts['page_view'] || 1;
      const purchases = counts['purchase'] || 0;
      setConversionRate(Math.round((purchases / views) * 10000) / 100);

      // Top products from analytics
      const prod: Record<string, number> = {};
      evts.filter(e => e.event_type === 'product_view').forEach(e => {
        const name = (e.metadata as Record<string, string>)?.name;
        if (name) prod[name] = (prod[name] || 0) + 1;
      });
      setTopProducts(Object.entries(prod).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, views]) => ({ name, views })));

      // Funnel data
      setDeviceData([
        { name: 'Page Views', value: counts['page_view'] || 0 },
        { name: 'Product Views', value: counts['product_view'] || 0 },
        { name: 'Add to Cart', value: counts['add_to_cart'] || 0 },
        { name: 'Purchases', value: counts['purchase'] || 0 },
      ]);

      setLoading(false);
    };
    load();
  }, [range]);

  const card = { background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}><div style={{ width: '32px', height: '32px', border: '2px solid #222', borderTopColor: '#c8782a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-1px', marginBottom: '4px' }}>Analytics</h1>
          <p style={{ color: '#555', fontSize: '14px' }}>Visitor & revenue intelligence.</p>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[7, 14, 30, 90].map(d => (
            <button key={d} onClick={() => setRange(d)} style={{ padding: '8px 14px', borderRadius: '8px', border: range === d ? '1px solid #c8782a' : '1px solid #1d1d1d', background: range === d ? 'rgba(200,120,42,0.1)' : '#0d0d0d', color: range === d ? '#c8782a' : '#666', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>{d}d</button>
          ))}
        </div>
      </div>

      {/* Event KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {eventCounts.map(e => (
          <div key={e.name} style={{ ...card, padding: '16px' }}>
            <div style={{ color: e.color, marginBottom: '12px' }}>{e.icon}</div>
            <div style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '4px' }}>{e.count.toLocaleString()}</div>
            <div style={{ fontSize: '11px', color: '#555' }}>{e.name}</div>
          </div>
        ))}
      </div>

      {/* Revenue + Funnel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div style={card}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>Revenue & Orders</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c8782a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#c8782a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: '#444', fontSize: 10 }} axisLine={false} tickLine={false} interval={range > 14 ? Math.floor(range / 7) : 0} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: '8px', color: '#fff', fontSize: '12px' }} formatter={(v) => [`₦${Number(v).toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#c8782a" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={card}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>Conversion Funnel</h2>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#c8782a', marginBottom: '4px' }}>{conversionRate}%</div>
          <div style={{ fontSize: '12px', color: '#555', marginBottom: '20px' }}>Views → Purchases</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {deviceData.map((d, i) => (
              <div key={d.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: '#888' }}>{d.name}</span>
                  <span style={{ color: '#ccc', fontWeight: 600 }}>{d.value.toLocaleString()}</span>
                </div>
                <div style={{ height: '4px', background: '#181818', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${deviceData[0].value > 0 ? (d.value / deviceData[0].value * 100) : 0}%`, background: COLORS[i], borderRadius: '2px', transition: 'width 0.5s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products Bar Chart */}
      {topProducts.length > 0 && (
        <div style={card}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>Most Viewed Products</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topProducts} layout="vertical">
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" tick={{ fill: '#888', fontSize: 12 }} width={160} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
              <Bar dataKey="views" fill="#c8782a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
