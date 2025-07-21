'use client'

import { ThemeProvider } from './theme-provider'
import { Toaster } from './ui/sonner'
import { AppHeader } from '@/components/app-header'
import React from 'react'
// import { AppFooter } from '@/components/app-footer'

export function AppLayout({ children }: { children: React.ReactNode; links: { label: string; path: string }[] }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex flex-col">
        <AppHeader />
        <main className="flex-grow w-full">{children}</main>
        {/* <AppFooter /> */}
      </div>
      <Toaster />
    </ThemeProvider>
  )
}
