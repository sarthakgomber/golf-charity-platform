import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ overflow: 'hidden' }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        overflow: 'hidden',
      }}>
        {/* Background mesh */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: `
            radial-gradient(ellipse 60% 50% at 20% 50%, rgba(201,168,76,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 80% 60%, rgba(26,107,74,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 80% 80% at 50% 50%, rgba(22,22,26,0.9) 0%, transparent 100%)
          `,
        }} />

        {/* Subtle grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `
            linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />

        {/* Floating orb */}
        <div style={{
          position: 'absolute', top: '15%', right: '10%', zIndex: 0,
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)',
          animation: 'pulse 8s ease-in-out infinite',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
            <div style={{ width: '32px', height: '1px', background: 'var(--gold)' }} />
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
            }}>Subscription Platform · Est. 2025</span>
            <div style={{ width: '32px', height: '1px', background: 'var(--gold)' }} />
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '28px',
            letterSpacing: '-0.01em',
          }}>
            Every Round You Play<br />
            <span style={{
              background: 'linear-gradient(135deg, #E8C97A, #C9A84C, #9A7A2E)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Changes a Life</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            maxWidth: '600px',
            margin: '0 auto 48px',
          }}>
            Track your Stableford scores, compete in monthly prize draws, and direct a portion of every subscription to a charity you believe in.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '64px' }}>
            <Link href="/auth/register" className="btn-primary" style={{ fontSize: '0.95rem', padding: '14px 36px' }}>
              <span>Start Playing for Good</span>
            </Link>
            <Link href="/charities" className="btn-secondary" style={{ fontSize: '0.95rem', padding: '14px 36px' }}>
              Explore Charities
            </Link>
          </div>

          {/* Social proof strip */}
          <div style={{
            display: 'flex',
            gap: '40px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            {[
              { value: '£24,000+', label: 'Donated to Charity' },
              { value: '890+', label: 'Active Members' },
              { value: '15', label: 'Partner Charities' },
              { value: '£18,500', label: 'Prize Pool Awarded' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  color: 'var(--gold)',
                  lineHeight: 1,
                  marginBottom: '4px',
                }}>{stat.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section style={{ padding: '100px 24px', position: 'relative' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px' }}>
              Simple by design
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, marginBottom: '16px' }}>
              How It Works
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto' }}>
              Three steps between you and making a real difference with every game you play.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              {
                num: '01',
                title: 'Subscribe',
                desc: 'Choose a monthly or yearly plan. A fixed portion of every payment goes directly to your chosen charity and the prize pool.',
                icon: (
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                ),
              },
              {
                num: '02',
                title: 'Enter Scores',
                desc: 'Log your latest 5 Stableford scores after every round. Your rolling average powers the draw — the better you play, the more you compete.',
                icon: (
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ),
              },
              {
                num: '03',
                title: 'Win & Give Back',
                desc: 'Monthly draws distribute prizes across 3-match, 4-match, and 5-match tiers. The jackpot rolls over until someone wins.',
                icon: (
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map((step, i) => (
              <div key={step.num} className="card" style={{ padding: '36px 32px', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', top: '20px', right: '24px',
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '4rem',
                  fontWeight: 900,
                  color: 'rgba(201,168,76,0.05)',
                  lineHeight: 1,
                  userSelect: 'none',
                }}>{step.num}</div>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'rgba(201,168,76,0.08)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--gold)',
                  marginBottom: '24px',
                }}>
                  {step.icon}
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.35rem', fontWeight: 700, marginBottom: '12px' }}>
                  {step.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIZE POOL ────────────────────────────────────── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '56px 48px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
              background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
            }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px' }}>
                  Prize Distribution
                </p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 700, marginBottom: '16px', lineHeight: 1.2 }}>
                  Three Ways to Win Every Month
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                  Match 3, 4, or all 5 numbers drawn each month. The jackpot rolls over if no 5-match winner is found — meaning it keeps growing until someone claims it.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: '5-Number Match', share: '40%', tag: 'Jackpot', rollover: true, color: '#C9A84C' },
                  { label: '4-Number Match', share: '35%', tag: 'Fixed', rollover: false, color: '#22A96E' },
                  { label: '3-Number Match', share: '25%', tag: 'Fixed', rollover: false, color: '#3B82F6' },
                ].map((tier) => (
                  <div key={tier.label} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '18px 20px',
                    background: 'var(--surface-2)',
                    borderRadius: '10px',
                    border: `1px solid ${tier.color}22`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '10px', height: '10px', borderRadius: '50%',
                        background: tier.color, boxShadow: `0 0 8px ${tier.color}60`,
                        flexShrink: 0,
                      }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px' }}>{tier.label}</div>
                        {tier.rollover && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Rolls over if unclaimed</div>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.4rem', fontWeight: 700, color: tier.color,
                      }}>{tier.share}</span>
                      <span className="badge" style={{ background: `${tier.color}15`, color: tier.color, border: `1px solid ${tier.color}30` }}>
                        {tier.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CHARITY IMPACT ───────────────────────────────── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px' }}>
              The other reason to play
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700 }}>
              Your Game, Their Future
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {[
              { icon: '❤️', title: 'Choose Your Cause', desc: 'Select from 15+ vetted charities at signup. Change any time.' },
              { icon: '💰', title: '10%+ Goes Direct', desc: 'Minimum 10% of every subscription — you can increase this.' },
              { icon: '🔒', title: 'Transparent Tracking', desc: 'See exactly how much your membership has contributed.' },
              { icon: '🌍', title: 'Global Impact', desc: 'From children\'s health to environmental causes — causes that matter.' },
            ].map((item) => (
              <div key={item.title} style={{
                padding: '28px 24px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '16px' }}>{item.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────── */}
      <section style={{ padding: '80px 24px 100px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            padding: '64px 48px',
            background: 'linear-gradient(135deg, rgba(201,168,76,0.06) 0%, rgba(26,107,74,0.06) 100%)',
            border: '1px solid var(--border-strong)',
            borderRadius: '20px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
              background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
            }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, marginBottom: '16px', lineHeight: 1.2 }}>
              Ready to Play with Purpose?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '36px', lineHeight: 1.7 }}>
              Join 890+ golfers who've made their handicap count for something more.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/auth/register" className="btn-primary" style={{ fontSize: '0.95rem', padding: '14px 36px' }}>
                <span>Join Today</span>
              </Link>
              <Link href="/charities" className="btn-secondary" style={{ fontSize: '0.95rem', padding: '14px 36px' }}>
                View Charities
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
