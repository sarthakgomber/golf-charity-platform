'use client'

import { useState, useEffect } from 'react'

// ── DRAW ENGINE ──────────────────────────────────────────────────────────────
function runDraw(mode = 'random', userScores = []) {
  if (mode === 'random') {
    const nums = []
    while (nums.length < 5) {
      const n = Math.floor(Math.random() * 45) + 1
      if (!nums.includes(n)) nums.push(n)
    }
    return nums.sort((a, b) => a - b)
  }

  // Algorithmic: weighted by frequency of user scores
  const freq = {}
  userScores.forEach((s) => { freq[s] = (freq[s] || 0) + 1 })
  const pool = []
  for (let n = 1; n <= 45; n++) {
    const weight = freq[n] ? Math.max(1, 5 - freq[n]) : 3 // less frequent = higher weight
    for (let i = 0; i < weight; i++) pool.push(n)
  }
  const nums = []
  while (nums.length < 5) {
    const pick = pool[Math.floor(Math.random() * pool.length)]
    if (!nums.includes(pick)) nums.push(pick)
  }
  return nums.sort((a, b) => a - b)
}

function checkMatch(userNums, drawNums) {
  return userNums.filter((n) => drawNums.includes(n)).length
}

// ── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_USERS = [
  { id: 1, name: 'James Thornton', email: 'james@example.com', plan: 'yearly', status: 'active', scores: [32, 28, 35, 30, 27], charity: 'Cancer Research UK', joined: '2025-01-10' },
  { id: 2, name: 'Sophie Marsh', email: 'sophie@example.com', plan: 'monthly', status: 'active', scores: [41, 38, 43, 39, 40], charity: "St. Jude's Hospital", joined: '2025-02-04' },
  { id: 3, name: 'Raj Patel', email: 'raj@example.com', plan: 'monthly', status: 'lapsed', scores: [22, 19, 25, 21, 23], charity: 'WWF', joined: '2025-01-22' },
  { id: 4, name: 'Emma Clarke', email: 'emma@example.com', plan: 'yearly', status: 'active', scores: [36, 34, 38, 37, 35], charity: 'Doctors Without Borders', joined: '2025-03-01' },
]

const MOCK_CHARITIES = [
  { id: 1, name: "St. Jude's Hospital", category: 'Health', total: '£4,820', members: 124 },
  { id: 2, name: 'WWF', category: 'Environment', total: '£3,210', members: 89 },
  { id: 3, name: 'Doctors Without Borders', category: 'Humanitarian', total: '£5,650', members: 156 },
  { id: 4, name: 'Cancer Research UK', category: 'Health', total: '£6,100', members: 201 },
]

const MOCK_WINNERS = [
  { id: 1, name: 'Sophie Marsh', match: 4, amount: '£890', status: 'pending', month: 'February 2025' },
  { id: 2, name: 'James Thornton', match: 3, amount: '£220', status: 'paid', month: 'January 2025' },
]

const TABS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'users', label: 'Users', icon: '👥' },
  { id: 'draws', label: 'Draws', icon: '🎯' },
  { id: 'charities', label: 'Charities', icon: '❤️' },
  { id: 'winners', label: 'Winners', icon: '🏆' },
]

