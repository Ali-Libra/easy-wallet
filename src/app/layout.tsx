'use client'
import './globals.css'

import { ReactNode } from 'react'

import {AuthProvider} from '@/context/auth';
import Header from '@/components/header';

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
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
