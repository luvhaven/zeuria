"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight } from 'lucide-react';

function AccountContent() {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const supabase = createClient();

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      router.push(redirect);
      router.refresh();
    } else if (mode === 'register') {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { first_name: firstName, last_name: lastName } }
      });
      if (error) { setError(error.message); setLoading(false); return; }
      setSuccess('Account created! Check your email to confirm your account.');
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/account/reset`,
      });
      if (error) { setError(error.message); setLoading(false); return; }
      setSuccess('Password reset link sent to your email.');
    }
    setLoading(false);
  };

  const inp = {
    width: '100%', background: '#0d0d0d', border: '1px solid #2a2a2a',
    color: '#fff', padding: '14px 14px 14px 44px', borderRadius: '10px',
    outline: 'none', fontSize: '14px', fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-1.2px', color: '#fff' }}>zeuria</span>
            <span style={{ fontSize: '10px', fontWeight: 500, color: '#c8782a', position: 'relative', top: '-6px' }}>®</span>
          </Link>
        </div>

        {/* Card */}
        <div style={{ background: '#090909', border: '1px solid #1d1d1d', borderRadius: '20px', padding: '40px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.8px', marginBottom: '8px', textAlign: 'center' }}>
            {mode === 'login' ? 'Welcome back.' : mode === 'register' ? 'Join Zeuria.' : 'Reset password.'}
          </h1>
          <p style={{ fontSize: '13px', color: '#666', textAlign: 'center', marginBottom: '32px' }}>
            {mode === 'login' ? 'Sign in to manage your orders.' : mode === 'register' ? 'Create your account for a premium experience.' : 'We\'ll send you a reset link.'}
          </p>

          {error && (
            <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '8px', padding: '12px', marginBottom: '20px', fontSize: '13px', color: '#ef4444', textAlign: 'center' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', padding: '12px', marginBottom: '20px', fontSize: '13px', color: '#22c55e', textAlign: 'center' }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mode === 'register' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                  <input value={firstName} onChange={e => setFirstName(e.target.value)} type="text" placeholder="First name" required style={inp} />
                </div>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                  <input value={lastName} onChange={e => setLastName(e.target.value)} type="text" placeholder="Last name" required style={inp} />
                </div>
              </div>
            )}

            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email address" required style={inp} />
            </div>

            {mode !== 'forgot' && (
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                <input value={password} onChange={e => setPassword(e.target.value)} type={showPw ? 'text' : 'password'} placeholder="Password" required style={{ ...inp, paddingRight: '44px' }} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#555', display: 'flex' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            )}

            <button type="submit" disabled={loading} style={{ width: '100%', background: loading ? '#333' : '#fff', color: '#000', border: 'none', borderRadius: '10px', padding: '15px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#666', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {mode === 'login' && (
              <>
                <button onClick={() => setMode('forgot')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px' }}>Forgot password?</button>
                <div>Don&apos;t have an account? <button onClick={() => setMode('register')} style={{ background: 'none', border: 'none', color: '#c8782a', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: '13px' }}>Sign up</button></div>
              </>
            )}
            {mode === 'register' && (
              <div>Already have an account? <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: '#c8782a', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: '13px' }}>Sign in</button></div>
            )}
            {mode === 'forgot' && (
              <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: '#c8782a', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: '13px' }}>Back to sign in</button>
            )}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#444', marginTop: '24px' }}>
          By continuing you agree to our <Link href="/legal/terms" style={{ color: '#666' }}>Terms</Link> and <Link href="/legal/privacy" style={{ color: '#666' }}>Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return <Suspense><AccountContent /></Suspense>;
}
