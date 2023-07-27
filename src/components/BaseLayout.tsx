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
import { useRouter } from 'next/router'
import { FC, useMemo } from 'react'

const SelectLink: FC<{
  href: string
  name: string
  selectd: boolean
}> = ({ href, name, selectd }) => {
  return (
    <Link href={href}>
      <Text color={selectd ? 'black' : 'gray.400'}>{name}</Text>
    </Link>
  )
}

const LinkList: {
  path: string
  name: string
}[] = [
  {
    path: '/',
    name: 'Home',
  },
  {
    path: '/game',
    name: 'Game',
  },
  {
    path: '/blog',
    name: 'Blog',
  },
  {
    path: '/about',
    name: 'About',
  },
]

function TopHeader() {
  const router = useRouter()
  console.log(router)

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
      {LinkList.map((val, idx) => {
        return (
          <SelectLink
            href={val.path}
            name={val.name}
            selectd={router.pathname.startsWith(val.path)}
            key={idx}
          />
        )
      })}
      {/* <SelectLink href="/" name="Home" selectd={false} />
      <Link href="/game">Games</Link>
      <Link href="/blog">Blog</Link>
      <Link href="/about">About</Link> */}
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
      <Box minH={'100vh'} px={'5rem'}>
        {children}
      </Box>
      <ButtomFooter />
    </Box>
  )
}
