import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Header from '@/components/Header';
import BreakingTicker from '@/components/BreakingTicker';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import CookieBanner from '@/components/CookieBanner';

export const metadata = {
  title: 'Truth Velocity - News That Moves Fast. Facts That Stay True.',
  description: 'Breaking news, in-depth journalism, and multimedia content covering Politics, Business, Tech, Sports, Entertainment and World Affairs.',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'Truth Velocity - Speed of Truth',
    description: 'Breaking news and investigations.',
    locale: 'en_US',
    type: 'website',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <BreakingTicker />
            <main style={{ flexGrow: 1 }}>
              {children}
            </main>
            <Footer />
            <MobileBottomNav />
            <CookieBanner />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
