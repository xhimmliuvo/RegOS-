import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { NetworkProvider, OfflineBanner } from '@/context/NetworkContext';
import Header from '@/components/layout/Header';
import MobileNav from '@/components/layout/MobileNav';
import TermsModal from '@/components/ui/TermsModal';
import InstallPrompt from '@/components/ui/InstallPrompt';

export const metadata = {
    title: 'RegOS - Registration Platform',
    description: 'Mobile-first Registration & Event Hosting Platform. Create, manage, and monetize registrations, events, and appointments.',
    keywords: 'registration, events, appointments, platform, forms, hosting',
    manifest: '/manifest.json',
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#0f0d1a' },
    ],
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
        viewportFit: 'cover',
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'RegOS',
    },
    openGraph: {
        title: 'RegOS - Registration Platform',
        description: 'Mobile-first Registration & Event Hosting Platform',
        type: 'website',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/icons/icon-192x192.png" />
                <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="mobile-web-app-capable" content="yes" />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('regos_theme');
                  if (theme) {
                    document.documentElement.setAttribute('data-theme', theme);
                  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch (e) {}
              })();
            `,
                    }}
                />
            </head>
            <body>
                <NetworkProvider>
                    <ThemeProvider>
                        <AuthProvider>
                            <ToastProvider>
                                <OfflineBanner />
                                <div className="app-shell">
                                    <Header />
                                    <main className="app-content">
                                        {children}
                                    </main>
                                    <MobileNav />
                                    <TermsModal />
                                    <InstallPrompt />
                                </div>
                            </ToastProvider>
                        </AuthProvider>
                    </ThemeProvider>
                </NetworkProvider>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(error) {
                    console.log('ServiceWorker registration failed:', error);
                  });
                });
              }
            `,
                    }}
                />
            </body>
        </html>
    );
}
