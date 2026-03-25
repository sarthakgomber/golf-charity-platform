'use client'

import { useState, useEffect } from 'react'

const MOCK_CHARITIES = [
  {
    id: 1,
    name: "St. Jude Children's Research Hospital",
    description: "Finding cures. Saving children's lives. St. Jude leads the way the world understands, treats and defeats childhood cancer and other life-threatening diseases.",
    website: "https://www.stjude.org",
    category: "Health",
    raised: "£4,820",
    members: 124,
    featured: true,
    emoji: "🏥",
  },
  {
    id: 2,
    name: "World Wildlife Fund",
    description: "Protecting endangered species and habitats worldwide. WWF works to stop the degradation of the planet's natural environment and build a future where humans live in harmony with nature.",
    website: "https://www.worldwildlife.org",
    category: "Environment",
    raised: "£3,210",
    members: 89,
    featured: false,
    emoji: "🐼",
  },
  {
    id: 3,
    name: "Doctors Without Borders",
    description: "Medical humanitarian assistance where it's needed most. MSF provides emergency medical care to those affected by conflict, epidemics, and natural disasters.",
    website: "https://www.doctorswithoutborders.org",
    category: "Humanitarian",
    raised: "£5,650",
    members: 156,
    featured: false,
    emoji: "⚕️",
  },
  {
    id: 4,
    name: "Cancer Research UK",
    description: "The world's leading cancer charity, funding research to help prevent, diagnose and treat cancer. Working to accelerate a world where more people survive cancer.",
    website: "https://www.cancerresearchuk.org",
    category: "Health",
    raised: "£6,100",
    members: 201,
    featured: true,
    emoji: "🔬",
  },
  {
    id: 5,
    name: "Rainforest Alliance",
    description: "Working to conserve biodiversity and ensure sustainable livelihoods through transforming land-use practices, business practices, and consumer behavior.",
    website: "https://www.rainforest-alliance.org",
    category: "Environment",
    raised: "£1,980",
    members: 47,
    featured: false,
    emoji: "🌿",
  },
  {
    id: 6,
    name: "Save the Children",
    description: "Fighting for children's rights in the UK and around the world. Ensuring all children have a safe, healthy and happy childhood.",
    website: "https://www.savethechildren.org.uk",
    category: "Children",
    raised: "£2,740",
    members: 73,
    featured: false,
    emoji: "🌟",
  },
]

const CATEGORIES = ['All', 'Health', 'Environment', 'Humanitarian', 'Children']

export default function CharityList() {
  const [charities, setCharities] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    setTimeout(() => {
      setCharities(MOCK_CHARITIES)
      setLoading(false)
    }, 800)
  }, [])

  const filtered = charities.filter((c) => {
    const matchCategory = activeCategory === 'All' || c.category === activeCategory
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading charities…</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero */}
      <section style={{
        padding: '80px 24px 60px',
        background: 'linear-gradient(180deg, rgba(201,168,76,0.04) 0%, transparent 100%)',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `linear-gradient(rgba(201,168,76,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.025) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
        <div className="section-wrapper" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <p style={{
            fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase',
            color: 'var(--gold)', marginBottom: '16px',
          }}>Our Impact</p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 700, marginBottom: '16px',
          }}>
            Charities We Support
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto 36px', lineHeight: 1.7 }}>
            Every subscription contributes to causes that matter. Choose yours at signup — or change it any time.
          </p>

          {/* Total raised callout */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '16px',
            background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: '100px', padding: '10px 24px',
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total raised by members</span>
            <span style={{
              fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: 'var(--gold)',
            }}>£24,500+</span>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section style={{ padding: '32px 24px 0', position: 'sticky', top: '68px', zIndex: 10, background: 'var(--obsidian)', borderBottom: '1px solid var(--border)' }}>
        <div className="section-wrapper">
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', paddingBottom: '20px' }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '360px' }}>
              <svg width="15" height="15" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" viewBox="0 0 24 24"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search charities…"
                className="form-input"
                style={{ paddingLeft: '40px', fontSize: '0.875rem' }}
              />
            </div>

            {/* Category pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: '100px',
                    border: activeCategory === cat ? '1px solid var(--gold)' : '1px solid var(--surface-3)',
                    background: activeCategory === cat ? 'rgba(201,168,76,0.1)' : 'transparent',
                    color: activeCategory === cat ? 'var(--gold)' : 'var(--text-secondary)',
                    fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: '48px 24px 80px' }}>
        <div className="section-wrapper">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>No charities found</p>
              <p style={{ fontSize: '0.875rem' }}>Try adjusting your search or category filter</p>
            </div>
          ) : (
            <div className="charities-grid">
              {filtered.map((charity) => (
                <div key={charity.id} className="card" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  {charity.featured && (
                    <div style={{
                      position: 'absolute', top: '16px', right: '16px',
                      background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                      color: 'var(--obsidian)', fontSize: '0.65rem', fontWeight: 700,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      padding: '3px 10px', borderRadius: '100px',
                    }}>Featured</div>
                  )}

                  <div style={{ padding: '28px 28px 24px' }}>
                    {/* Icon + Category */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                      <div style={{
                        width: '52px', height: '52px', borderRadius: '12px',
                        background: 'var(--surface-2)', border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.5rem', flexShrink: 0,
                      }}>
                        {charity.emoji}
                      </div>
                      <span className="badge badge-gold">{charity.category}</span>
                    </div>

                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 700, marginBottom: '10px', lineHeight: 1.3 }}>
                      {charity.name}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '20px' }}>
                      {charity.description}
                    </p>

                    {/* Stats */}
                    <div style={{
                      display: 'flex', gap: '20px',
                      padding: '14px 0',
                      borderTop: '1px solid var(--border)',
                      borderBottom: '1px solid var(--border)',
                      marginBottom: '20px',
                    }}>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>Raised</div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', fontWeight: 700, color: 'var(--gold)' }}>{charity.raised}</div>
                      </div>
                      <div style={{ width: '1px', background: 'var(--border)' }} />
                      <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>Supporters</div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>{charity.members}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '0 28px 28px', display: 'flex', gap: '10px', marginTop: 'auto' }}>
                    <a href={charity.website} target="_blank" rel="noopener noreferrer"
                      className="btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}>
                      Visit Site
                    </a>
                    <button className="btn-secondary" style={{ flex: 1, fontSize: '0.8rem' }}>
                      Support This
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
