import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { CartProvider } from '@/lib/cart/CartContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'AgroVista: AI-Powered Direct Farmer-to-Consumer Agricultural Marketplace',
  description:
    'Connecting rural Telangana farmers directly with urban consumers. Real mandi price intelligence, AI crop prediction, PJTSAU fertilizer advisory, and fair farm-gate pricing.',
  keywords: [
    'AgroVista',
    'Telangana farmers',
    'Direct farmer marketplace',
    'Bowenpally mandi prices',
    'AI crop advisor',
    'PJTSAU fertilizer guidance',
    'Rythu Bandhu',
    'Organic vegetables Hyderabad',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#fafaf9] text-gray-900 font-sans antialiased selection:bg-agro-200 selection:text-agro-900">
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
