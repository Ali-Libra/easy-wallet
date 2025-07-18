import '@/globals.css'

import Header from '@/components/header';

export default function Layout() {
  return (
      <html lang="en">
        <body className="min-h-screen bg-slate-50 flex flex-col">
          <Header />
        </body>
      </html>
  )
}
