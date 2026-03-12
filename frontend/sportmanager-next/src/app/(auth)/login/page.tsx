'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { loginSchema, type LoginFormValues } from '@/schemas/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const SOCIAL_PROVIDERS = [
  {
    id: 'google' as const,
    label: 'Google',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
      </svg>
    ),
  },
  {
    id: 'github' as const,
    label: 'GitHub',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path fill="currentColor" d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    id: 'microsoft' as const,
    label: 'Microsoft',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path fill="#f25022" d="M1 1h10v10H1z" />
        <path fill="#7fba00" d="M13 1h10v10H13z" />
        <path fill="#00a4ef" d="M1 13h10v10H1z" />
        <path fill="#ffb900" d="M13 13h10v10H13z" />
      </svg>
    ),
  },
]

export default function LoginPage() {
  const { login, loginWithProvider } = useAuthStore()
  const router = useRouter()
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const [apiError, setApiError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (values: LoginFormValues) => {
    setApiError('')
    try {
      await login(values.email, values.password)
      router.push('/dashboard')
    } catch {
      setApiError('Invalid credentials. Please try again.')
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'github' | 'microsoft') => {
    setApiError('')
    setSocialLoading(provider)
    try {
      await loginWithProvider(provider)
      router.push('/dashboard')
    } catch {
      setApiError('Social login failed. Please try again.')
    } finally {
      setSocialLoading(null)
    }
  }

  const busy = isSubmitting || !!socialLoading

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">SM</span>
            </div>
            <span className="text-xl font-bold">SportManager</span>
          </div>
        </div>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to access your club management portal</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {SOCIAL_PROVIDERS.map((p) => (
            <Button
              key={p.id}
              variant="outline"
              className="w-full"
              onClick={() => handleSocialLogin(p.id)}
              disabled={busy}
            >
              {socialLoading === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : p.icon}
              <span className="sr-only">{p.label}</span>
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or continue with</span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              disabled={busy}
              {...register('email')}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              disabled={busy}
              {...register('password')}
            />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          {apiError && <p className="text-sm text-destructive">{apiError}</p>}

          <Button type="submit" className="w-full" disabled={busy}>
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in…</>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline font-medium">Sign up</Link>
        </p>
      </CardFooter>
    </Card>
  )
}
