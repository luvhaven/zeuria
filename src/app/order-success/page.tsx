"use client";

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import { Suspense, useEffect } from 'react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ref = searchParams.get('ref');

  useEffect(() => {
    if (!ref) {
      router.replace('/shop');
    }
  }, [ref, router]);

  if (!ref) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ maxWidth: '520px', width: '100%', textAlign: 'center' }}>
        {/* Animated Check */}
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', animation: 'pulse 2s infinite' }}>
          <CheckCircle size={40} color="#22c55e" strokeWidth={1.5} />
        </div>

        <div style={{ fontSize: '11px', color: '#c8782a', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>Order Confirmed</div>
        <h1 style={{ fontSize: '40px', fontWeight: 700, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '16px' }}>Thank you.</h1>
        <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.6, marginBottom: '32px' }}>
          Your order <strong style={{ color: '#c8782a' }}>{ref}</strong> has been confirmed and will be delivered within <strong style={{ color: '#ccc' }}>24–72 hours</strong>. A confirmation email is on its way.
        </p>

        <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: <Package size={16} />, title: 'Packed & Insured', body: 'Your device is being prepared and insured for transit.' },
              { icon: <CheckCircle size={16} />, title: '24–72hr Delivery', body: 'Tracked & signature-required delivery to your address.' },
            ].map(item => (
              <div key={item.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', textAlign: 'left' }}>
                <div style={{ color: '#c8782a', marginTop: '1px', flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: '#555' }}>{item.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/account/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', color: '#000', padding: '14px 24px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 700, flex: "1 1 auto", justifyContent: "center" }}>
            Track Orders <ArrowRight size={14} />
          </Link>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#111', color: '#888', border: '1px solid #222', padding: '14px 24px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', flex: "1 1 auto", justifyContent: "center" }}>
            <Home size={14} /> Home
          </Link>
        </div>

        <style>{`@keyframes pulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.9; } }`}</style>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return <Suspense><OrderSuccessContent /></Suspense>;
}
