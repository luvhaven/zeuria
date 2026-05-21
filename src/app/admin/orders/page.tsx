"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Search, Download, ChevronRight, CheckSquare, Square, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

type Order = {
  id: string; order_number: string; customer_name: string; customer_email: string;
  total: number; status: string; payment_reference?: string; created_at: string;
  items: { name: string; qty: number }[];
};

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending:    { bg: 'rgba(245,158,11,0.1)',  color: '#f59e0b' },
  confirmed:  { bg: 'rgba(59,130,246,0.1)',  color: '#3b82f6' },
  processing: { bg: 'rgba(168,85,247,0.1)',  color: '#a855f7' },
  shipped:    { bg: 'rgba(6,182,212,0.1)',   color: '#06b6d4' },
  delivered:  { bg: 'rgba(34,197,94,0.1)',   color: '#22c55e' },
  cancelled:  { bg: 'rgba(239,68,68,0.1)',   color: '#ef4444' },
  refunded:   { bg: 'rgba(156,163,175,0.1)', color: '#9ca3af' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState('confirmed');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('orders')
      .select('id,order_number,customer_name,customer_email,total,status,payment_reference,created_at,items')
      .order('created_at', { ascending: false });
    setOrders(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const getDateCutoff = () => {
    const now = new Date();
    if (dateFilter === 'today') { const d = new Date(now); d.setHours(0,0,0,0); return d.toISOString(); }
    if (dateFilter === '7d') { const d = new Date(now); d.setDate(d.getDate() - 7); return d.toISOString(); }
    if (dateFilter === '30d') { const d = new Date(now); d.setDate(d.getDate() - 30); return d.toISOString(); }
    return null;
  };

  const filtered = orders.filter(o => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    const cutoff = getDateCutoff();
    if (cutoff && new Date(o.created_at) < new Date(cutoff)) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!o.order_number?.toLowerCase().includes(q) && !o.customer_name?.toLowerCase().includes(q) && !o.customer_email?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => ['confirmed','processing'].includes(o.status)).length,
    revenue: orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0),
  };

  const toggleSelect = (id: string) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => selected.size === filtered.length ? setSelected(new Set()) : setSelected(new Set(filtered.map(o => o.id)));

  const handleBulkStatusUpdate = async () => {
    if (!selected.size) return;
    setBulkLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from('orders').update({ status: bulkStatus, updated_at: new Date().toISOString() }).in('id', [...selected]);
    if (error) { toast.error(error.message); setBulkLoading(false); return; }
    await load();
    setSelected(new Set());
    toast.success(`${selected.size} order(s) updated to "${bulkStatus}"`);
    setBulkLoading(false);
  };

  const handleExportCSV = () => {
    const rows = [
      ['Order #', 'Customer', 'Email', 'Total (₦)', 'Status', 'Payment Ref', 'Date'],
      ...filtered.map(o => [
        o.order_number, o.customer_name, o.customer_email,
        o.total, o.status, o.payment_reference ?? '',
        new Date(o.created_at).toLocaleString('en-NG'),
      ]),
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `zeuria-orders-${Date.now()}.csv`;
    a.click();
    toast.success('Orders exported');
  };

  const inp = { background: '#0d0d0d', border: '1px solid #1d1d1d', color: '#fff', padding: '9px 12px', borderRadius: '8px', outline: 'none', fontSize: '13px', fontFamily: 'inherit' };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.6px', marginBottom: '4px' }}>Orders</h1>
          <div style={{ fontSize: '13px', color: '#555' }}>{orders.length} total orders</div>
        </div>
        <button onClick={handleExportCSV} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#111', border: '1px solid #1d1d1d', color: '#666', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total Orders', value: stats.total, color: '#fff' },
          { label: 'Pending', value: stats.pending, color: '#f59e0b' },
          { label: 'Processing', value: stats.processing, color: '#a855f7' },
          { label: 'Revenue (Delivered)', value: `₦${(stats.revenue / 1000).toFixed(0)}k`, color: '#22c55e' },
        ].map(s => (
          <div key={s.label} style={{ background: '#0a0a0a', border: '1px solid #141414', borderRadius: '12px', padding: '16px 20px' }}>
            <div style={{ fontSize: '11px', color: '#444', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{s.label}</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search order #, name, email…" style={{ ...inp, width: '100%', paddingLeft: '36px', boxSizing: 'border-box' as const }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inp, appearance: 'none' }}>
          <option value="all">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{ ...inp, appearance: 'none' }}>
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </div>

      {/* Status Filter Chips */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {['all', ...STATUSES].map(s => {
          const count = s === 'all' ? orders.length : orders.filter(o => o.status === s).length;
          const active = statusFilter === s;
          const colors = STATUS_COLORS[s] ?? { bg: 'transparent', color: '#666' };
          return (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
              border: active ? `1px solid ${colors.color}40` : '1px solid #1a1a1a',
              background: active ? colors.bg : '#0a0a0a',
              color: active ? colors.color : '#444',
              cursor: 'pointer', fontFamily: 'inherit',
            }}>
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)} ({count})
            </button>
          );
        })}
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(200,120,42,0.08)', border: '1px solid rgba(200,120,42,0.2)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', color: '#c8782a', fontWeight: 600 }}>{selected.size} selected</span>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: '12px', color: '#555' }}>Set status to:</span>
          <select value={bulkStatus} onChange={e => setBulkStatus(e.target.value)} style={{ ...inp, padding: '6px 10px', fontSize: '12px' }}>
            {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <button onClick={handleBulkStatusUpdate} disabled={bulkLoading} style={{ background: '#c8782a', border: 'none', color: '#000', padding: '8px 16px', borderRadius: '7px', cursor: 'pointer', fontSize: '12px', fontWeight: 700, fontFamily: 'inherit' }}>
            {bulkLoading ? 'Updating…' : 'Apply'}
          </button>
          <button onClick={() => setSelected(new Set())} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '18px' }}>×</button>
        </div>
      )}

      {/* Table */}
      <div style={{ background: '#0a0a0a', border: '1px solid #141414', borderRadius: '14px', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '40px 120px 1fr 120px 100px 80px 30px', padding: '10px 16px', borderBottom: '1px solid #111' }}>
          <button onClick={toggleAll} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            {selected.size === filtered.length && filtered.length > 0 ? <CheckSquare size={14} color="#c8782a" /> : <Square size={14} />}
          </button>
          {['Order #', 'Customer', 'Total', 'Status', 'Date', ''].map(h => (
            <div key={h} style={{ fontSize: '11px', color: '#444', fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>

        {/* Rows */}
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#444', fontSize: '13px' }}>Loading orders…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#444', fontSize: '13px' }}>No orders found</div>
        ) : filtered.map(order => {
          const colors = STATUS_COLORS[order.status] ?? STATUS_COLORS.pending;
          const isChecked = selected.has(order.id);
          return (
            <div key={order.id}
              style={{ display: 'grid', gridTemplateColumns: '40px 120px 1fr 120px 100px 80px 30px', padding: '14px 16px', borderBottom: '1px solid #0d0d0d', alignItems: 'center', background: isChecked ? 'rgba(200,120,42,0.04)' : 'transparent', transition: 'background 0.15s' }}
              onMouseEnter={e => { if (!isChecked) (e.currentTarget as HTMLElement).style.background = '#0d0d0d'; }}
              onMouseLeave={e => { if (!isChecked) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>

              <button onClick={() => toggleSelect(order.id)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                {isChecked ? <CheckSquare size={14} color="#c8782a" /> : <Square size={14} />}
              </button>

              <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#c8782a' }}>#{order.order_number}</div>

              <div>
                <div style={{ fontSize: '13px', color: '#fff', fontWeight: 500, marginBottom: '2px' }}>{order.customer_name || 'Guest'}</div>
                <div style={{ fontSize: '11px', color: '#444' }}>{order.customer_email}</div>
                {order.items && Array.isArray(order.items) && order.items.length > 0 && (
                  <div style={{ fontSize: '11px', color: '#333', marginTop: '2px' }}>
                    {order.items.slice(0, 2).map((item: { name: string; qty: number }) => `${item.name} ×${item.qty}`).join(', ')}
                    {order.items.length > 2 && ` +${order.items.length - 2} more`}
                  </div>
                )}
              </div>

              <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>₦{order.total?.toLocaleString()}</div>

              <div style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: colors.bg, color: colors.color, width: 'fit-content' }}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>

              <div style={{ fontSize: '11px', color: '#444' }}>
                {new Date(order.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
              </div>

              <Link href={`/admin/orders/${order.id}`} style={{ color: '#444', display: 'flex', alignItems: 'center' }}>
                <ChevronRight size={16} />
              </Link>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#333', textAlign: 'right' }}>
        Showing {filtered.length} of {orders.length} orders
      </div>
    </div>
  );
}