// ── COMPONENT ────────────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [charities, setCharities] = useState([])
  const [winners, setWinners] = useState([])

  // Draw state
  const [drawMode, setDrawMode] = useState('random')
  const [drawResult, setDrawResult] = useState(null)
  const [drawSimulation, setDrawSimulation] = useState(null)
  const [drawLoading, setDrawLoading] = useState(false)
  const [drawPublished, setDrawPublished] = useState(false)

  // User editing
  const [editingUser, setEditingUser] = useState(null)
  const [editScore, setEditScore] = useState({ value: '', date: '' })

  useEffect(() => {
    setTimeout(() => {
      setUsers(MOCK_USERS)
      setCharities(MOCK_CHARITIES)
      setWinners(MOCK_WINNERS)
      setLoading(false)
    }, 900)
  }, [])

  // ── DRAW LOGIC ─────────────────────────────────────────────
  const handleSimulate = () => {
    setDrawLoading(true)
    setDrawPublished(false)
    setTimeout(() => {
      const allScores = users.flatMap((u) => u.scores)
      const nums = runDraw(drawMode, allScores)
      // Check who wins what
      const results = users
        .filter((u) => u.status === 'active')
        .map((u) => ({ ...u, matches: checkMatch(u.scores.slice(0, 5), nums) }))
        .filter((u) => u.matches >= 3)
        .sort((a, b) => b.matches - a.matches)

      setDrawSimulation({ numbers: nums, matches: results })
      setDrawLoading(false)
    }, 1500)
  }

  const handlePublishDraw = () => {
    if (!drawSimulation) return
    setDrawResult(drawSimulation)
    setDrawPublished(true)
    // Add to winners
    const newWinners = drawSimulation.matches.map((u, i) => ({
      id: Date.now() + i,
      name: u.name,
      match: u.matches,
      amount: u.matches === 5 ? '£2,400' : u.matches === 4 ? '£840' : '£300',
      status: 'pending',
      month: 'March 2025',
    }))
    setWinners((prev) => [...newWinners, ...prev])
  }

  // ── SCORE EDIT ──────────────────────────────────────────────
  const handleAddScore = (userId) => {
    const val = parseInt(editScore.value)
    if (!val || val < 1 || val > 45) return
    setUsers((prev) => prev.map((u) => {
      if (u.id !== userId) return u
      const newScores = [val, ...u.scores].slice(0, 5)
      return { ...u, scores: newScores }
    }))
    setEditScore({ value: '', date: '' })
  }

  // ── WINNER VERIFY ───────────────────────────────────────────
  const updateWinnerStatus = (id, status) => {
    setWinners((prev) => prev.map((w) => w.id === id ? { ...w, status } : w))
  }

  const stats = {
    totalUsers: users.length,
    activeSubscriptions: users.filter((u) => u.status === 'active').length,
    totalCharities: charities.length,
    monthlyRevenue: users.filter((u) => u.status === 'active').length * 29.99,
    totalPrizePool: users.filter((u) => u.status === 'active').length * 29.99 * 0.6,
    charityTotal: users.filter((u) => u.status === 'active').length * 29.99 * 0.1,
    pendingWinners: winners.filter((w) => w.status === 'pending').length,
  }

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading admin dashboard…</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <aside style={{
        width: '220px',
        flexShrink: 0,
        background: 'var(--charcoal)',
        borderRight: '1px solid var(--border)',
        padding: '32px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        position: 'sticky',
        top: '68px',
        height: 'calc(100vh - 68px)',
        overflowY: 'auto',
      }}>
        <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px', paddingLeft: '16px' }}>
          Admin Panel
        </p>
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}>
            <span>{tab.icon}</span>
            {tab.label}
            {tab.id === 'winners' && stats.pendingWinners > 0 && (
              <span style={{
                marginLeft: 'auto',
                background: 'rgba(201,168,76,0.15)',
                color: 'var(--gold)',
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '1px 7px',
                borderRadius: '100px',
              }}>{stats.pendingWinners}</span>
            )}
          </button>
        ))}
      </aside>

      {/* ── MAIN ─────────────────────────────────────────────── */}
      <main style={{ flex: 1, padding: '40px 32px', minWidth: 0 }}>

        {/* ── OVERVIEW ──────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, marginBottom: '4px' }}>
              Overview
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '36px' }}>
              Platform performance at a glance — March 2025
            </p>

            <div className="stats-grid" style={{ marginBottom: '36px' }}>
              {[
                { label: 'Total Users', value: stats.totalUsers, icon: '👥', sub: `${stats.activeSubscriptions} active` },
                { label: 'Monthly Revenue', value: `£${stats.monthlyRevenue.toFixed(0)}`, icon: '💷', sub: 'This month' },
                { label: 'Prize Pool', value: `£${stats.totalPrizePool.toFixed(0)}`, icon: '🎯', sub: '40% of revenue' },
                { label: 'Charity Raised', value: `£${stats.charityTotal.toFixed(0)}`, icon: '❤️', sub: '10%+ of revenue' },
              ].map((s) => (
                <div key={s.label} className="stat-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>{s.label}</p>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, lineHeight: 1, marginBottom: '4px' }}>{s.value}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.sub}</p>
                    </div>
                    <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Subscription breakdown */}
            <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>
                User Status Breakdown
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Active', count: users.filter(u => u.status === 'active').length, color: '#22A96E' },
                  { label: 'Lapsed', count: users.filter(u => u.status === 'lapsed').length, color: '#e74c3c' },
                ].map((row) => (
                  <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '70px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{row.label}</div>
                    <div style={{ flex: 1, height: '8px', background: 'var(--surface-2)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${(row.count / users.length) * 100}%`,
                        height: '100%',
                        background: row.color,
                        borderRadius: '4px',
                        transition: 'width 1s ease',
                      }} />
                    </div>
                    <div style={{ width: '30px', fontFamily: "'Playfair Display', serif", fontSize: '0.9rem', fontWeight: 700, textAlign: 'right' }}>{row.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── USERS ─────────────────────────────────────────── */}
        {activeTab === 'users' && (
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, marginBottom: '4px' }}>User Management</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '32px' }}>{users.length} total members</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {users.map((user) => (
                <div key={user.id} className="card" style={{ padding: '24px 28px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--obsidian)', fontWeight: 700, fontSize: '1rem',
                        flexShrink: 0,
                      }}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '2px' }}>{user.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '8px' }}>{user.email}</div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <span className={`badge ${user.status === 'active' ? 'badge-green' : 'badge-red'}`}>{user.status}</span>
                          <span className="badge badge-gray">{user.plan}</span>
                          <span className="badge badge-gold">❤️ {user.charity}</span>
                        </div>
                      </div>
                    </div>

                    {/* Scores */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {user.scores.map((score, idx) => (
                          <div key={idx} className={`score-bubble ${idx === 0 ? 'highlight' : ''}`}
                            style={{ width: '40px', height: '40px', fontSize: '0.9rem' }}>
                            {score}
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                        Last 5 scores (Stableford)
                      </div>

                      {/* Score Edit */}
                      {editingUser === user.id ? (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                          <input
                            type="number"
                            min="1" max="45"
                            value={editScore.value}
                            onChange={(e) => setEditScore({ ...editScore, value: e.target.value })}
                            className="form-input"
                            placeholder="Score (1-45)"
                            style={{ width: '130px', fontSize: '0.8rem', padding: '8px 12px' }}
                          />
                          <button className="btn-primary" style={{ fontSize: '0.75rem', padding: '8px 14px' }}
                            onClick={() => { handleAddScore(user.id); setEditingUser(null) }}>
                            <span>Add</span>
                          </button>
                          <button className="btn-ghost" style={{ fontSize: '0.75rem', padding: '8px 12px' }}
                            onClick={() => setEditingUser(null)}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn-ghost" style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                            onClick={() => setEditingUser(user.id)}>
                            ✏️ Edit Scores
                          </button>
                          <button className="btn-danger" style={{ fontSize: '0.75rem' }}>Remove</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── DRAWS ─────────────────────────────────────────── */}
        {activeTab === 'draws' && (
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, marginBottom: '4px' }}>
              Draw Management
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '32px' }}>
              Configure and run the monthly prize draw
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '28px' }}>
              {/* Config */}
              <div className="card" style={{ padding: '28px' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>
                  Draw Configuration
                </h3>

                <div style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ display: 'block', marginBottom: '10px' }}>Draw Mode</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {['random', 'algorithmic'].map((mode) => (
                      <button key={mode} onClick={() => setDrawMode(mode)}
                        style={{
                          flex: 1, padding: '12px',
                          borderRadius: '8px',
                          border: drawMode === mode ? '1px solid var(--gold)' : '1px solid var(--surface-3)',
                          background: drawMode === mode ? 'rgba(201,168,76,0.08)' : 'var(--surface-2)',
                          color: drawMode === mode ? 'var(--gold)' : 'var(--text-secondary)',
                          cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                          textTransform: 'capitalize', transition: 'all 0.2s',
                        }}>
                        {mode === 'random' ? '🎲 Random' : '⚖️ Algorithmic'}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.5 }}>
                    {drawMode === 'random'
                      ? 'Standard lottery-style random number generation.'
                      : 'Weighted by least-frequent user scores for fairness.'}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}
                    onClick={handleSimulate} disabled={drawLoading}>
                    {drawLoading ? '⏳ Running simulation…' : '🔍 Run Simulation'}
                  </button>

                  {drawSimulation && !drawPublished && (
                    <button className="btn-primary" style={{ width: '100%' }}
                      onClick={handlePublishDraw}>
                      <span>📢 Publish Draw Results</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Result */}
              <div className="card" style={{ padding: '28px' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>
                  {drawPublished ? '✅ Published Results' : drawSimulation ? '🔍 Simulation Preview' : '—  Awaiting Draw'}
                </h3>

                {!drawSimulation && !drawLoading && (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎯</div>
                    <p style={{ fontSize: '0.875rem' }}>Run a simulation to preview this month's draw</p>
                  </div>
                )}

                {drawLoading && (
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div className="spinner" style={{ margin: '0 auto 16px' }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Generating draw numbers…</p>
                  </div>
                )}

                {drawSimulation && !drawLoading && (
                  <>
                    {/* Numbers */}
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '24px' }}>
                      {drawSimulation.numbers.map((n, i) => (
                        <div key={i} style={{
                          width: '48px', height: '48px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))',
                          border: '2px solid var(--gold)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700,
                          color: 'var(--gold)',
                        }}>
                          {n}
                        </div>
                      ))}
                    </div>

                    {/* Matches */}
                    {drawSimulation.matches.length === 0 ? (
                      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', padding: '16px' }}>
                        No winners this draw. Jackpot rolls over.
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {drawSimulation.matches.map((u) => (
                          <div key={u.id} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '12px 14px', background: 'var(--surface-2)', borderRadius: '8px',
                            border: '1px solid var(--border)',
                          }}>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{u.name}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{u.matches}-number match</div>
                            </div>
                            <span className={`badge ${u.matches === 5 ? 'badge-gold' : u.matches === 4 ? 'badge-green' : 'badge-gray'}`}>
                              {u.matches === 5 ? '🏆 Jackpot' : u.matches === 4 ? '4-Match' : '3-Match'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Prize pool breakdown */}
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>
                Current Prize Pool
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
                {[
                  { label: '5-Match (Jackpot)', share: '40%', amount: `£${(stats.totalPrizePool * 0.4).toFixed(0)}`, color: '#C9A84C' },
                  { label: '4-Match', share: '35%', amount: `£${(stats.totalPrizePool * 0.35).toFixed(0)}`, color: '#22A96E' },
                  { label: '3-Match', share: '25%', amount: `£${(stats.totalPrizePool * 0.25).toFixed(0)}`, color: '#3B82F6' },
                ].map((tier) => (
                  <div key={tier.label} style={{
                    padding: '18px 20px', background: 'var(--surface-2)',
                    borderRadius: '10px', border: `1px solid ${tier.color}22`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: tier.color }} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tier.label}</span>
                    </div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: tier.color }}>{tier.amount}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{tier.share} of pool</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── CHARITIES ─────────────────────────────────────── */}
        {activeTab === 'charities' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, marginBottom: '4px' }}>Charity Management</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{charities.length} active charities</p>
              </div>
              <button className="btn-primary" style={{ fontSize: '0.875rem' }}>
                <span>+ Add Charity</span>
              </button>
            </div>

            <div className="card" style={{ overflow: 'hidden' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Charity</th>
                    <th>Category</th>
                    <th>Total Raised</th>
                    <th>Members</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {charities.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{c.name}</div>
                      </td>
                      <td>
                        <span className="badge badge-gold">{c.category}</span>
                      </td>
                      <td>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: 'var(--gold)' }}>{c.total}</span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{c.members}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn-ghost" style={{ fontSize: '0.75rem', padding: '5px 12px' }}>Edit</button>
                          <button className="btn-danger">Remove</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── WINNERS ───────────────────────────────────────── */}
        {activeTab === 'winners' && (
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, marginBottom: '4px' }}>
              Winner Verification
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '32px' }}>
              Review submissions and approve payouts
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {winners.map((w) => (
                <div key={w.id} className="card" style={{ padding: '24px 28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--obsidian)', fontWeight: 700, fontSize: '1rem',
                        flexShrink: 0,
                      }}>{w.name.charAt(0)}</div>
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>{w.name}</div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <span className="badge badge-gold">{w.match}-Number Match</span>
                          <span className="badge badge-gray">{w.month}</span>
                          <span className={`badge ${w.status === 'paid' ? 'badge-green' : 'badge-gray'}`}>
                            {w.status === 'paid' ? '✅ Paid' : '⏳ Pending'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Prize</div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700, color: 'var(--gold)' }}>{w.amount}</div>
                      </div>

                      {w.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn-primary" style={{ fontSize: '0.78rem', padding: '8px 16px' }}
                            onClick={() => updateWinnerStatus(w.id, 'paid')}>
                            <span>Mark Paid</span>
                          </button>
                          <button className="btn-danger"
                            onClick={() => updateWinnerStatus(w.id, 'rejected')}>
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {w.status === 'pending' && (
                    <div style={{
                      marginTop: '16px', padding: '14px 16px',
                      background: 'rgba(201,168,76,0.05)',
                      border: '1px dashed rgba(201,168,76,0.2)',
                      borderRadius: '8px',
                      display: 'flex', alignItems: 'center', gap: '10px',
                    }}>
                      <span style={{ fontSize: '1rem' }}>📎</span>
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: '2px' }}>Proof of scores required</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Winner has been notified to upload a screenshot from their golf platform</div>
                      </div>
                      <button className="btn-ghost" style={{ marginLeft: 'auto', fontSize: '0.75rem', padding: '6px 14px', whiteSpace: 'nowrap' }}>
                        Request Upload
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
