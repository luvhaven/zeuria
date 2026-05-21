"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Trash2, Tag } from 'lucide-react';

type Discount = {
  id: string; code: string; type: 'percentage' | 'fixed'; value: number;
  max_uses: number | null; used_count: number; minimum_order: number;
  expires_at: string | null; is_active: boolean; created_at: string;
};

export default function AdminDiscounts() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'percentage', value: '', max_uses: '', minimum_order: '', expires_at: '' });

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('discount_codes').select('*').order('created_at', { ascending: false });
      setDiscounts(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.value) return;
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase.from('discount_codes').insert({
      code: form.code.toUpperCase(),
      type: form.type,
      value: parseInt(form.value),
      max_uses: form.max_uses ? parseInt(form.max_uses) : null,
      minimum_order: form.minimum_order ? parseInt(form.minimum_order) : 0,
      expires_at: form.expires_at || null,
    }).select().single();
    if (!error && data) setDiscounts(prev => [data, ...prev]);
    setForm({ code: '', type: 'percentage', value: '', max_uses: '', minimum_order: '', expires_at: '' });
    setSaving(false);
  };

  const toggleActive = async (id: string, current: boolean) => {
    const supabase = createClient();
    await supabase.from('discount_codes').update({ is_active: !current }).eq('id', id);
    setDiscounts(prev => prev.map(d => d.id === id ? { ...d, is_active: !current } : d));
  };

  const deleteDiscount = async (id: string) => {
    if (!confirm('Delete this discount code?')) return;
    const supabase = createClient();
    await supabase.from('discount_codes').delete().eq('id', id);
    setDiscounts(prev => prev.filter(d => d.id !== id));
  };

  const inp = { width: '100%', background: '#111', border: '1px solid #1d1d1d', color: '#fff', padding: '10px 12px', borderRadius: '8px', outline: 'none', fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box' as const };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-1px', marginBottom: '4px' }}>Discount Codes</h1>
        <p style={{ color: '#555', fontSize: '14px' }}>Create and manage promotional codes.</p>
      </div>

      {/* Create Form */}
      <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Create New Code</h2>
        <form onSubmit={handleCreate}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#555', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Code *</label>
              <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="ZEURIA20" required style={inp} />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#555', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={{ ...inp, appearance: 'none' }}>
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₦)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#555', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Value *</label>
              <input type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} placeholder={form.type === 'percentage' ? '20' : '10000'} required style={inp} />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#555', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Max Uses</label>
              <input type="number" value={form.max_uses} onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))} placeholder="Unlimited" style={inp} />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#555', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Min Order (₦)</label>
              <input type="number" value={form.minimum_order} onChange={e => setForm(f => ({ ...f, minimum_order: e.target.value }))} placeholder="0" style={inp} />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#555', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Expires At</label>
              <input type="date" value={form.expires_at} onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))} style={{ ...inp, colorScheme: 'dark' }} />
            </div>
          </div>
          <button type="submit" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: 700 }}>
            <Plus size={14} /> {saving ? 'Creating...' : 'Create Code'}
          </button>
        </form>
      </div>

      {/* List */}
      <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', overflow: 'hidden' }}>
        {loading ? <div style={{ padding: '40px', textAlign: 'center', color: '#444' }}>Loading...</div> :
          discounts.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <Tag size={40} style={{ color: '#222', margin: '0 auto 12px' }} />
              <p style={{ color: '#555' }}>No discount codes yet.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Code', 'Type', 'Value', 'Uses', 'Min Order', 'Expires', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '10px 12px', fontSize: '11px', color: '#555', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid #1a1a1a' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {discounts.map(d => (
                  <tr key={d.id}>
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: 700, color: '#c8782a', fontFamily: 'monospace', borderBottom: '1px solid #0f0f0f' }}>{d.code}</td>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#888', borderBottom: '1px solid #0f0f0f', textTransform: 'capitalize' }}>{d.type}</td>
                    <td style={{ padding: '12px', fontSize: '13px', fontWeight: 600, color: '#fff', borderBottom: '1px solid #0f0f0f' }}>{d.type === 'percentage' ? `${d.value}%` : `₦${d.value.toLocaleString()}`}</td>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#888', borderBottom: '1px solid #0f0f0f' }}>{d.used_count} / {d.max_uses || '∞'}</td>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#888', borderBottom: '1px solid #0f0f0f' }}>{d.minimum_order > 0 ? `₦${d.minimum_order.toLocaleString()}` : 'None'}</td>
                    <td style={{ padding: '12px', fontSize: '12px', color: '#666', borderBottom: '1px solid #0f0f0f' }}>{d.expires_at ? new Date(d.expires_at).toLocaleDateString() : '—'}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #0f0f0f' }}>
                      <button onClick={() => toggleActive(d.id, d.is_active)} style={{ background: d.is_active ? 'rgba(34,197,94,0.1)' : '#111', border: `1px solid ${d.is_active ? 'rgba(34,197,94,0.3)' : '#333'}`, color: d.is_active ? '#22c55e' : '#555', padding: '4px 10px', borderRadius: '20px', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>
                        {d.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #0f0f0f' }}>
                      <button onClick={() => deleteDiscount(d.id)} style={{ display: 'flex', alignItems: 'center', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>
    </div>
  );
}
