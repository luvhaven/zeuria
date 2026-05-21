"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Save, Shield, User, Bell } from 'lucide-react';

export default function AdminSettings() {
  const [profile, setProfile] = useState({ first_name: '', last_name: '', email: '' });
  const [newPw, setNewPw] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: prof } = await supabase.from('profiles').select('first_name, last_name').eq('id', user.id).single();
      setProfile({ first_name: prof?.first_name || '', last_name: prof?.last_name || '', email: user.email || '' });
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('profiles').update({ first_name: profile.first_name, last_name: profile.last_name }).eq('id', user.id);
    if (newPw) await supabase.auth.updateUser({ password: newPw });

    setMsg('Settings saved successfully.');
    setNewPw('');
    setSaving(false);
    setTimeout(() => setMsg(''), 3000);
  };

  const inp = { width: '100%', background: '#111', border: '1px solid #1d1d1d', color: '#fff', padding: '11px 13px', borderRadius: '8px', outline: 'none', fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box' as const };
  const label = { fontSize: '11px', color: '#555', fontWeight: 600 as const, letterSpacing: '0.5px', textTransform: 'uppercase' as const, display: 'block', marginBottom: '5px' };

  return (
    <div style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-1px', marginBottom: '4px' }}>Settings</h1>
        <p style={{ color: '#555', fontSize: '14px' }}>Manage your admin account settings.</p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><User size={16} color="#c8782a" /> Profile</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div><span style={label}>First Name</span><input value={profile.first_name} onChange={e => setProfile(p => ({ ...p, first_name: e.target.value }))} style={inp} /></div>
            <div><span style={label}>Last Name</span><input value={profile.last_name} onChange={e => setProfile(p => ({ ...p, last_name: e.target.value }))} style={inp} /></div>
          </div>
          <div><span style={label}>Email Address</span><input value={profile.email} disabled style={{ ...inp, opacity: 0.5, cursor: 'not-allowed' }} /></div>
        </div>

        <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={16} color="#c8782a" /> Change Password</h2>
          <div><span style={label}>New Password (leave blank to keep current)</span>
            <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="••••••••" style={inp} /></div>
        </div>

        {msg && <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', padding: '12px', fontSize: '13px', color: '#22c55e' }}>{msg}</div>}

        <button type="submit" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', color: '#000', border: 'none', padding: '13px 24px', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: 700, alignSelf: 'flex-start' }}>
          <Save size={15} /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
