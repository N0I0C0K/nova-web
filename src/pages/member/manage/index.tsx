import { useGlobalLayoutProps } from '@/components/GlobalHeaderProvider'
import { prisma } from '@/db'
import { UserAllInfo } from '@/types'
import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  chakra,
} from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { getToken } from 'next-auth/jwt'
import { useEffect } from 'react'
import { observable } from 'mobx'
import { UserContext } from './_UserAllInfoContext'
import { PostManage } from './_PostMange'
import { UserInfo } from './_UserInfo'
import { GroupManage } from './_GroupManage'
import { FileManage } from './_FileManage'
import { InviteManage } from './_InviteManage'

const CustomTabPanel = chakra(TabPanel, {
  baseStyle: {
    p: -1,
    pt: '1rem',
  },
})

const CustomTab = chakra(Tab, {
  baseStyle: {},
})

function ToolsTab() {
  return (
    <Tabs isFitted variant={'soft-rounded'}>
      <TabList className='flex gap-4'>
        <CustomTab>文章管理</CustomTab>
        <CustomTab>小组管理</CustomTab>
        <CustomTab>游戏管理</CustomTab>
        <CustomTab>文件管理</CustomTab>
        <CustomTab>邀请码管理</CustomTab>
      </TabList>
      <TabPanels p={'-1rem'}>
        <CustomTabPanel>
          <PostManage />
        </CustomTabPanel>
        <CustomTabPanel>
          <GroupManage />
        </CustomTabPanel>
        <CustomTabPanel>游戏管理</CustomTabPanel>
        <CustomTabPanel>
          <FileManage />
        </CustomTabPanel>
        <CustomTabPanel>
          <InviteManage />
        </CustomTabPanel>
      </TabPanels>
    </Tabs>
  )
}

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
          <ToolsTab />
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
      files: true,
      masterGroup: true,
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
