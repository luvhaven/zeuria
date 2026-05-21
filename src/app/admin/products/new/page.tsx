"use client";

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, Link as LinkIcon, X, Plus, Save, Loader } from 'lucide-react';

const BRANDS = ['APPLE', 'SAMSUNG', 'GOOGLE', 'HUAWEI', 'XIAOMI'];
const CATEGORIES = ['FLAGSHIP', 'ULTRA', 'PRO', 'PLUS', 'SE', 'FOLD', 'FLIP', 'STANDARD', 'AUDIO', 'WATCH', 'POWER', 'TABLET', 'ACCESSORY'];

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('url');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [specInput, setSpecInput] = useState({ label: '', value: '' });
  const [colorInput, setColorInput] = useState('#000000');
  const [dragOver, setDragOver] = useState(false);

  const [form, setForm] = useState({
    name: '', brand: 'APPLE', category: 'FLAGSHIP', tagline: '', description: '',
    price: '', compare_price: '', badge: '', stock: '0', is_featured: false,
    colors: [] as string[], storage_options: ['128GB', '256GB', '512GB'],
    specs: [] as { label: string; value: string }[], features: [] as { title: string; body: string }[],
    seo_title: '', seo_description: '', weight_kg: '',
  });

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const generateSlug = (name: string) =>
    name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setImageUploading(true);
    const supabase = createClient();
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('product-images').upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(path);
        urls.push(data.publicUrl);
      }
    }
    setUploadedImages(prev => [...prev, ...urls]);
    setImageUploading(false);
  };

  const addUrlImage = () => {
    if (!imageUrl.trim()) return;
    setUploadedImages(prev => [...prev, imageUrl.trim()]);
    setImageUrl('');
  };

  const removeImage = (i: number) => setUploadedImages(prev => prev.filter((_, idx) => idx !== i));

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  }, []);

  const addSpec = () => {
    if (!specInput.label || !specInput.value) return;
    set('specs', [...form.specs, { ...specInput }]);
    setSpecInput({ label: '', value: '' });
  };

  const addColor = () => {
    if (!form.colors.includes(colorInput)) set('colors', [...form.colors, colorInput]);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || uploadedImages.length === 0) {
      setError('Please fill in name, price and add at least one image.');
      return;
    }
    setSaving(true);
    setError('');
    const supabase = createClient();
    const slug = generateSlug(form.name);

    const { data: product, error: err } = await supabase.from('products').insert({
      slug,
      name: form.name,
      brand: form.brand,
      category: form.category,
      tagline: form.tagline || null,
      description: form.description || null,
      price: parseInt(form.price.replace(/[^0-9]/g, '')),
      compare_price: form.compare_price ? parseInt(form.compare_price.replace(/[^0-9]/g, '')) : null,
      badge: form.badge || null,
      stock: parseInt(form.stock) || 0,
      is_featured: form.is_featured,
      colors: form.colors,
      storage_options: form.storage_options,
      specs: form.specs,
      features: form.features,
      seo_title: form.seo_title || form.name,
      seo_description: form.seo_description || form.description,
      weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
    }).select().single();

    if (err) { setError(err.message); setSaving(false); return; }

    // Insert images
    if (product) {
      await supabase.from('product_images').insert(
        uploadedImages.map((url, i) => ({
          product_id: product.id,
          url,
          alt_text: form.name,
          is_primary: i === 0,
          sort_order: i,
        }))
      );
    }

    router.push('/admin/products');
  };

  const inp = { width: '100%', background: '#0d0d0d', border: '1px solid #1d1d1d', color: '#fff', padding: '12px', borderRadius: '8px', outline: 'none', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' as const };
  const label = { fontSize: '12px', color: '#666', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' as const, display: 'block', marginBottom: '6px' };

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <Link href="/admin/products" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555', textDecoration: 'none', fontSize: '14px' }}>
          <ArrowLeft size={16} /> Products
        </Link>
        <span style={{ color: '#333' }}>/</span>
        <span style={{ color: '#fff', fontSize: '14px' }}>New Product</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.8px' }}>Add Product</h1>
        <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: saving ? '#333' : '#fff', color: '#000', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: 700 }}>
          {saving ? <Loader size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save Product'}
        </button>
      </div>

      {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Basic Info */}
          <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px', color: '#ccc' }}>Basic Information</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div><span style={label}>Product Name *</span><input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. iPhone 17 Pro" style={inp} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><span style={label}>Brand *</span>
                  <select value={form.brand} onChange={e => set('brand', e.target.value)} style={{ ...inp, appearance: 'none' }}>
                    {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div><span style={label}>Category *</span>
                  <select value={form.category} onChange={e => set('category', e.target.value)} style={{ ...inp, appearance: 'none' }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div><span style={label}>Tagline</span><input value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="e.g. The future is here." style={inp} /></div>
              <div><span style={label}>Description</span><textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4} placeholder="Full product description..." style={{ ...inp, resize: 'vertical' as const }} /></div>
              <div><span style={label}>Badge (optional)</span><input value={form.badge} onChange={e => set('badge', e.target.value)} placeholder="e.g. NEW, HOT, LEICA" style={inp} /></div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px', color: '#ccc' }}>Pricing & Stock</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div><span style={label}>Price (₦) *</span><input value={form.price} onChange={e => set('price', e.target.value)} placeholder="1,650,000" style={inp} /></div>
              <div><span style={label}>Compare Price (₦)</span><input value={form.compare_price} onChange={e => set('compare_price', e.target.value)} placeholder="1,800,000" style={inp} /></div>
              <div><span style={label}>Stock Qty *</span><input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="10" style={inp} /></div>
            </div>
          </div>

          {/* Specs */}
          <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px', color: '#ccc' }}>Specifications</h2>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input value={specInput.label} onChange={e => setSpecInput(s => ({ ...s, label: e.target.value }))} placeholder="e.g. Display" style={{ ...inp, flex: 1 }} />
              <input value={specInput.value} onChange={e => setSpecInput(s => ({ ...s, value: e.target.value }))} placeholder={'e.g. 6.3" OLED'} style={{ ...inp, flex: 1 }} />
              <button onClick={addSpec} style={{ background: '#1d1d1d', border: '1px solid #2d2d2d', color: '#fff', padding: '0 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Plus size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {form.specs.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', borderRadius: '6px', padding: '8px 12px', fontSize: '13px' }}>
                  <span style={{ color: '#888' }}>{s.label}</span>
                  <span style={{ color: '#fff' }}>{s.value}</span>
                  <button onClick={() => set('specs', form.specs.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', display: 'flex' }}><X size={14} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* SEO */}
          <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px', color: '#ccc' }}>SEO</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div><span style={label}>SEO Title</span><input value={form.seo_title} onChange={e => set('seo_title', e.target.value)} placeholder="Defaults to product name" style={inp} /></div>
              <div><span style={label}>SEO Description</span><textarea value={form.seo_description} onChange={e => set('seo_description', e.target.value)} rows={3} placeholder="Meta description for search engines..." style={{ ...inp, resize: 'vertical' as const }} /></div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Images */}
          <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', color: '#ccc' }}>Product Images *</h2>

            {/* Mode Toggle */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {(['upload', 'url'] as const).map(m => (
                <button key={m} onClick={() => setImageMode(m)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: imageMode === m ? '1px solid #c8782a' : '1px solid #1d1d1d', background: imageMode === m ? 'rgba(200,120,42,0.1)' : '#111', color: imageMode === m ? '#c8782a' : '#555', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  {m === 'upload' ? <><Upload size={14} /> Upload File</> : <><LinkIcon size={14} /> Paste URL</>}
                </button>
              ))}
            </div>

            {imageMode === 'upload' ? (
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput')?.click()}
                style={{ border: `2px dashed ${dragOver ? '#c8782a' : '#2a2a2a'}`, borderRadius: '12px', padding: '32px', textAlign: 'center', cursor: 'pointer', background: dragOver ? 'rgba(200,120,42,0.05)' : 'transparent', transition: 'all 0.2s' }}>
                {imageUploading ? (
                  <div style={{ color: '#c8782a', fontSize: '14px' }}>Uploading...</div>
                ) : (
                  <>
                    <Upload size={32} style={{ color: '#444', margin: '0 auto 12px' }} />
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Drop images here or click to upload</div>
                    <div style={{ fontSize: '12px', color: '#444' }}>JPG, PNG, WEBP up to 50MB</div>
                  </>
                )}
                <input id="fileInput" type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => handleFileUpload(e.target.files)} />
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" onKeyDown={e => e.key === 'Enter' && addUrlImage()} style={{ ...inp, flex: 1 }} />
                <button onClick={addUrlImage} style={{ background: '#1d1d1d', border: '1px solid #2d2d2d', color: '#fff', padding: '0 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Plus size={16} /></button>
              </div>
            )}

            {/* Image Previews */}
            {uploadedImages.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '16px' }}>
                {uploadedImages.map((url, i) => (
                  <div key={i} style={{ position: 'relative', aspectRatio: '1/1', background: '#111', borderRadius: '8px', overflow: 'hidden', border: i === 0 ? '2px solid #c8782a' : '1px solid #1d1d1d' }}>
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {i === 0 && <div style={{ position: 'absolute', bottom: '4px', left: '4px', background: '#c8782a', color: '#000', fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>PRIMARY</div>}
                    <button onClick={() => removeImage(i)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={12} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Colors */}
          <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', color: '#ccc' }}>Color Options</h2>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input type="color" value={colorInput} onChange={e => setColorInput(e.target.value)} style={{ width: '48px', height: '40px', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }} />
              <input value={colorInput} onChange={e => setColorInput(e.target.value)} style={{ ...inp, flex: 1 }} />
              <button onClick={addColor} style={{ background: '#1d1d1d', border: '1px solid #2d2d2d', color: '#fff', padding: '0 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Plus size={16} /></button>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {form.colors.map((c, i) => (
                <div key={i} onClick={() => set('colors', form.colors.filter((_, idx) => idx !== i))} style={{ width: '32px', height: '32px', borderRadius: '50%', background: c, border: '2px solid #333', cursor: 'pointer', position: 'relative' }} title={`${c} (click to remove)`} />
              ))}
            </div>
          </div>

          {/* Options */}
          <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', color: '#ccc' }}>Storage Options</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['64GB', '128GB', '256GB', '512GB', '1TB'].map(opt => (
                <button key={opt} onClick={() => set('storage_options', form.storage_options.includes(opt) ? form.storage_options.filter(s => s !== opt) : [...form.storage_options, opt])} style={{ padding: '6px 14px', borderRadius: '20px', border: form.storage_options.includes(opt) ? '1px solid #c8782a' : '1px solid #2a2a2a', background: form.storage_options.includes(opt) ? 'rgba(200,120,42,0.1)' : '#111', color: form.storage_options.includes(opt) ? '#c8782a' : '#666', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Toggle */}
          <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#ccc', marginBottom: '4px' }}>Featured Product</div>
              <div style={{ fontSize: '12px', color: '#555' }}>Show on homepage hero section</div>
            </div>
            <button onClick={() => set('is_featured', !form.is_featured)} style={{ width: '44px', height: '24px', borderRadius: '12px', border: 'none', background: form.is_featured ? '#c8782a' : '#2a2a2a', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', left: form.is_featured ? '23px' : '3px', transition: 'left 0.2s' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
