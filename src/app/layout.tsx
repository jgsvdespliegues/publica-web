import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NextAuthProvider from '@/components/providers/next-auth-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pública - Tu tienda digital',
  description: 'Crea tu tienda digital para compartir en WhatsApp y redes sociales',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  )
}