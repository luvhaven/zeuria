"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Package, Clock, CheckCircle, Search, Mail, Phone, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total: number;
  status: string;
  items: Array<{ name: string; qty: number; storage?: string }>;
  created_at: string;
};

const COLUMNS = [
  { id: 'pending', label: 'Pending', icon: <Clock size={16} /> },
  { id: 'processing', label: 'Processing', icon: <Package size={16} /> },
  { id: 'shipped', label: 'Shipped', icon: <Truck size={16} /> },
  { id: 'delivered', label: 'Delivered', icon: <CheckCircle size={16} /> }
];

export default function FulfillmentBoard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [draggedOrder, setDraggedOrder] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('orders')
      .select('id, order_number, customer_name, customer_email, customer_phone, total, status, items, created_at')
      .in('status', ['pending', 'processing', 'shipped', 'delivered'])
      .order('created_at', { ascending: false });
    
    setOrders(data || []);
    setLoading(false);
  };

  const handleDrop = async (newStatus: string) => {
    if (!draggedOrder) return;
    
    const orderToUpdate = orders.find(o => o.id === draggedOrder);
    if (!orderToUpdate || orderToUpdate.status === newStatus) {
      setDraggedOrder(null);
      return;
    }

    // Optimistic Update
    setOrders(prev => prev.map(o => o.id === draggedOrder ? { ...o, status: newStatus } : o));
    setDraggedOrder(null);

    const supabase = createClient();
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', draggedOrder);

    if (error) {
      toast.error('Failed to update order status');
      loadOrders(); // Revert on failure
    } else {
      toast.success(`Order moved to ${newStatus}`);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (!search) return true;
    const q = search.toLowerCase();
    return o.order_number.toLowerCase().includes(q) || 
           o.customer_name?.toLowerCase().includes(q) || 
           o.customer_email?.toLowerCase().includes(q);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-1px', marginBottom: '4px' }}>Fulfillment Board</h1>
          <p style={{ color: '#555', fontSize: '14px' }}>Drag and drop orders to update their status</p>
        </div>
        
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search orders..." 
            style={{ width: '100%', background: '#0d0d0d', border: '1px solid #1d1d1d', color: '#fff', padding: '10px 12px 10px 36px', borderRadius: '10px', outline: 'none', fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box' }} 
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', flex: 1, overflowX: 'auto', paddingBottom: '20px' }}>
        {COLUMNS.map(column => {
          const columnOrders = filteredOrders.filter(o => o.status === column.id);
          
          return (
            <div 
              key={column.id} 
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(column.id)}
              style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', background: '#080808', border: '1px solid #141414', borderRadius: '16px', overflow: 'hidden' }}
            >
              <div style={{ padding: '16px', borderBottom: '1px solid #141414', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0a0a0a' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#fff', fontSize: '14px' }}>
                  <span style={{ color: '#c8782a' }}>{column.icon}</span>
                  {column.label}
                </div>
                <div style={{ background: '#1d1d1d', color: '#888', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 700 }}>
                  {columnOrders.length}
                </div>
              </div>

              <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {loading ? (
                  <div style={{ textAlign: 'center', color: '#444', fontSize: '13px', padding: '20px' }}>Loading...</div>
                ) : columnOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#333', fontSize: '13px', padding: '40px 20px', border: '1px dashed #1a1a1a', borderRadius: '12px' }}>
                    No orders here
                  </div>
                ) : (
                  <AnimatePresence>
                    {columnOrders.map(order => (
                      <motion.div
                        key={order.id}
                        layoutId={order.id}
                        draggable
                        onDragStart={() => setDraggedOrder(order.id)}
                        onDragEnd={() => setDraggedOrder(null)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ 
                          background: '#0d0d0d', 
                          border: '1px solid #1d1d1d', 
                          borderRadius: '12px', 
                          padding: '16px',
                          cursor: 'grab',
                          boxShadow: draggedOrder === order.id ? '0 8px 24px rgba(0,0,0,0.5)' : 'none',
                          opacity: draggedOrder === order.id ? 0.5 : 1
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#c8782a', fontFamily: 'monospace' }}>
                            {order.order_number}
                          </span>
                          <span style={{ fontSize: '11px', color: '#555' }}>
                            {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '13px', fontWeight: 500, color: '#fff', marginBottom: '4px' }}>{order.customer_name}</div>
                          <div style={{ fontSize: '11px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={10} /> {order.customer_email}</div>
                          {order.customer_phone && (
                            <div style={{ fontSize: '11px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}><Phone size={10} /> {order.customer_phone}</div>
                          )}
                        </div>

                        <div style={{ background: '#111', padding: '8px 12px', borderRadius: '8px', marginBottom: '12px', fontSize: '12px', color: '#888' }}>
                          <div style={{ marginBottom: '4px', color: '#ccc' }}>Items ({order.items.length}):</div>
                          {order.items.map((item, idx) => (
                            <div key={idx} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.qty}x {item.name}
                            </div>
                          ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1a1a1a', paddingTop: '12px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>₦{order.total.toLocaleString()}</span>
                          <button 
                            onClick={() => window.open(`/admin/orders/${order.id}`, '_blank')}
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                          >
                            Details <ChevronRight size={12} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
