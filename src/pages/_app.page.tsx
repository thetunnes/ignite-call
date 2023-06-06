import { GlobalStyles } from '@/styles/global'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import './../lib/dayjs'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../lib/react-query'
import { NextSeo } from 'next-seo'
GlobalStyles()

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <NextSeo
          title="Ignite call"
          description="O Ignite call é uma aplicação para agendamento de à fazeres dentro do calendário do Google."
          canonical="https://www.canonical.ie/"
          openGraph={{
            url: 'https://www.ignitecall.com',
            type: 'website',
            title: 'Ignite Call',
            locale: 'pt-br',
            description:
              'The Ignite Call is a platform to scheduling in your Calendar Google.',
            siteName: 'Ignite call',
          }}
          twitter={{
            handle: '@thetunnes',
            site: '@site',
            cardType: 'summary_large_image',
          }}
        />
        <Component {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
  )
}
