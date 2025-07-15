'use client'
import '@/globals.css'

import {AuthProvider} from '@/context/auth';
import Header from '@/components/header';

export default function Layout() {
  return (
      <html lang="en">
        <body className="min-h-screen bg-gray-100 flex flex-col">
          <Header />
        </body>
      </html>
  )
}
