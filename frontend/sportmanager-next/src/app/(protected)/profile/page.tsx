'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const [displayName, setDisplayName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    // TODO: persist to API
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information</p>
      </div>

      {/* Avatar + name */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-5">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-xl font-bold">{initials(user?.name ?? 'U')}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-bold">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Badge variant="outline" className="mt-1">{user?.role ?? 'User'}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account Details</CardTitle>
          <CardDescription>Update your display name or email address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="display-name">Display Name</Label>
            <Input id="display-name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Separator />
      <div className="flex justify-end pb-4">
        <Button onClick={handleSave} className="min-w-32">
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}
