import { Geist_Mono } from 'next/font/google'
import { baseMetadata, baseViewport } from './lib/metadata'
import './globals.css'

const mono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

export const metadata = baseMetadata
export const viewport = baseViewport

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${mono.variable} font-mono antialiased`}>
        {children}
      </body>
    </html>
  )
}
