import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Disk Scheduling Simulator',
  description: 'Interactive disk scheduling algorithm visualizer and simulator',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          <Navbar />
          <main className="pt-24 pb-12 px-4">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}