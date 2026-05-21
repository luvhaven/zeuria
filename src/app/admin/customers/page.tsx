"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, Users } from 'lucide-react';

type Customer = {
  id: string; first_name: string; last_name: string;
  role: string; created_at: string;
  email?: string; order_count?: number; total_spent?: number;
};

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: profiles } = await supabase.from('profiles').select('*').eq('role', 'customer').order('created_at', { ascending: false });
      setCustomers(profiles || []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = customers.filter(c =>
    `${c.first_name} ${c.last_name}`.toLowerCase().includes(query.toLowerCase())
  );

  const tdStyle = { padding: '14px 12px', fontSize: '13px', color: '#ccc', borderBottom: '1px solid #0f0f0f' };
  const thStyle = { padding: '10px 12px', fontSize: '11px', color: '#555', fontWeight: 600 as const, letterSpacing: '0.5px', textTransform: 'uppercase' as const, textAlign: 'left' as const, borderBottom: '1px solid #1a1a1a' };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-1px', marginBottom: '4px' }}>Customers</h1>
        <p style={{ color: '#555', fontSize: '14px' }}>{customers.length} registered customers</p>
      </div>

      <div style={{ position: 'relative', maxWidth: '400px', marginBottom: '24px' }}>
        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search customers..." style={{ width: '100%', background: '#0d0d0d', border: '1px solid #1d1d1d', color: '#fff', padding: '12px 12px 12px 42px', borderRadius: '10px', outline: 'none', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' as const }} />
      </div>

      <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#444' }}>Loading customers...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '80px', textAlign: 'center' }}>
            <Users size={48} style={{ color: '#222', margin: '0 auto 16px' }} />
            <p style={{ color: '#555' }}>No customers yet.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>{['Name', 'Role', 'Joined'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1d1d1d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#c8782a', flexShrink: 0 }}>
                        {(c.first_name?.[0] || '?').toUpperCase()}
                      </div>
                      <div>
                        <div style={{ color: '#fff', fontWeight: 500 }}>{c.first_name} {c.last_name}</div>
                        <div style={{ fontSize: '11px', color: '#555' }}>ID: {c.id.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td style={tdStyle}><span style={{ background: '#181818', border: '1px solid #222', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', color: '#888', textTransform: 'capitalize' }}>{c.role}</span></td>
                  <td style={{ ...tdStyle, color: '#555', fontSize: '12px' }}>{new Date(c.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
