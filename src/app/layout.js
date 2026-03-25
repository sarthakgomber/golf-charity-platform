import './globals.css'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import Header from '../components/header'
import Footer from '../components/footer'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600'],
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '600', '700', '900'],
})

export const metadata = {
  title: 'Par & Purpose — Golf Charity Subscription Platform',
  description: 'Track your Stableford scores, win monthly prizes, and support the charities you believe in.',
  openGraph: {
    title: 'Par & Purpose',
    description: 'Play golf. Win prizes. Change lives.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
