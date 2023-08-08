import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import BaseLayout from '@/components/BaseLayout'
import { SessionProvider } from 'next-auth/react'
import { AxiosProvider } from '@/components/AxiosProvider'
import { UserProvider } from '@/components/UserInfoProvider'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <ChakraProvider>
      <SessionProvider session={session}>
        <AxiosProvider>
          <UserProvider>
            <BaseLayout>
              <Component {...pageProps} />
            </BaseLayout>
          </UserProvider>
        </AxiosProvider>
      </SessionProvider>
    </ChakraProvider>
  )
}
