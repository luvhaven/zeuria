"use client";

import { useState, useCallback, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, Link as LinkIcon, X, Plus, Save, Loader, Trash2, Copy, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const BRANDS = ['APPLE', 'SAMSUNG', 'GOOGLE', 'HUAWEI', 'XIAOMI'];
const CATEGORIES = ['FLAGSHIP', 'ULTRA', 'PRO', 'PLUS', 'SE', 'FOLD', 'FLIP', 'STANDARD', 'AUDIO', 'WATCH', 'POWER', 'TABLET', 'ACCESSORY'];

type ProductImage = { id?: string; url: string; alt_text?: string; is_primary: boolean; sort_order: number };

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('url');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [specInput, setSpecInput] = useState({ label: '', value: '' });
  const [colorInput, setColorInput] = useState('#000000');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [images, setImages] = useState<ProductImage[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: '', slug: '', brand: 'APPLE', category: 'FLAGSHIP', tagline: '', description: '',
    price: '', compare_price: '', badge: '', stock: '0', is_featured: false, is_active: true,
    colors: [] as string[], storage_options: [] as string[],
    specs: [] as { label: string; value: string }[],
    features: [] as { title: string; body: string }[],
    seo_title: '', seo_description: '', weight_kg: '',
  });

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  // Load product
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data: product, error } = await supabase
        .from('products')
        .select('*, product_images(*)')
        .eq('id', productId)
        .single();

      if (error || !product) { toast.error('Product not found'); router.push('/admin/products'); return; }

      setForm({
        name: product.name ?? '',
        slug: product.slug ?? '',
        brand: product.brand ?? 'APPLE',
        category: product.category ?? 'FLAGSHIP',
        tagline: product.tagline ?? '',
        description: product.description ?? '',
        price: product.price?.toString() ?? '',
        compare_price: product.compare_price?.toString() ?? '',
        badge: product.badge ?? '',
        stock: product.stock?.toString() ?? '0',
        is_featured: product.is_featured ?? false,
        is_active: product.is_active ?? true,
        colors: (product.colors as string[]) ?? [],
        storage_options: (product.storage_options as string[]) ?? [],
        specs: (product.specs as { label: string; value: string }[]) ?? [],
        features: (product.features as { title: string; body: string }[]) ?? [],
        seo_title: product.seo_title ?? '',
        seo_description: product.seo_description ?? '',
        weight_kg: product.weight_kg?.toString() ?? '',
      });

      const imgs = ((product.product_images as ProductImage[]) ?? [])
        .sort((a, b) => a.sort_order - b.sort_order);
      setImages(imgs);
      setLoading(false);
    };
    load();
  }, [productId, router]);

  // Image upload
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setImageUploading(true);
    const supabase = createClient();
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('product-images').upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(path);
        setImages(prev => [...prev, { url: data.publicUrl, is_primary: prev.length === 0, sort_order: prev.length }]);
      }
    }
    setImageUploading(false);
  };

  const addUrlImage = () => {
    if (!imageUrl.trim()) return;
    setImages(prev => [...prev, { url: imageUrl.trim(), is_primary: prev.length === 0, sort_order: prev.length }]);
    setImageUrl('');
  };

  const removeImage = (index: number) => {
    const img = images[index];
    if (img.id) setDeletedImageIds(prev => [...prev, img.id!]);
    const updated = images.filter((_, i) => i !== index).map((img, i) => ({ ...img, sort_order: i, is_primary: i === 0 }));
    setImages(updated);
  };

  const makePrimary = (index: number) => {
    setImages(prev => prev.map((img, i) => ({ ...img, is_primary: i === index })));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  }, []);

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error('Name and price are required'); return; }
    setSaving(true);
    const supabase = createClient();

    const { error } = await supabase.from('products').update({
      name: form.name,
      slug: form.slug,
      brand: form.brand,
      category: form.category,
      tagline: form.tagline || null,
      description: form.description || null,
      price: parseInt(form.price.replace(/[^0-9]/g, '')),
      compare_price: form.compare_price ? parseInt(form.compare_price.replace(/[^0-9]/g, '')) : null,
      badge: form.badge || null,
      stock: parseInt(form.stock) || 0,
      is_featured: form.is_featured,
      is_active: form.is_active,
      colors: form.colors,
      storage_options: form.storage_options,
      specs: form.specs,
      features: form.features,
      seo_title: form.seo_title || form.name,
      seo_description: form.seo_description || form.description,
      weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
      updated_at: new Date().toISOString(),
    }).eq('id', productId);

    if (error) { toast.error(error.message); setSaving(false); return; }

    // Delete removed images
    if (deletedImageIds.length > 0) {
      await supabase.from('product_images').delete().in('id', deletedImageIds);
    }

    // Upsert current images
    for (const img of images) {
      if (img.id) {
        await supabase.from('product_images').update({
          is_primary: img.is_primary, sort_order: img.sort_order,
        }).eq('id', img.id);
      } else {
        await supabase.from('product_images').insert({
          product_id: productId, url: img.url,
          alt_text: form.name, is_primary: img.is_primary, sort_order: img.sort_order,
        });
      }
    }

    toast.success('Product saved!');
    setSaving(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const supabase = createClient();
    await supabase.from('product_images').delete().eq('product_id', productId);
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) { toast.error(error.message); setDeleting(false); return; }
    toast.success('Product deleted');
    router.push('/admin/products');
  };

  const handleDuplicate = async () => {
    const supabase = createClient();
    const newSlug = `${form.slug}-copy-${Date.now().toString(36)}`;
    const { data: newProduct, error } = await supabase.from('products').insert({
      ...form,
      slug: newSlug,
      name: `${form.name} (Copy)`,
      price: parseInt(form.price.replace(/[^0-9]/g, '')),
      compare_price: form.compare_price ? parseInt(form.compare_price.replace(/[^0-9]/g, '')) : null,
      weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
      is_featured: false,
      is_active: false,
    }).select().single();
    if (error || !newProduct) { toast.error('Duplicate failed'); return; }
    // Copy images
    for (const img of images) {
      await supabase.from('product_images').insert({ product_id: newProduct.id, url: img.url, alt_text: img.alt_text, is_primary: img.is_primary, sort_order: img.sort_order });
    }
    toast.success('Product duplicated!');
    router.push(`/admin/products/${newProduct.id}`);
  };

  const inp = { width: '100%', background: '#0d0d0d', border: '1px solid #1d1d1d', color: '#fff', padding: '12px', borderRadius: '8px', outline: 'none', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' as const };
  const lbl = { fontSize: '11px', color: '#555', fontWeight: 600 as const, letterSpacing: '0.6px', textTransform: 'uppercase' as const, display: 'block', marginBottom: '6px' };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '12px', color: '#555' }}>
      <Loader size={20} style={{ animation: 'spin 0.8s linear infinite' }} /> Loading product...
    </div>
  );

  return (
    <div style={{ maxWidth: '960px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px', fontSize: '13px' }}>
        <Link href="/admin/products" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555', textDecoration: 'none' }}>
          <ArrowLeft size={14} /> Products
        </Link>
        <span style={{ color: '#333' }}>/</span>
        <span style={{ color: '#888' }}>{form.name || 'Edit Product'}</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.6px', marginBottom: '4px' }}>{form.name || 'Edit Product'}</h1>
          <div style={{ fontSize: '12px', color: '#444' }}>ID: {productId}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={handleDuplicate} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#111', border: '1px solid #222', color: '#888', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px' }}>
            <Copy size={14} /> Duplicate
          </button>
          <button onClick={() => setConfirmDelete(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px' }}>
            <Trash2 size={14} /> Delete
          </button>
          <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: saving ? '#333' : '#fff', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: 700 }}>
            {saving ? <Loader size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Save size={14} />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Status toggles */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {[
          { key: 'is_active', label: form.is_active ? '● Active' : '○ Draft', active: form.is_active, color: '#22c55e' },
          { key: 'is_featured', label: form.is_featured ? '★ Featured' : '☆ Not Featured', active: form.is_featured, color: '#c8782a' },
        ].map(t => (
          <button key={t.key} onClick={() => set(t.key, !form[t.key as keyof typeof form])} style={{
            padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
            background: t.active ? 'rgba(34,197,94,0.1)' : '#0d0d0d',
            border: t.active ? `1px solid ${t.color}40` : '1px solid #1d1d1d',
            color: t.active ? t.color : '#555',
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Basic Info */}
          <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '22px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Basic Information</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div><span style={lbl}>Product Name *</span><input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. iPhone 17 Pro" style={inp} /></div>
              <div><span style={lbl}>URL Slug</span><input value={form.slug} onChange={e => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} placeholder="iphone-17-pro" style={{ ...inp, fontFamily: 'monospace', color: '#c8782a' }} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div><span style={lbl}>Brand</span>
                  <select value={form.brand} onChange={e => set('brand', e.target.value)} style={{ ...inp, appearance: 'none' }}>
                    {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div><span style={lbl}>Category</span>
                  <select value={form.category} onChange={e => set('category', e.target.value)} style={{ ...inp, appearance: 'none' }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div><span style={lbl}>Tagline</span><input value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="e.g. The future is here." style={inp} /></div>
              <div><span style={lbl}>Description</span><textarea value={form.description} onChange={e => set('description', e.target.value)} rows={5} style={{ ...inp, resize: 'vertical' }} /></div>
              <div><span style={lbl}>Badge</span><input value={form.badge} onChange={e => set('badge', e.target.value)} placeholder="e.g. NEW, HOT, SALE" style={inp} /></div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '22px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Pricing & Inventory</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div><span style={lbl}>Price (₦) *</span><input value={form.price} onChange={e => set('price', e.target.value)} placeholder="1,650,000" style={inp} /></div>
              <div><span style={lbl}>Compare Price (₦)</span><input value={form.compare_price} onChange={e => set('compare_price', e.target.value)} placeholder="1,800,000" style={inp} /></div>
              <div>
                <span style={lbl}>Stock Qty</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button onClick={() => set('stock', Math.max(0, parseInt(form.stock || '0') - 1).toString())} style={{ background: '#1d1d1d', border: '1px solid #2a2a2a', color: '#fff', width: '36px', height: '44px', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>−</button>
                  <input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} style={{ ...inp, textAlign: 'center' }} />
                  <button onClick={() => set('stock', (parseInt(form.stock || '0') + 1).toString())} style={{ background: '#1d1d1d', border: '1px solid #2a2a2a', color: '#fff', width: '36px', height: '44px', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>+</button>
                </div>
                {parseInt(form.stock) <= 5 && parseInt(form.stock) >= 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', color: '#f59e0b', fontSize: '11px' }}>
                    <AlertTriangle size={11} /> {parseInt(form.stock) === 0 ? 'Out of stock' : 'Low stock warning'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Specs */}
          <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '22px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Specifications</div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <input value={specInput.label} onChange={e => setSpecInput(s => ({ ...s, label: e.target.value }))} placeholder="Label (e.g. Display)" style={{ ...inp, flex: 1 }} />
              <input value={specInput.value} onChange={e => setSpecInput(s => ({ ...s, value: e.target.value }))} placeholder={'Value (e.g. 6.3" OLED)'} style={{ ...inp, flex: 1 }} />
              <button onClick={() => { if (!specInput.label || !specInput.value) return; set('specs', [...form.specs, { ...specInput }]); setSpecInput({ label: '', value: '' }); }} style={{ background: '#1d1d1d', border: '1px solid #2a2a2a', color: '#fff', padding: '0 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0 }}><Plus size={15} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {form.specs.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', borderRadius: '6px', padding: '8px 12px', fontSize: '12px' }}>
                  <span style={{ color: '#666' }}>{s.label}</span>
                  <span style={{ color: '#ccc', flex: 1, textAlign: 'right', marginRight: '12px' }}>{s.value}</span>
                  <button onClick={() => set('specs', form.specs.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', display: 'flex' }}><X size={13} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* SEO */}
          <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '22px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>SEO</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div><span style={lbl}>Meta Title <span style={{ color: '#333' }}>({form.seo_title.length}/60)</span></span><input value={form.seo_title} onChange={e => set('seo_title', e.target.value)} maxLength={60} style={inp} /></div>
              <div><span style={lbl}>Meta Description <span style={{ color: '#333' }}>({form.seo_description.length}/160)</span></span><textarea value={form.seo_description} onChange={e => set('seo_description', e.target.value)} rows={3} maxLength={160} style={{ ...inp, resize: 'vertical' }} /></div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Images */}
          <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '22px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Product Images</div>

            {/* Mode toggle */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
              {(['upload', 'url'] as const).map(m => (
                <button key={m} onClick={() => setImageMode(m)} style={{ flex: 1, padding: '7px', borderRadius: '7px', border: imageMode === m ? '1px solid #c8782a' : '1px solid #1d1d1d', background: imageMode === m ? 'rgba(200,120,42,0.1)' : '#111', color: imageMode === m ? '#c8782a' : '#555', cursor: 'pointer', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                  {m === 'upload' ? <><Upload size={12} /> Upload</> : <><LinkIcon size={12} /> URL</>}
                </button>
              ))}
            </div>

            {imageMode === 'upload' ? (
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInputEdit')?.click()}
                style={{ border: `2px dashed ${dragOver ? '#c8782a' : '#222'}`, borderRadius: '10px', padding: '24px', textAlign: 'center', cursor: 'pointer', background: dragOver ? 'rgba(200,120,42,0.04)' : 'transparent', transition: 'all 0.2s' }}>
                {imageUploading ? <div style={{ color: '#c8782a', fontSize: '13px' }}>Uploading…</div> : (
                  <><Upload size={24} style={{ color: '#333', margin: '0 auto 8px' }} /><div style={{ fontSize: '12px', color: '#555' }}>Drop images or click to upload</div></>
                )}
                <input id="fileInputEdit" type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => handleFileUpload(e.target.files)} />
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" onKeyDown={e => e.key === 'Enter' && addUrlImage()} style={{ ...inp, flex: 1 }} />
                <button onClick={addUrlImage} style={{ background: '#1d1d1d', border: '1px solid #2a2a2a', color: '#fff', padding: '0 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0 }}><Plus size={15} /></button>
              </div>
            )}

            {/* Image grid */}
            {images.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '14px' }}>
                {images.map((img, i) => (
                  <div key={i} style={{ position: 'relative', aspectRatio: '1/1', background: '#111', borderRadius: '8px', overflow: 'hidden', border: img.is_primary ? '2px solid #c8782a' : '1px solid #1a1a1a', cursor: 'pointer' }} onClick={() => makePrimary(i)} title="Click to set as primary">
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {img.is_primary && <div style={{ position: 'absolute', bottom: '4px', left: '4px', background: '#c8782a', color: '#000', fontSize: '8px', fontWeight: 700, padding: '2px 5px', borderRadius: '3px' }}>PRIMARY</div>}
                    <button onClick={e => { e.stopPropagation(); removeImage(i); }} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.8)', border: 'none', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={11} /></button>
                  </div>
                ))}
              </div>
            )}
            {images.length > 0 && <div style={{ fontSize: '11px', color: '#444', marginTop: '8px', textAlign: 'center' }}>Click image to set as primary</div>}
          </div>

          {/* Colors */}
          <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '22px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Colors</div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <input type="color" value={colorInput} onChange={e => setColorInput(e.target.value)} style={{ width: '44px', height: '40px', border: 'none', background: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }} />
              <input value={colorInput} onChange={e => setColorInput(e.target.value)} style={{ ...inp, flex: 1 }} />
              <button onClick={() => { if (!form.colors.includes(colorInput)) set('colors', [...form.colors, colorInput]); }} style={{ background: '#1d1d1d', border: '1px solid #2a2a2a', color: '#fff', padding: '0 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0 }}><Plus size={15} /></button>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {form.colors.map((c, i) => (
                <div key={i} onClick={() => set('colors', form.colors.filter((_, idx) => idx !== i))} style={{ width: '30px', height: '30px', borderRadius: '50%', background: c, border: '2px solid #2a2a2a', cursor: 'pointer' }} title={`${c} — click to remove`} />
              ))}
            </div>
          </div>

          {/* Storage Options */}
          <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '22px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Storage Options</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['64GB', '128GB', '256GB', '512GB', '1TB', '2TB'].map(opt => (
                <button key={opt} onClick={() => set('storage_options', form.storage_options.includes(opt) ? form.storage_options.filter(s => s !== opt) : [...form.storage_options, opt])} style={{ padding: '6px 14px', borderRadius: '20px', border: form.storage_options.includes(opt) ? '1px solid #c8782a' : '1px solid #2a2a2a', background: form.storage_options.includes(opt) ? 'rgba(200,120,42,0.12)' : '#111', color: form.storage_options.includes(opt) ? '#c8782a' : '#555', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'inherit' }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: '16px', padding: '32px', maxWidth: '400px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trash2 size={18} color="#ef4444" />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>Delete Product?</div>
                <div style={{ fontSize: '12px', color: '#555' }}>This cannot be undone.</div>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '24px', lineHeight: 1.6 }}>
              You are about to permanently delete <strong style={{ color: '#fff' }}>{form.name}</strong> and all its images.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setConfirmDelete(false)} style={{ flex: 1, background: '#111', border: '1px solid #222', color: '#888', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px' }}>Cancel</button>
              <button onClick={handleDelete} disabled={deleting} style={{ flex: 1, background: '#ef4444', border: 'none', color: '#fff', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: 700 }}>
                {deleting ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
