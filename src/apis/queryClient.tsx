"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
            gcTime: 30 * 60 * 1000, // 30분간 메모리에 보관
            retry: 1, // 에러 시 1번만 재시도
            refetchOnWindowFocus: false, // 윈도우 포커스 시 refetch 비활성화
            refetchOnMount: false, // 마운트 시 자동 refetch 비활성화
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
