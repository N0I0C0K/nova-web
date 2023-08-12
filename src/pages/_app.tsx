import '@/styles/globals.css'
import '@/components/EditableCodeTextare/style/index.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import BaseLayout from '@/components/BaseLayout'
import { SessionProvider } from 'next-auth/react'
import { AxiosProvider } from '@/components/AxiosProvider'
import { UserProvider } from '@/components/UserInfoProvider'
import { GlobalLayoutPropsProvider } from '@/components/GlobalHeaderProvider'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <ChakraProvider>
      <SessionProvider session={session}>
        <AxiosProvider>
          <UserProvider>
            <GlobalLayoutPropsProvider>
              <BaseLayout>
                <Component {...pageProps} />
              </BaseLayout>
            </GlobalLayoutPropsProvider>
          </UserProvider>
        </AxiosProvider>
      </SessionProvider>
    </ChakraProvider>
  )
}
