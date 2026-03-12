import Link from 'next/link'
import { LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 gap-8">
      <div>
        <p className="text-[120px] font-extrabold leading-none text-muted-foreground/20 select-none">404</p>
        <h1 className="text-2xl font-bold -mt-2">Page not found</h1>
        <p className="text-muted-foreground mt-2 max-w-sm mx-auto text-sm">
          The page you&rsquo;re looking for doesn&rsquo;t exist or may have been moved.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard">
          <LayoutDashboard className="h-4 w-4 mr-2" />
          Go to Dashboard
        </Link>
      </Button>
    </div>
  )
}
