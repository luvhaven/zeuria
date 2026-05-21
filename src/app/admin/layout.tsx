"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Settings,
  BarChart3, Tag, LogOut, Menu, ChevronRight, Megaphone,
  Warehouse, Shield, Truck
} from 'lucide-react';

const navGroups = [
  {
    label: 'Main',
    items: [
      { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
      { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
      { href: '/admin/fulfillment', label: 'Fulfillment Board', icon: Truck },
      { href: '/admin/customers', label: 'Customers', icon: Users },
      { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { href: '/admin/products', label: 'Products', icon: Package },
      { href: '/admin/inventory', label: 'Inventory', icon: Warehouse },
      { href: '/admin/discounts', label: 'Discounts', icon: Tag },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/admin/content', label: 'Site Content', icon: Megaphone },
      { href: '/admin/audit', label: 'Audit Log', icon: Shield },
      { href: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
];
const navItems = navGroups.flatMap(g => g.items);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/account'); return; }
      const { data: profile } = await supabase.from('profiles').select('first_name, role').eq('id', user.id).single();
      if (!profile || !['admin', 'superadmin'].includes(profile.role)) { router.push('/'); return; }
      setAdminName(profile.first_name || 'Admin');
    };
    load();
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  const isActive = (item: typeof navItems[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const Sidebar = () => (
    <aside style={{
      width: '240px', background: '#050505', borderRight: '1px solid #111',
      height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 200,
      display: 'flex', flexDirection: 'column', padding: '0 0 24px'
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid #111' }}>
        <Link href="/admin" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.8px', color: '#fff' }}>zeuria</span>
          <span style={{ fontSize: '9px', background: '#c8782a', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, letterSpacing: '0.5px' }}>ADMIN</span>
        </Link>
        <div style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>Welcome back, {adminName}</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '0', overflowY: 'auto' }}>
        {navGroups.map(group => (
          <div key={group.label} style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#333', letterSpacing: '1.2px', textTransform: 'uppercase', padding: '0 10px', marginBottom: '4px' }}>{group.label}</div>
            {group.items.map(item => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} style={{
                  display: 'flex', alignItems: 'center', gap: '9px',
                  padding: '9px 10px', borderRadius: '8px', textDecoration: 'none',
                  background: active ? 'rgba(200,120,42,0.12)' : 'transparent',
                  color: active ? '#c8782a' : '#555',
                  fontSize: '13px', fontWeight: active ? 600 : 400,
                  transition: 'all 0.15s',
                  border: active ? '1px solid rgba(200,120,42,0.2)' : '1px solid transparent',
                  marginBottom: '1px',
                }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = '#bbb'; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = '#555'; }}>
                  <item.icon size={15} />
                  {item.label}
                  {active && <ChevronRight size={11} style={{ marginLeft: 'auto' }} />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '0 12px', borderTop: '1px solid #111', paddingTop: '16px', display: 'flex', gap: '8px' }}>
        <Link href="/" target="_blank" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#111', border: '1px solid #1d1d1d', color: '#777', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontSize: '12px' }}>
          View Store
        </Link>
        <button onClick={handleSignOut} style={{ background: '#111', border: '1px solid #1d1d1d', color: '#777', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080808' }}>
      {/* Desktop Sidebar */}
      <div className="admin-sidebar-desktop">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300 }}>
          <div onClick={() => setSidebarOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}><Sidebar /></div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: 0, minHeight: '100vh' }} className="admin-main">
        {/* Mobile Top Bar */}
        <div className="admin-topbar" style={{ display: 'none', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #111', background: '#050505', position: 'sticky', top: 0, zIndex: 100 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' }}>
            <Menu size={20} />
          </button>
          <span style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '-0.5px', marginLeft: '12px', color: '#fff' }}>zeuria admin</span>
        </div>

        <div style={{ padding: '32px' }}>
          {children}
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .admin-sidebar-desktop { display: block !important; }
          .admin-main { margin-left: 240px !important; }
          .admin-topbar { display: none !important; }
        }
        @media (max-width: 767px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-main { margin-left: 0 !important; }
          .admin-topbar { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
