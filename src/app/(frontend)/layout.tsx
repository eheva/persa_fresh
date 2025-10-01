import React from 'react'
import './styles.css'
import { Montserrat } from 'next/font/google'
import NavMenu from './components/server/NavMenuServer'

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
})

export const metadata = {
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className={montserrat.className}>
      <body>
        <NavMenu />
        <main>{children}</main>
      </body>
    </html>
  )
}
