"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, AlertTriangle, Package, Save } from 'lucide-react';
import toast from 'react-hot-toast';

type Product = { id: string; name: string; brand: string; sku?: string; stock: number; price: number; is_active: boolean; product_images?: { url: string; is_primary: boolean }[] };

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
  const [adjustments, setAdjustments] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('products')
      .select('id,name,brand,stock,price,is_active,product_images(url,is_primary)')
      .order('stock', { ascending: true });
    setProducts(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = products.filter(p => {
    if (filter === 'low' && (p.stock <= 0 || p.stock > 5)) return false;
    if (filter === 'out' && p.stock !== 0) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.brand.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleStockSave = async (productId: string, currentStock: number) => {
    const val = adjustments[productId];
    if (val === undefined || val === '') return;
    const newStock = parseInt(val);
    if (isNaN(newStock) || newStock < 0) { toast.error('Invalid stock value'); return; }
    setSaving(productId);
    const supabase = createClient();
    const { error } = await supabase.from('products').update({ stock: newStock, updated_at: new Date().toISOString() }).eq('id', productId);
    if (error) { toast.error(error.message); setSaving(null); return; }
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));
    setAdjustments(prev => { const n = { ...prev }; delete n[productId]; return n; });
    toast.success(`Stock updated: ${currentStock} → ${newStock}`);
    setSaving(null);
  };

  const handleQuickAdj = (id: string, current: number, delta: number) => {
    const newVal = Math.max(0, current + delta);
    setAdjustments(prev => ({ ...prev, [id]: newVal.toString() }));
  };

  const outCount = products.filter(p => p.stock === 0).length;
  const lowCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const totalValue = products.reduce((s, p) => s + p.stock * p.price, 0);

  const inp = { background: '#0d0d0d', border: '1px solid #1d1d1d', color: '#fff', padding: '9px 12px', borderRadius: '8px', outline: 'none', fontSize: '13px', fontFamily: 'inherit' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.6px', marginBottom: '4px' }}>Inventory</h1>
          <div style={{ fontSize: '13px', color: '#555' }}>Inline stock adjustments — changes save immediately</div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total SKUs', value: products.length, color: '#fff', icon: Package },
          { label: 'Out of Stock', value: outCount, color: '#ef4444', icon: AlertTriangle, onClick: () => setFilter('out') },
          { label: 'Low Stock (≤5)', value: lowCount, color: '#f59e0b', icon: AlertTriangle, onClick: () => setFilter('low') },
          { label: 'Stock Value', value: `₦${(totalValue / 1000000).toFixed(1)}M`, color: '#22c55e', icon: Package },
        ].map(k => (
          <div key={k.label} onClick={k.onClick} style={{ background: '#0a0a0a', border: '1px solid #141414', borderRadius: '12px', padding: '16px 20px', cursor: k.onClick ? 'pointer' : 'default' }}
            onMouseEnter={e => { if (k.onClick) (e.currentTarget as HTMLElement).style.borderColor = '#222'; }}
            onMouseLeave={e => { if (k.onClick) (e.currentTarget as HTMLElement).style.borderColor = '#141414'; }}>
            <div style={{ fontSize: '11px', color: '#444', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{k.label}</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" style={{ ...inp, width: '100%', paddingLeft: '36px', boxSizing: 'border-box' as const }} />
        </div>
        {(['all', 'low', 'out'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
            border: filter === f ? '1px solid #c8782a' : '1px solid #1d1d1d',
            background: filter === f ? 'rgba(200,120,42,0.1)' : '#0d0d0d',
            color: filter === f ? '#c8782a' : '#555',
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            {f === 'all' ? 'All Products' : f === 'low' ? '⚠ Low Stock' : '🔴 Out of Stock'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#0a0a0a', border: '1px solid #141414', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 80px 200px 80px', padding: '10px 16px', borderBottom: '1px solid #111' }}>
          {['', 'Product', 'Status', 'Stock Control', 'Price'].map(h => (
            <div key={h} style={{ fontSize: '11px', color: '#444', fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#444', fontSize: '13px' }}>Loading inventory…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#444', fontSize: '13px' }}>No products match your filter</div>
        ) : filtered.map(p => {
          const primaryImg = p.product_images?.find(i => i.is_primary)?.url ?? p.product_images?.[0]?.url;
          const currentDisplayStock = adjustments[p.id] !== undefined ? parseInt(adjustments[p.id] || '0') : p.stock;
          const isDirty = adjustments[p.id] !== undefined;
          const isOut = p.stock === 0;
          const isLow = p.stock > 0 && p.stock <= 5;

          return (
            <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '50px 1fr 80px 200px 80px', padding: '12px 16px', borderBottom: '1px solid #0d0d0d', alignItems: 'center' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#0d0d0d'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>

              {/* Image */}
              <div style={{ width: '36px', height: '36px', background: '#111', borderRadius: '8px', overflow: 'hidden' }}>
                {primaryImg ? <img src={primaryImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={14} style={{ color: '#333', margin: '11px' }} />}
              </div>

              {/* Name */}
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: '#fff', marginBottom: '2px' }}>{p.name}</div>
                <div style={{ fontSize: '11px', color: '#444' }}>{p.brand}</div>
              </div>

              {/* Status */}
              <div>
                {isOut ? (
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '3px 7px', borderRadius: '4px' }}>OUT</span>
                ) : isLow ? (
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '3px 7px', borderRadius: '4px' }}>LOW</span>
                ) : (
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '3px 7px', borderRadius: '4px' }}>OK</span>
                )}
              </div>

              {/* Stock Control */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button onClick={() => handleQuickAdj(p.id, parseInt(adjustments[p.id] ?? p.stock.toString()), -1)} style={{ background: '#111', border: '1px solid #222', color: '#888', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                <input
                  type="number" min="0"
                  value={adjustments[p.id] ?? p.stock}
                  onChange={e => setAdjustments(prev => ({ ...prev, [p.id]: e.target.value }))}
                  style={{ width: '60px', background: isDirty ? 'rgba(200,120,42,0.08)' : '#0d0d0d', border: isDirty ? '1px solid rgba(200,120,42,0.4)' : '1px solid #1d1d1d', color: isDirty ? '#c8782a' : '#fff', padding: '6px 8px', borderRadius: '6px', outline: 'none', fontSize: '13px', fontFamily: 'inherit', textAlign: 'center' }}
                />
                <button onClick={() => handleQuickAdj(p.id, parseInt(adjustments[p.id] ?? p.stock.toString()), 1)} style={{ background: '#111', border: '1px solid #222', color: '#888', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                {isDirty && (
                  <button onClick={() => handleStockSave(p.id, p.stock)} disabled={saving === p.id} style={{ background: '#c8782a', border: 'none', color: '#000', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, fontFamily: 'inherit' }}>
                    <Save size={12} /> {saving === p.id ? '…' : 'Save'}
                  </button>
                )}
              </div>

              {/* Price */}
              <div style={{ fontSize: '13px', color: '#666' }}>₦{p.price.toLocaleString()}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
