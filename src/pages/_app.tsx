import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import BaseLayout from '@/components/BaseLayout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <BaseLayout>
        <Component {...pageProps} />
      </BaseLayout>
    </ChakraProvider>
  )
}
