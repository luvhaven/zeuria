"use client";
import { createClient } from '@/lib/supabase/client';

let sessionId: string | null = null;

function getSessionId(): string {
  if (sessionId) return sessionId;
  const stored = sessionStorage.getItem('z_sid');
  if (stored) { sessionId = stored; return sessionId; }
  sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
  sessionStorage.setItem('z_sid', sessionId);
  return sessionId;
}

export async function trackEvent(
  eventType: string,
  pagePath?: string,
  productId?: string,
  metadata?: Record<string, unknown>
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('analytics_events').insert({
      event_type: eventType,
      page_path: pagePath || window.location.pathname,
      product_id: productId || null,
      session_id: getSessionId(),
      user_id: user?.id || null,
      metadata: metadata || {},
    });
  } catch {}
}

export function trackPageView(pagePath?: string) {
  trackEvent('page_view', pagePath);
}

export function trackProductView(productId: string, productName: string) {
  trackEvent('product_view', undefined, productId, { name: productName });
}

export function trackAddToCart(productId: string, productName: string, price: number) {
  trackEvent('add_to_cart', undefined, productId, { name: productName, price });
}

export function trackCheckoutStart(totalAmount: number, itemCount: number) {
  trackEvent('checkout_start', '/checkout', undefined, { total: totalAmount, items: itemCount });
}

export function trackPurchase(orderId: string, total: number) {
  trackEvent('purchase', '/order-success', undefined, { order_id: orderId, total });
}
