'use client'
import './globals.css'

import {AuthProvider} from '@context/auth';
import Header from '@components/header';
export default function Layout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className="min-h-screen bg-gray-100 flex flex-col">
          <Header />
          <main className="flex-grow p-6">
            {children}
          </main>
        </body>
      </html>
    </AuthProvider>
  )
}
