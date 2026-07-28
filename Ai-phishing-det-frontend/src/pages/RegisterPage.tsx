import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck, Lock, Mail, User as UserIcon, LoaderCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export function RegisterPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setLoading(true)
    try {
      await register(firstName, lastName, email, password)
      navigate('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please check inputs.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0f172a', padding: '20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '460px', padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <div className="brand-mark">
            <ShieldCheck size={22} color="white" />
          </div>
          <span style={{ fontSize: '22px', fontWeight: 700, color: '#f8fafc' }}>PhishShield</span>
          <small style={{ fontFamily: 'IBM Plex Mono', fontSize: '10px', color: '#60a5fa', border: '1px solid #2451a1', padding: '2px 5px', borderRadius: '4px' }}>AI</small>
        </div>

        <h2 style={{ fontSize: '20px', marginBottom: '6px', color: '#f8fafc' }}>Create an account</h2>
        <p style={{ color: '#8292a9', fontSize: '12px', marginBottom: '24px' }}>Get started with AI-driven threat analysis</p>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#7f1d1d33', border: '1px solid #7f1d1d', color: '#fca5a5', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '18px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <label style={{ display: 'grid', gap: '6px', color: '#b7c4d6', fontSize: '11px' }}>
              First Name
              <div style={{ position: 'relative' }}>
                <UserIcon size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  style={{ width: '100%', background: '#0f192b', border: '1px solid #34445d', borderRadius: '8px', color: '#e2e8f0', outline: 'none', padding: '10px 10px 10px 38px', fontSize: '13px' }}
                />
              </div>
            </label>

            <label style={{ display: 'grid', gap: '6px', color: '#b7c4d6', fontSize: '11px' }}>
              Last Name
              <div style={{ position: 'relative' }}>
                <UserIcon size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  style={{ width: '100%', background: '#0f192b', border: '1px solid #34445d', borderRadius: '8px', color: '#e2e8f0', outline: 'none', padding: '10px 10px 10px 38px', fontSize: '13px' }}
                />
              </div>
            </label>
          </div>

          <label style={{ display: 'grid', gap: '6px', color: '#b7c4d6', fontSize: '11px' }}>
            Work Email
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                style={{ width: '100%', background: '#0f192b', border: '1px solid #34445d', borderRadius: '8px', color: '#e2e8f0', outline: 'none', padding: '10px 10px 10px 38px', fontSize: '13px' }}
              />
            </div>
          </label>

          <label style={{ display: 'grid', gap: '6px', color: '#b7c4d6', fontSize: '11px' }}>
            Password (min 8 chars)
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', background: '#0f192b', border: '1px solid #34445d', borderRadius: '8px', color: '#e2e8f0', outline: 'none', padding: '10px 10px 10px 38px', fontSize: '13px' }}
              />
            </div>
          </label>

          <button
            type="submit"
            className="button"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '8px', fontSize: '13px' }}
          >
            {loading ? <LoaderCircle className="spin" size={18} /> : null}
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: '#8292a9' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#60a5fa', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
