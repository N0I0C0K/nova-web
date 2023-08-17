import { useGlobalLayoutProps } from '@/components/GlobalHeaderProvider'
import { prisma } from '@/db'
import { UserAllInfo } from '@/types'
import { Flex } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { getToken } from 'next-auth/jwt'
import { useEffect } from 'react'
import { observable } from 'mobx'
import { UserContext } from './_UserAllInfoContext'
import { PostManage } from './_PostMange'
import { UserInfo } from './_UserInfo'

const UserManagePage = ({ user }: { user: UserAllInfo }) => {
  const [layout, setLayout, resetLayout] = useGlobalLayoutProps()
  useEffect(() => {
    setLayout({
      showHead: false,
      showFooter: false,
      gloablBoxProps: {
        p: '0rem',
        h: '100vh',
        w: '100%',
      },
    })
    return () => {
      resetLayout()
    }
  }, [])
  return (
    <UserContext.Provider value={observable(user)}>
      <Flex className='justify-center' w={'100%'}>
        <Flex
          flexDir={'column'}
          w={'100%'}
          maxW={'60rem'}
          h={'100%'}
          p={'1rem'}
          gap={'1rem'}
        >
          <UserInfo />
          <PostManage />
        </Flex>
      </Flex>
    </UserContext.Provider>
  )
}

export const getServerSideProps: GetServerSideProps<{
  user: UserAllInfo
}> = async (ctx) => {
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
      secure: true,
      group: true,
      invitations: true,
    },
  })
  if (!user) {
    return {
      notFound: true,
    }
  }
  if (user.secure) {
    user.secure.password = ''
  }
  return {
    props: {
      user: {
        ...user!,
        secure: user.secure!,
      },
    },
  }
}

export default UserManagePage
