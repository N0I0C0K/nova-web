import { Box, Flex, Spacer, Button, Text, Avatar } from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'
import { TopSearch } from './TopSearch'
import { ColorModeToggle } from './ColorModeToggle'
import { useRouter } from 'next/router'
import { FC, useMemo } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useGlobalLayoutProps } from './GlobalHeaderProvider'

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
  const sess = useSession()
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
      <Flex gap={1} alignItems={'center'}>
        <TopSearch className='max-w-xs' />
        <ColorModeToggle />
        {sess.status === 'authenticated' && (
          <Link href={`/member/${sess.data.user?.name ?? 'unkown'}`}>
            <Avatar
              size={'sm'}
              name={sess.data.user?.name ?? 'unkown'}
              h={'3em'}
              w={'3em'}
            />
          </Link>
        )}
      </Flex>
    </Flex>
  )
}

export function ButtomFooter() {
  const sess = useSession()

  const isLogin = useMemo(() => {
    return sess.status === 'authenticated'
  }, [sess.status])
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
      <Button
        variant={'link'}
        colorScheme='blue'
        onClick={() => {
          if (isLogin) {
            signOut()
          } else {
            signIn('credentials', {
              callbackUrl: '/',
              redirect: true,
            })
          }
        }}
      >
        {isLogin ? `Logout(${sess.data?.user?.name})` : 'Login'}
      </Button>
    </Flex>
  )
}

function Tools() {
  return (
    <Flex flexDir={'column'} pos={'fixed'} right={'1rem'} bottom={'1rem'}>
      <ColorModeToggle />
    </Flex>
  )
}

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [layoutProps] = useGlobalLayoutProps()
  return (
    <Box>
      {layoutProps.showHead ? <TopHeader /> : <Tools />}
      <Box {...layoutProps.gloablBoxProps}>{children}</Box>
      {layoutProps.showFooter && <ButtomFooter />}
    </Box>
  )
}
