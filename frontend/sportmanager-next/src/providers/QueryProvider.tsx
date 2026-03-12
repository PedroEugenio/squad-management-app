'use client'

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { toast } from 'sonner'

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'An unexpected error occurred'
}

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // One QueryClient per browser session — not shared across requests
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000, // 30 s — tune per entity when real API is wired
            retry: 1,
          },
        },
        // Global error handler for all mutations
        mutationCache: new MutationCache({
          onError: (error) => {
            toast.error('Action failed', { description: errorMessage(error) })
          },
        }),
        // Global error handler for background refetch failures only
        // (initial load failures are handled by error.tsx boundaries)
        queryCache: new QueryCache({
          onError: (error, query) => {
            if (query.state.data !== undefined) {
              toast.error('Failed to refresh data', { description: errorMessage(error) })
            }
          },
        }),
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
