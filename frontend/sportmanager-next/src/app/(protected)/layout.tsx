'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-6">{children}</main>
      </div>
    </div>
  )
}
