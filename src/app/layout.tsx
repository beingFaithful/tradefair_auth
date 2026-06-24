import { GeistSans, GeistMono } from 'geist/font';
import { Toaster } from 'sonner';
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'oklch(0.08 0.01 70 / 0.95)',
              border: '1px solid oklch(0.15 0.01 70 / 0.5)',
              color: 'oklch(0.96 0.01 70)',
              backdropFilter: 'blur(20px)',
              borderRadius: '1rem',
            },
          }}
        />
      </body>
    </html>
  );
}
