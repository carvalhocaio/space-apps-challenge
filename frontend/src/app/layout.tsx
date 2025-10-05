import "leaflet/dist/leaflet.css";

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NASA Farm Navigator - RPG Agrícola',
  description: 'Jogo educativo que utiliza dados NASA para ensinar práticas agrícolas sustentáveis',
  keywords: ['NASA', 'agricultura', 'sustentabilidade', 'educação', 'RPG'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
