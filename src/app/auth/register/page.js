'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const PLANS = [
  { id: 'monthly', label: 'Monthly', price: '£9.99', period: '/month', savings: null },
  { id: 'yearly', label: 'Yearly', price: '£89.99', period: '/year', savings: 'Save 25%' },
]

const CHARITIES = [
  { id: 1, name: "St. Jude Children's Hospital", category: 'Health' },
  { id: 2, name: 'World Wildlife Fund', category: 'Environment' },
  { id: 3, name: 'Doctors Without Borders', category: 'Humanitarian' },
  { id: 4, name: 'Cancer Research UK', category: 'Health' },
]

export default function Register() {
  const [step, setStep] = useState(1) // 1 = account, 2 = plan + charity
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    plan: 'monthly', charityId: null, charityPercent: 10,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleStep1 = (e) => {
    e.preventDefault()
    setError('')
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.charityId) {
      setError('Please select a charity to support.')
      return
    }
    setLoading(true)
    setError('')
    await new Promise((res) => setTimeout(res, 1400))
    router.push('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      position: 'relative',
    }}>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse 50% 60% at 80% 40%, rgba(26,107,74,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '480px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #C9A84C, #9A7A2E)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A0A0B" strokeWidth="2.5">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.3rem', fontWeight: 700,
              background: 'linear-gradient(135deg, #E8C97A, #C9A84C)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Par & Purpose</span>
          </Link>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
          {[1, 2].map((s) => (
            <div key={s} style={{
              flex: 1, height: '3px', borderRadius: '2px',
              background: s <= step ? 'linear-gradient(90deg, var(--gold), var(--gold-dark))' : 'var(--surface-3)',
              transition: 'background 0.4s ease',
            }} />
          ))}
        </div>

        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '40px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
            background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
          }} />

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: '6px' }}>
                Create Account
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '32px' }}>
                Step 1 of 2 — Your details
              </p>

              {error && <div className="alert-error" style={{ marginBottom: '24px' }}>{error}</div>}

              <form onSubmit={handleStep1} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" id="name" value={formData.name} onChange={handleChange}
                    className="form-input" placeholder="Alex Johnson" required />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" id="email" value={formData.email} onChange={handleChange}
                    className="form-input" placeholder="you@example.com" required />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPassword ? 'text' : 'password'} id="password"
                      value={formData.password} onChange={handleChange}
                      className="form-input" placeholder="Min. 8 characters"
                      style={{ paddingRight: '48px' }} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                      }}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input type="password" id="confirmPassword" value={formData.confirmPassword}
                    onChange={handleChange} className="form-input" placeholder="Repeat your password" required />
                </div>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" required style={{ accentColor: 'var(--gold)', marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    I agree to the{' '}
                    <Link href="/terms" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Privacy Policy</Link>
                  </span>
                </label>

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', marginTop: '8px' }}>
                  <span>Continue →</span>
                </button>
              </form>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <button onClick={() => setStep(1)} style={{
                  background: 'var(--surface-2)', border: '1px solid var(--surface-3)',
                  borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', color: 'var(--text-secondary)',
                }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, lineHeight: 1 }}>
                    Your Plan
                  </h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
                    Step 2 of 2 — Choose plan & charity
                  </p>
                </div>
              </div>

              {error && <div className="alert-error" style={{ marginBottom: '20px' }}>{error}</div>}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                {/* Plan Selector */}
                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '12px' }}>Subscription Plan</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {PLANS.map((plan) => (
                      <button key={plan.id} type="button"
                        onClick={() => setFormData({ ...formData, plan: plan.id })}
                        style={{
                          padding: '16px',
                          borderRadius: '10px',
                          border: formData.plan === plan.id ? '2px solid var(--gold)' : '1px solid var(--surface-3)',
                          background: formData.plan === plan.id ? 'rgba(201,168,76,0.06)' : 'var(--surface-2)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s ease',
                          position: 'relative',
                        }}>
                        {plan.savings && (
                          <span style={{
                            position: 'absolute', top: '-10px', right: '10px',
                            background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                            color: 'var(--obsidian)', fontSize: '0.65rem', fontWeight: 700,
                            padding: '2px 8px', borderRadius: '100px', letterSpacing: '0.05em',
                          }}>{plan.savings}</span>
                        )}
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '4px' }}>{plan.label}</div>
                        <div style={{ color: 'var(--gold)', fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700 }}>
                          {plan.price}<span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>{plan.period}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Charity Selector */}
                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '12px' }}>Choose Your Charity</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {CHARITIES.map((c) => (
                      <button key={c.id} type="button"
                        onClick={() => setFormData({ ...formData, charityId: c.id })}
                        style={{
                          padding: '14px 16px',
                          borderRadius: '10px',
                          border: formData.charityId === c.id ? '1px solid var(--gold)' : '1px solid var(--surface-3)',
                          background: formData.charityId === c.id ? 'rgba(201,168,76,0.06)' : 'var(--surface-2)',
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          transition: 'all 0.2s ease',
                        }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--gold)', fontSize: '1rem',
                          }}>❤️</div>
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{c.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>{c.category}</div>
                          </div>
                        </div>
                        <div style={{
                          width: '18px', height: '18px', borderRadius: '50%',
                          border: formData.charityId === c.id ? '2px solid var(--gold)' : '2px solid var(--surface-3)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: formData.charityId === c.id ? 'var(--gold)' : 'transparent',
                          transition: 'all 0.2s ease', flexShrink: 0,
                        }}>
                          {formData.charityId === c.id && (
                            <svg width="10" height="10" fill="none" stroke="var(--obsidian)" strokeWidth="3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Charity % */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <label className="form-label">Charity Contribution</label>
                    <span style={{ color: 'var(--gold)', fontWeight: 700, fontFamily: "'Playfair Display', serif", fontSize: '1.1rem' }}>
                      {formData.charityPercent}%
                    </span>
                  </div>
                  <input type="range" min="10" max="50" step="5"
                    value={formData.charityPercent}
                    onChange={(e) => setFormData({ ...formData, charityPercent: parseInt(e.target.value) })}
                    style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>10% (minimum)</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>50%</span>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '0.9rem' }}>
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                      Creating your account…
                    </span>
                  ) : (
                    <span>Complete Registration</span>
                  )}
                </button>
              </form>
            </>
          )}

          <div style={{
            marginTop: '28px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(201,168,76,0.1)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <Link href="/auth/login" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 500 }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
