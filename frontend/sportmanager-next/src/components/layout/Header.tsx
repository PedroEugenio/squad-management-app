'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bell, Menu, Search, Settings, LogOut, User, CheckCheck, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAuthStore } from '@/store/authStore'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const NOTIFICATIONS = [
  { id: 1, title: 'New match report available', time: '2 min ago', unread: true },
  { id: 2, title: 'Practice session updated', time: '1 hour ago', unread: true },
  { id: 3, title: 'Player evaluation submitted', time: '3 hours ago', unread: true },
]

interface HeaderProps {
  onMenuClick: () => void
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      {/* Mobile menu toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">SM</span>
        </div>
        <span className="hidden md:inline-block text-lg font-bold">SportManager</span>
      </Link>

      {/* Search */}
      <div className="flex-1 flex items-center">
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            placeholder="Search…"
            className="h-9 w-64 rounded-md border border-input bg-transparent pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-ring transition"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
              >
                {NOTIFICATIONS.filter((n) => n.unread).length}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground gap-1">
                <CheckCheck className="h-3 w-3" />
                Mark all read
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {NOTIFICATIONS.map((n) => (
              <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5 py-2.5 cursor-pointer">
                <div className="flex items-center gap-2 w-full">
                  {n.unread && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                  <span className={`text-sm ${n.unread ? 'font-medium' : 'text-muted-foreground'}`}>
                    {n.title}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground pl-3.5">{n.time}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-xs text-muted-foreground">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Badge variant="secondary" className="hidden md:inline-flex">
          {user?.role}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full p-0"
              aria-label="User menu"
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {user ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs text-muted-foreground leading-none">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
