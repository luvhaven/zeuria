"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Plus, Search, Package, Edit2, Trash2, Eye, EyeOff, AlertTriangle, CheckSquare, Square, Download } from 'lucide-react';
import toast from 'react-hot-toast';

type Product = {
  id: string; name: string; brand: string; category: string;
  price: number; stock: number; is_active: boolean; is_featured: boolean;
  slug: string; badge?: string; created_at: string;
  product_images?: { url: string; is_primary: boolean }[];
};

const BRAND_FILTER = ['All', 'APPLE', 'SAMSUNG', 'GOOGLE', 'HUAWEI', 'XIAOMI'];
const STATUS_FILTER = ['All', 'Active', 'Draft', 'Low Stock', 'Out of Stock'];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'created'>('created');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('products')
      .select('id,name,brand,category,price,stock,is_active,is_featured,slug,badge,created_at,product_images(url,is_primary)')
      .order('created_at', { ascending: false });
    setProducts(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = products
    .filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.brand.toLowerCase().includes(search.toLowerCase())) return false;
      if (brandFilter !== 'All' && p.brand !== brandFilter) return false;
      if (statusFilter === 'Active' && !p.is_active) return false;
      if (statusFilter === 'Draft' && p.is_active) return false;
      if (statusFilter === 'Low Stock' && (p.stock > 5 || p.stock <= 0)) return false;
      if (statusFilter === 'Out of Stock' && p.stock !== 0) return false;
      return true;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortBy === 'price') cmp = a.price - b.price;
      else if (sortBy === 'stock') cmp = a.stock - b.stock;
      else cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const toggleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('desc'); }
  };

  const toggleSelect = (id: string) => setSelected(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(p => p.id)));
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    const supabase = createClient();
    const { error } = await supabase.from('products').update({ is_active: !current, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) { toast.error(error.message); return; }
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !current } : p));
    toast.success(current ? 'Set to draft' : 'Set to active');
  };

  const handleBulkActivate = async (activate: boolean) => {
    if (!selected.size) return;
    setBulkLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from('products').update({ is_active: activate, updated_at: new Date().toISOString() }).in('id', [...selected]);
    if (error) { toast.error(error.message); setBulkLoading(false); return; }
    await load();
    setSelected(new Set());
    toast.success(`${selected.size} product(s) ${activate ? 'activated' : 'set to draft'}`);
    setBulkLoading(false);
  };

  const handleBulkDelete = async () => {
    if (!selected.size || !confirm(`Permanently delete ${selected.size} product(s)?`)) return;
    setBulkLoading(true);
    const supabase = createClient();
    await supabase.from('product_images').delete().in('product_id', [...selected]);
    const { error } = await supabase.from('products').delete().in('id', [...selected]);
    if (error) { toast.error(error.message); setBulkLoading(false); return; }
    await load();
    setSelected(new Set());
    toast.success(`${selected.size} product(s) deleted`);
    setBulkLoading(false);
  };

  const handleExportCSV = () => {
    const rows = [
      ['ID', 'Name', 'Brand', 'Category', 'Price', 'Stock', 'Active', 'Featured', 'Slug'],
      ...filtered.map(p => [p.id, p.name, p.brand, p.category, p.price, p.stock, p.is_active, p.is_featured, p.slug]),
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `zeuria-products-${Date.now()}.csv`; a.click();
    toast.success('CSV exported');
  };

  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  const inp = { background: '#0d0d0d', border: '1px solid #1d1d1d', color: '#fff', padding: '9px 12px', borderRadius: '8px', outline: 'none', fontSize: '13px', fontFamily: 'inherit' };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.6px', marginBottom: '4px' }}>Products</h1>
          <div style={{ fontSize: '13px', color: '#555' }}>{products.length} total · {products.filter(p => p.is_active).length} active</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleExportCSV} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#111', border: '1px solid #1d1d1d', color: '#666', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>
            <Download size={14} /> Export CSV
          </button>
          <Link href="/admin/products/new" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', color: '#000', padding: '10px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
            <Plus size={15} /> Add Product
          </Link>
        </div>
      </div>

      {/* Alert Cards */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {outOfStockCount > 0 && (
            <div onClick={() => setStatusFilter('Out of Stock')} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '12px 16px', cursor: 'pointer' }}>
              <AlertTriangle size={16} color="#ef4444" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#ef4444' }}>{outOfStockCount}</div>
                <div style={{ fontSize: '11px', color: '#888' }}>Out of stock</div>
              </div>
            </div>
          )}
          {lowStockCount > 0 && (
            <div onClick={() => setStatusFilter('Low Stock')} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px', padding: '12px 16px', cursor: 'pointer' }}>
              <AlertTriangle size={16} color="#f59e0b" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#f59e0b' }}>{lowStockCount}</div>
                <div style={{ fontSize: '11px', color: '#888' }}>Low stock (≤5)</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" style={{ ...inp, width: '100%', paddingLeft: '36px', boxSizing: 'border-box' as const }} />
        </div>
        <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)} style={{ ...inp, appearance: 'none' }}>
          {BRAND_FILTER.map(b => <option key={b}>{b}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inp, appearance: 'none' }}>
          {STATUS_FILTER.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Bulk Action Bar */}
      {selected.size > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(200,120,42,0.08)', border: '1px solid rgba(200,120,42,0.2)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px' }}>
          <span style={{ fontSize: '13px', color: '#c8782a', fontWeight: 600 }}>{selected.size} selected</span>
          <div style={{ flex: 1 }} />
          <button onClick={() => handleBulkActivate(true)} disabled={bulkLoading} style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e', padding: '7px 14px', borderRadius: '7px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'inherit' }}>Activate</button>
          <button onClick={() => handleBulkActivate(false)} disabled={bulkLoading} style={{ background: '#111', border: '1px solid #222', color: '#888', padding: '7px 14px', borderRadius: '7px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit' }}>Set Draft</button>
          <button onClick={handleBulkDelete} disabled={bulkLoading} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '7px 14px', borderRadius: '7px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'inherit' }}>
            <Trash2 size={12} style={{ display: 'inline', marginRight: '4px' }} />Delete
          </button>
          <button onClick={() => setSelected(new Set())} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '18px' }}>×</button>
        </div>
      )}

      {/* Table */}
      <div style={{ background: '#0a0a0a', border: '1px solid #141414', borderRadius: '14px', overflow: 'hidden' }}>
        {/* Table Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '40px 60px 1fr 100px 100px 80px 100px 80px', gap: '0', borderBottom: '1px solid #141414', padding: '10px 16px' }}>
          <button onClick={toggleAll} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            {selected.size === filtered.length && filtered.length > 0 ? <CheckSquare size={15} color="#c8782a" /> : <Square size={15} />}
          </button>
          <div />
          {[
            { label: 'Product', key: 'name' },
            { label: 'Price', key: 'price' },
            { label: 'Stock', key: 'stock' },
            { label: 'Status', key: null },
            { label: 'Created', key: 'created' },
            { label: 'Actions', key: null },
          ].map(col => (
            <div key={col.label} onClick={col.key ? () => toggleSort(col.key as typeof sortBy) : undefined}
              style={{ fontSize: '11px', color: '#444', fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase', cursor: col.key ? 'pointer' : 'default', userSelect: 'none' }}>
              {col.label} {col.key && sortBy === col.key && (sortDir === 'asc' ? '↑' : '↓')}
            </div>
          ))}
        </div>

        {/* Rows */}
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#444', fontSize: '13px' }}>Loading products…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <Package size={32} style={{ color: '#222', margin: '0 auto 12px', display: 'block' }} />
            <div style={{ color: '#444', fontSize: '13px' }}>No products found</div>
          </div>
        ) : filtered.map(p => {
          const primaryImage = p.product_images?.find(i => i.is_primary)?.url ?? p.product_images?.[0]?.url;
          const isLowStock = p.stock > 0 && p.stock <= 5;
          const isOutOfStock = p.stock === 0;
          const isChecked = selected.has(p.id);
          return (
            <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '40px 60px 1fr 100px 100px 80px 100px 80px', gap: '0', borderBottom: '1px solid #0f0f0f', padding: '12px 16px', alignItems: 'center', background: isChecked ? 'rgba(200,120,42,0.04)' : 'transparent', transition: 'background 0.15s' }}
              onMouseEnter={e => { if (!isChecked) (e.currentTarget as HTMLElement).style.background = '#0d0d0d'; }}
              onMouseLeave={e => { if (!isChecked) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>

              <button onClick={() => toggleSelect(p.id)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                {isChecked ? <CheckSquare size={15} color="#c8782a" /> : <Square size={15} />}
              </button>

              {/* Image */}
              <div style={{ width: '40px', height: '40px', background: '#111', borderRadius: '8px', overflow: 'hidden' }}>
                {primaryImage ? <img src={primaryImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={16} style={{ color: '#333', margin: '12px' }} />}
              </div>

              {/* Name */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#fff' }}>{p.name}</span>
                  {p.is_featured && <span style={{ fontSize: '9px', background: 'rgba(200,120,42,0.15)', color: '#c8782a', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>FEATURED</span>}
                  {p.badge && <span style={{ fontSize: '9px', background: '#111', color: '#666', padding: '1px 5px', borderRadius: '3px', border: '1px solid #222' }}>{p.badge}</span>}
                </div>
                <div style={{ fontSize: '11px', color: '#444' }}>{p.brand} · {p.category}</div>
              </div>

              {/* Price */}
              <div style={{ fontSize: '13px', color: '#c8782a', fontWeight: 600 }}>₦{p.price.toLocaleString()}</div>

              {/* Stock */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {(isLowStock || isOutOfStock) && <AlertTriangle size={12} color={isOutOfStock ? '#ef4444' : '#f59e0b'} />}
                <span style={{ fontSize: '13px', color: isOutOfStock ? '#ef4444' : isLowStock ? '#f59e0b' : '#888' }}>
                  {p.stock}
                </span>
              </div>

              {/* Status */}
              <button onClick={() => handleToggleActive(p.id, p.is_active)} style={{
                padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                border: `1px solid ${p.is_active ? 'rgba(34,197,94,0.3)' : '#1d1d1d'}`,
                background: p.is_active ? 'rgba(34,197,94,0.08)' : '#0d0d0d',
                color: p.is_active ? '#22c55e' : '#444',
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
                {p.is_active ? '● Active' : '○ Draft'}
              </button>

              {/* Created */}
              <div style={{ fontSize: '11px', color: '#444' }}>{new Date(p.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '4px' }}>
                <Link href={`/shop/${p.slug}`} target="_blank" title="View in store" style={{ display: 'flex', alignItems: 'center', background: '#111', border: '1px solid #1d1d1d', color: '#555', padding: '6px', borderRadius: '6px' }}>
                  <Eye size={13} />
                </Link>
                <Link href={`/admin/products/${p.id}`} title="Edit product" style={{ display: 'flex', alignItems: 'center', background: '#111', border: '1px solid #1d1d1d', color: '#555', padding: '6px', borderRadius: '6px' }}>
                  <Edit2 size={13} />
                </Link>
                <button onClick={() => handleToggleActive(p.id, p.is_active)} title={p.is_active ? 'Set to draft' : 'Activate'} style={{ display: 'flex', alignItems: 'center', background: '#111', border: '1px solid #1d1d1d', color: '#555', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>
                  {p.is_active ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '12px', fontSize: '12px', color: '#333', textAlign: 'right' }}>
        Showing {filtered.length} of {products.length} products
      </div>
    </div>
  );
}
