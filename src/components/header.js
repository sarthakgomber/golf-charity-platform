'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/charities', label: 'Charities' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/admin', label: 'Admin' },
  ]

  const isActive = (href) => pathname === href

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: scrolled
          ? 'rgba(10, 10, 11, 0.95)'
          : 'rgba(10, 10, 11, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled
          ? '1px solid rgba(201,168,76,0.15)'
          : '1px solid transparent',
        transition: 'all 0.4s ease',
      }}
    >
      <div className="section-wrapper">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
          
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #C9A84C, #9A7A2E)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A0A0B" strokeWidth="2.5">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.25rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #E8C97A, #C9A84C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Par & Purpose
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'none', alignItems: 'center', gap: '8px' }} className="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: '6px 16px',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  color: isActive(link.href) ? '#C9A84C' : '#9B9488',
                  background: isActive(link.href) ? 'rgba(201,168,76,0.08)' : 'transparent',
                  border: isActive(link.href) ? '1px solid rgba(201,168,76,0.2)' : '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.href)) {
                    e.target.style.color = '#F0ECE3'
                    e.target.style.background = 'rgba(240,236,227,0.04)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.href)) {
                    e.target.style.color = '#9B9488'
                    e.target.style.background = 'transparent'
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div style={{ display: 'none', alignItems: 'center', gap: '12px' }} className="desktop-cta">
            <Link href="/auth/login" className="btn-ghost" style={{ fontSize: '0.85rem' }}>
              Sign In
            </Link>
            <Link href="/auth/register" className="btn-primary" style={{ fontSize: '0.85rem', padding: '9px 22px' }}>
              <span>Get Started</span>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="mobile-menu-btn"
            style={{
              background: 'none',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              color: '#C9A84C',
              transition: 'all 0.2s ease',
            }}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div style={{
          background: 'rgba(10,10,11,0.98)',
          borderTop: '1px solid rgba(201,168,76,0.1)',
          padding: '20px 24px',
          animation: 'fadeIn 0.2s ease',
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '20px' }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: isActive(link.href) ? '#C9A84C' : '#9B9488',
                  background: isActive(link.href) ? 'rgba(201,168,76,0.08)' : 'transparent',
                  borderLeft: isActive(link.href) ? '2px solid #C9A84C' : '2px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid rgba(201,168,76,0.1)', paddingTop: '20px' }}>
            <Link href="/auth/login" className="btn-ghost" style={{ justifyContent: 'center' }} onClick={() => setIsMenuOpen(false)}>
              Sign In
            </Link>
            <Link href="/auth/register" className="btn-primary" style={{ justifyContent: 'center' }} onClick={() => setIsMenuOpen(false)}>
              <span>Get Started</span>
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .desktop-cta { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  )
}
