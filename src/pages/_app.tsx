import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import BaseLayout from '@/components/BaseLayout'
import { SessionProvider } from 'next-auth/react'
import { AxiosProvider } from '@/components/AxiosProvider'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <ChakraProvider>
      <SessionProvider session={session}>
        <AxiosProvider>
          <BaseLayout>
            <Component {...pageProps} />
          </BaseLayout>
        </AxiosProvider>
      </SessionProvider>
    </ChakraProvider>
  )
}
