import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import QueryProvider from '@/providers/QueryProvider'
import ThemeProvider from '@/providers/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'SportManager',
    template: '%s | SportManager',
  },
  description: 'Modern sports club management platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`}>
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
