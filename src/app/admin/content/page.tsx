"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Save, Upload, Link as LinkIcon, Globe, Megaphone, Navigation } from 'lucide-react';

type Settings = Record<string, string>;

export default function AdminContent() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [logoMode, setLogoMode] = useState<'url' | 'upload'>('url');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('site_settings').select('key, value');
      const map: Settings = {};
      (data || []).forEach(({ key, value }) => { if (value !== null) map[key] = value; });
      setSettings(map);
      setLoading(false);
    };
    load();
  }, []);

  const set = (key: string, value: string) => setSettings(s => ({ ...s, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    await Promise.all(
      Object.entries(settings).map(([key, value]) =>
        supabase.from('site_settings').upsert({ key, value }, { onConflict: 'key' })
      )
    );
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split('.').pop();
    const path = `logo-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('brand-assets').upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from('brand-assets').getPublicUrl(path);
      set('logo_url', data.publicUrl);
    }
    setUploading(false);
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const supabase = createClient();
    const path = `favicon-${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('brand-assets').upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from('brand-assets').getPublicUrl(path);
      set('favicon_url', data.publicUrl);
    }
    setUploading(false);
  };

  const inp = { width: '100%', background: '#111', border: '1px solid #1d1d1d', color: '#fff', padding: '11px 13px', borderRadius: '8px', outline: 'none', fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box' as const };
  const label = { fontSize: '11px', color: '#555', fontWeight: 600 as const, letterSpacing: '0.5px', textTransform: 'uppercase' as const, display: 'block', marginBottom: '5px' };
  const section = { background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px', marginBottom: '20px' };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}><div style={{ width: '32px', height: '32px', border: '2px solid #222', borderTopColor: '#c8782a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /></div>;

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-1px', marginBottom: '4px' }}>Site Content</h1>
          <p style={{ color: '#555', fontSize: '14px' }}>Manage branding, SEO, and site-wide settings.</p>
        </div>
        <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: saved ? '#22c55e' : '#fff', color: '#000', border: 'none', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: 700, transition: 'background 0.3s' }}>
          <Save size={15} /> {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Branding */}
      <div style={section}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><Globe size={16} color="#c8782a" /> Brand Identity</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div><span style={label}>Site Name</span><input value={settings.site_name || ''} onChange={e => set('site_name', e.target.value)} style={inp} /></div>
          <div><span style={label}>Site Tagline</span><input value={settings.site_tagline || ''} onChange={e => set('site_tagline', e.target.value)} style={inp} /></div>
          <div><span style={label}>Contact Email</span><input value={settings.contact_email || ''} onChange={e => set('contact_email', e.target.value)} style={inp} /></div>
          <div><span style={label}>Contact Phone</span><input value={settings.contact_phone || ''} onChange={e => set('contact_phone', e.target.value)} style={inp} /></div>
          <div><span style={label}>WhatsApp Number</span><input value={settings.whatsapp_number || ''} onChange={e => set('whatsapp_number', e.target.value)} placeholder="+234 800 000 0000" style={inp} /></div>
        </div>

        {/* Logo */}
        <div style={{ marginTop: '20px' }}>
          <span style={label}>Logo</span>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            {(['url', 'upload'] as const).map(m => (
              <button key={m} onClick={() => setLogoMode(m)} style={{ padding: '6px 14px', borderRadius: '6px', border: logoMode === m ? '1px solid #c8782a' : '1px solid #1d1d1d', background: logoMode === m ? 'rgba(200,120,42,0.1)' : '#111', color: logoMode === m ? '#c8782a' : '#555', cursor: 'pointer', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                {m === 'url' ? <><LinkIcon size={12} /> URL</> : <><Upload size={12} /> Upload</>}
              </button>
            ))}
          </div>
          {logoMode === 'url' ? (
            <input value={settings.logo_url || ''} onChange={e => set('logo_url', e.target.value)} placeholder="https://..." style={inp} />
          ) : (
            <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploading} style={{ ...inp, padding: '8px' }} />
          )}
          {settings.logo_url && <img src={settings.logo_url} alt="Logo preview" style={{ height: '40px', marginTop: '10px', objectFit: 'contain' }} />}
        </div>

        {/* Favicon */}
        <div style={{ marginTop: '16px' }}>
          <span style={label}>Favicon</span>
          <input type="file" accept="image/x-icon,image/png,image/svg+xml" onChange={handleFaviconUpload} disabled={uploading} style={{ ...inp, padding: '8px' }} />
          {settings.favicon_url && <img src={settings.favicon_url} alt="Favicon" style={{ width: '32px', height: '32px', marginTop: '10px', objectFit: 'contain' }} />}
        </div>
      </div>

      {/* Announcement Bar */}
      <div style={section}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Megaphone size={16} color="#c8782a" /> Announcement Bar</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div><span style={label}>Message</span><input value={settings.announcement_bar || ''} onChange={e => set('announcement_bar', e.target.value)} placeholder="Free delivery on all orders above ₦500,000" style={inp} /></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => set('announcement_active', settings.announcement_active === 'true' ? 'false' : 'true')} style={{ width: '44px', height: '24px', borderRadius: '12px', border: 'none', background: settings.announcement_active === 'true' ? '#c8782a' : '#2a2a2a', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', left: settings.announcement_active === 'true' ? '23px' : '3px', transition: 'left 0.2s' }} />
            </button>
            <span style={{ fontSize: '13px', color: '#666' }}>Show announcement bar on storefront</span>
          </div>
        </div>
      </div>

      {/* SEO */}
      <div style={section}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Global SEO</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div><span style={label}>Default OG Image URL</span><input value={settings.og_image_url || ''} onChange={e => set('og_image_url', e.target.value)} placeholder="https://..." style={inp} /></div>
        </div>
      </div>

      {/* Social */}
      <div style={section}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Social Links</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div><span style={label}>Instagram URL</span><input value={settings.instagram_url || ''} onChange={e => set('instagram_url', e.target.value)} placeholder="https://instagram.com/zeuria" style={inp} /></div>
          <div><span style={label}>Twitter/X URL</span><input value={settings.twitter_url || ''} onChange={e => set('twitter_url', e.target.value)} placeholder="https://x.com/zeuria" style={inp} /></div>
        </div>
      </div>

      {/* Paystack */}
      <div style={section}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Payment (Paystack)</h2>
        <div><span style={label}>Paystack Public Key</span><input value={settings.paystack_public_key || ''} onChange={e => set('paystack_public_key', e.target.value)} placeholder="pk_live_..." style={{ ...inp, fontFamily: 'monospace' }} /></div>
        <p style={{ fontSize: '12px', color: '#444', marginTop: '8px' }}>Get your key at <a href="https://dashboard.paystack.com/#/settings/developers" target="_blank" rel="noreferrer" style={{ color: '#c8782a' }}>dashboard.paystack.com</a></p>
      </div>
    </div>
  );
}
