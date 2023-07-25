import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Box, Flex, Button, Text } from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'
import { NovaText } from '@/components/Nova'

const inter = Inter({ subsets: ['latin'] })

function MainInfo() {
  return (
    <Flex
      flexDirection={'column'}
      alignItems={'center'}
      justifyContent={'center'}
      minH={'100vh'}
    >
      <NovaText />
      <Text className={inter.className}>热爱游戏的年轻人</Text>
      <Link href={'/join'}>Join us</Link>
    </Flex>
  )
}

export default function Home() {
  return (
    <Box>
      <MainInfo />
    </Box>
  )
}
