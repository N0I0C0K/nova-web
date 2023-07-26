import {
  Box,
  Flex,
  Stack,
  Spacer,
  Input,
  InputGroup,
  InputRightElement,
  ButtonGroup,
  Button,
  Text,
} from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'
import { TopSearch } from './TopSearch'
import { NovaNmal, NovaText } from './Nova'

function TopHeader() {
  return (
    <Flex
      className="items-center backdrop-blur-md"
      gap={'2rem'}
      py={'2rem'}
      px={'5rem'}
      position={'fixed'}
      w={'100vw'}
      h={'4em'}
    >
      <Text
        fontSize="4xl"
        fontWeight="extrabold"
        pb={'1rem'}
        className="self-center cursor-pointer"
      >
        Nova
      </Text>
      <Link href="/">Home</Link>
      <Link href="/game">Games</Link>
      <Link href="/blog">Blog</Link>
      <Link href="/about">About</Link>
      <Spacer />
      <TopSearch className="max-w-xs" />
    </Flex>
  )
}

export function ButtomFooter() {
  return (
    <Flex
      className="border items-center"
      gap={10}
      py={3}
      px={'5rem'}
      w={'100vw'}
      h={'10em'}
    >
      <Flex flexDirection={'column'} className="items-start justify-center">
        <Text fontSize="2xl" fontWeight="extrabold" className="cursor-pointer">
          Nova
        </Text>
        <Text fontSize={'sm'}>Nova独立游戏研究社团</Text>
        <Text fontSize={'sm'}>依托于陕西科技大学</Text>
      </Flex>
      <Spacer />
      <Link href="/">Home</Link>
      <Link href="/game">Games</Link>
      <Link href="/about">About</Link>
      <Link href="nick131410@aliyun.com">Contact Us</Link>
    </Flex>
  )
}

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Box>
      <TopHeader />
      <Box minH={'100vh'}>{children}</Box>
      <ButtomFooter />
    </Box>
  )
}
