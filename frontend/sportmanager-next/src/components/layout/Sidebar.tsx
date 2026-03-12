'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  BarChart3,
  FileText,
  Settings,
  User,
  X,
  Shirt,
  CalendarDays,
  Trophy,
  ClipboardList,
  BookOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  {
    group: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/analytics', label: 'Performance', icon: BarChart3 },
      { href: '/reports', label: 'Reports', icon: FileText },
    ],
  },
  {
    group: 'Club Management',
    items: [
      { href: '/squad', label: 'Squad', icon: Shirt },
      { href: '/practices', label: 'Practices', icon: CalendarDays },
      { href: '/matches', label: 'Matches', icon: Trophy },
      { href: '/callup', label: 'Callup', icon: ClipboardList },
      { href: '/users', label: 'Staff', icon: Users},
    ],
  },
  {
    group: 'Training Resources',
    items: [
      { href: '/drills', label: 'Drill Library', icon: BookOpen },
    ],
  },
  {
    group: 'Account',
    items: [
      { href: '/profile', label: 'Profile', icon: User },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
]

function NavItem({
  href,
  label,
  icon: Icon,
  badge,
  onClick,
}: {
  href: string
  label: string
  icon: React.ElementType
  badge?: string
  onClick?: () => void
}) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1">{label}</span>
      {badge && (
        <Badge variant="secondary" className="ml-auto text-[10px] h-4 px-1.5">
          {badge}
        </Badge>
      )}
    </Link>
  )
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-2 p-4">
      {NAV_ITEMS.map((group, i) => (
        <div key={group.group}>
          {i > 0 && <Separator className="my-2" />}
          <p className="mb-1 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {group.group}
          </p>
          <nav className="flex flex-col gap-1">
            {group.items.map((item) => (
              <NavItem key={item.href} {...item} onClick={onClose} />
            ))}
          </nav>
        </div>
      ))}
    </div>
  )
}

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r bg-background">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
          <aside className="absolute left-0 top-0 h-full w-64 bg-background shadow-xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xs">SM</span>
                </div>
                <span className="font-bold">SportManager</span>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close sidebar">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <SidebarContent onClose={onClose} />
          </aside>
        </div>
      )}
    </>
  )
}
