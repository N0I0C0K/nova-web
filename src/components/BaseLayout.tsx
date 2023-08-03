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
import { ColorModeToggle } from './ColorModeToggle'
import { useRouter } from 'next/router'
import { FC, useMemo } from 'react'

const SelectLink: FC<{
  href: string
  name: string
  selectd: boolean
}> = ({ href, name, selectd }) => {
  return (
    <Link href={href}>
      <Text
        sx={{
          _light: {
            color: selectd ? 'black' : 'gray.400',
          },
          _dark: {
            color: selectd ? 'white' : 'gray.400',
          },
        }}
      >
        {name}
      </Text>
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
  {
    path: '/member',
    name: 'Member',
  },
]

function TopHeader() {
  const router = useRouter()
  const pathname = useMemo(() => {
    return router.pathname
  }, [router])
  return (
    <Flex
      className='items-center backdrop-blur-md z-50'
      gap={'2rem'}
      py={'2rem'}
      px={'5rem'}
      position={'fixed'}
      w={'100vw'}
      h={'4em'}
    >
      <Text
        fontSize='4xl'
        fontWeight='extrabold'
        pb={'1rem'}
        mr={'1rem'}
        className='self-center cursor-pointer'
      >
        Nova
      </Text>
      {LinkList.map((val, idx) => {
        return (
          <SelectLink
            href={val.path}
            name={val.name}
            selectd={
              val.path.length > 1
                ? pathname.startsWith(val.path)
                : pathname === val.path
            }
            key={idx}
          />
        )
      })}
      <Spacer />
      <Flex gap={1}>
        <TopSearch className='max-w-xs' />
        <ColorModeToggle />
      </Flex>
    </Flex>
  )
}

export function ButtomFooter() {
  return (
    <Flex
      className='border-t items-center'
      gap={10}
      py={3}
      px={'5rem'}
      w={'100%'}
      h={'10em'}
    >
      <Flex flexDirection={'column'} className='items-start justify-center'>
        <Text fontSize='2xl' fontWeight='extrabold' className='cursor-pointer'>
          Nova
        </Text>
        <Text fontSize={'sm'} color='gray.400'>
          Nova独立游戏研究社团
        </Text>
        <Text fontSize={'sm'} color='gray.400'>
          依托于陕西科技大学
        </Text>
      </Flex>
      <Spacer />
      <Link href='/'>Home</Link>
      <Link href='/game'>Games</Link>
      <Link href='/about'>About</Link>
      <Link href='nick131410@aliyun.com'>Contact Us</Link>
      <Link href='/login' color={'blue.300'}>
        Login
      </Link>
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
