import { useGlobalLayoutProps } from '@/components/GlobalHeaderProvider'
import { prisma } from '@/db'
import { UserAllInfo } from '@/types'
import { Avatar, Flex, Text } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { getToken } from 'next-auth/jwt'
import { useEffect } from 'react'

const UserManagePage = ({ user }: { user: UserAllInfo }) => {
  const [layout, setLayout, resetLayout] = useGlobalLayoutProps()
  useEffect(() => {
    setLayout({
      showHead: false,
      showFooter: false,
      gloablBoxProps: {
        p: '0rem',
        h: '100vh',
      },
    })
    return () => {
      resetLayout()
    }
  }, [])
  return (
    <Flex flexDir={'row'} h={'100%'} p={'1rem'}>
      <Flex
        flexDir={'column'}
        w={'10rem'}
        h={'100%'}
        p={'1rem'}
        gap={'.5rem'}
        shadow={'lg'}
        className='border rounded-md items-center'
      >
        <Avatar name={user.name} size={'lg'} />
        <Text>Hello {user.name}!</Text>
      </Flex>
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps<
  { user: UserAllInfo },
  {}
> = async (ctx) => {
  const sess = await getToken({
    req: ctx.req,
  })
  if (!sess) {
    return {
      notFound: true,
    }
  }
  const { id } = sess as unknown as { id: string }
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      comments: true,
      games: true,
      posts: true,
    },
  })
  if (!user) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      user: user!,
    },
  }
}

export default UserManagePage
