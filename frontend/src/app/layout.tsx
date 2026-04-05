import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'TaskFlow — Task Management',
  description: 'Manage your tasks efficiently with TaskFlow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#e2e8f0',
              border: '1px solid #334155',
              borderRadius: '10px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#0ea5e9', secondary: '#0f172a' },
              duration: 3000,
            },
            error: {
              iconTheme: { primary: '#f87171', secondary: '#0f172a' },
              duration: 4000,
            },
          }}
        />
      </body>
    </html>
  );
}
