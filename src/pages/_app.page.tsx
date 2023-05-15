import { GlobalStyles } from '@/styles/global'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import './../lib/dayjs'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../lib/react-query'
GlobalStyles()

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
  )
}
