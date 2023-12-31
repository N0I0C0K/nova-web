import '@/styles/globals.css'
import '@/components/EditableCodeTextare/style/index.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import BaseLayout from '@/components/BaseLayout'
import { SessionProvider } from 'next-auth/react'
import { AxiosProvider } from '@/components/AxiosProvider'
import { UserProvider } from '@/components/UserInfoProvider'
import { GlobalLayoutPropsProvider } from '@/components/LayoutPropsProvider'
import { AlertProvider } from '@/components/Providers/AlertProvider'
import { UserInfoProvider } from '@/components/Providers/UserProvider'
import { SearchProvider } from '@/components/Providers/SearchProvider'
import { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ?? ((page) => <BaseLayout>{page}</BaseLayout>)
  return (
    <ChakraProvider>
      <SessionProvider session={session}>
        <AxiosProvider>
          <UserProvider>
            <GlobalLayoutPropsProvider>
              <AlertProvider>
                <SearchProvider>
                  <UserInfoProvider>
                    {getLayout(<Component {...pageProps} />)}
                  </UserInfoProvider>
                </SearchProvider>
              </AlertProvider>
            </GlobalLayoutPropsProvider>
          </UserProvider>
        </AxiosProvider>
      </SessionProvider>
    </ChakraProvider>
  )
}
