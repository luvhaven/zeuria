"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, Shield } from 'lucide-react';

type AuditLog = {
  id: string; admin_email: string; action: string; resource: string;
  resource_id?: string; description: string; created_at: string;
};

const ACTION_COLORS: Record<string, string> = {
  CREATE: '#22c55e', UPDATE: '#3b82f6', DELETE: '#ef4444',
  EXPORT: '#a855f7', LOGIN: '#f59e0b', BULK_UPDATE: '#06b6d4', BULK_DELETE: '#ef4444',
};

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [resourceFilter, setResourceFilter] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('admin_audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);
    setLogs(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const resources = [...new Set(logs.map(l => l.resource))];
  const actions = [...new Set(logs.map(l => l.action))];

  const filtered = logs.filter(l => {
    if (actionFilter !== 'all' && l.action !== actionFilter) return false;
    if (resourceFilter !== 'all' && l.resource !== resourceFilter) return false;
    if (search && !l.description.toLowerCase().includes(search.toLowerCase()) && !l.admin_email?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const inp = { background: '#0d0d0d', border: '1px solid #1d1d1d', color: '#fff', padding: '9px 12px', borderRadius: '8px', outline: 'none', fontSize: '13px', fontFamily: 'inherit' };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
        <div style={{ width: '40px', height: '40px', background: 'rgba(200,120,42,0.1)', border: '1px solid rgba(200,120,42,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Shield size={18} color="#c8782a" />
        </div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.6px' }}>Audit Log</h1>
          <div style={{ fontSize: '13px', color: '#555' }}>All admin actions are recorded and cannot be deleted</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search description or admin email…" style={{ ...inp, width: '100%', paddingLeft: '36px', boxSizing: 'border-box' as const }} />
        </div>
        <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} style={{ ...inp, appearance: 'none' }}>
          <option value="all">All Actions</option>
          {actions.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <select value={resourceFilter} onChange={e => setResourceFilter(e.target.value)} style={{ ...inp, appearance: 'none' }}>
          <option value="all">All Resources</option>
          {resources.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: '#0a0a0a', border: '1px solid #141414', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '90px 100px 100px 1fr 130px', padding: '10px 16px', borderBottom: '1px solid #111' }}>
          {['Action', 'Resource', 'Admin', 'Description', 'Time'].map(h => (
            <div key={h} style={{ fontSize: '11px', color: '#444', fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#444', fontSize: '13px' }}>Loading audit log…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '64px', textAlign: 'center' }}>
            <Shield size={32} style={{ color: '#222', margin: '0 auto 12px', display: 'block' }} />
            <div style={{ color: '#444', fontSize: '13px' }}>No audit log entries yet</div>
            <div style={{ color: '#333', fontSize: '12px', marginTop: '4px' }}>Admin actions will appear here</div>
          </div>
        ) : filtered.map(log => (
          <div key={log.id} style={{ display: 'grid', gridTemplateColumns: '90px 100px 100px 1fr 130px', padding: '12px 16px', borderBottom: '1px solid #0d0d0d', alignItems: 'start' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#0d0d0d'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
            <div>
              <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, background: `${ACTION_COLORS[log.action] ?? '#555'}18`, color: ACTION_COLORS[log.action] ?? '#555', letterSpacing: '0.5px' }}>
                {log.action}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>{log.resource}</div>
            <div style={{ fontSize: '11px', color: '#555', wordBreak: 'break-all' }}>{log.admin_email?.split('@')[0]}</div>
            <div style={{ fontSize: '12px', color: '#888', lineHeight: 1.5 }}>{log.description}</div>
            <div style={{ fontSize: '11px', color: '#444' }}>
              {new Date(log.created_at).toLocaleString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#333', textAlign: 'right' }}>
        {filtered.length} entries (last 500)
      </div>
    </div>
  );
}
