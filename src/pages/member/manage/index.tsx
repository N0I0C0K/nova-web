import { useGlobalLayoutProps } from '@/components/LayoutPropsProvider'
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
import { useContext, useEffect } from 'react'
import { observable } from 'mobx'
import { UserContext } from '@/page-components/user-manage/_UserAllInfoContext'
import { PostManage } from '@/page-components/user-manage/_PostMange'
import { UserInfo } from '@/page-components/user-manage/_UserInfo'
import { GroupManage } from '@/page-components/user-manage/_GroupManage'
import { FileManage } from '@/page-components/user-manage/_FileManage'
import { InviteManage } from '@/page-components/user-manage/_InviteManage'
import { JoinFormManage } from '@/page-components/user-manage/JoinFormManage'

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
  const user = useContext(UserContext)
  return (
    <Tabs isFitted variant={'soft-rounded'}>
      <TabList className='flex gap-4'>
        <CustomTab>文章</CustomTab>
        <CustomTab>小组</CustomTab>
        <CustomTab>游戏</CustomTab>
        <CustomTab>文件</CustomTab>
        <CustomTab>邀请码</CustomTab>
        <CustomTab>申请</CustomTab>
        {user.secure.level >= 100 && <CustomTab>用户管理</CustomTab>}
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
        <CustomTabPanel>
          <JoinFormManage />
        </CustomTabPanel>
      </TabPanels>
    </Tabs>
  )
}

const UserManagePage = ({ user }: { user: UserAllInfo }) => {
  const [layout, setLayout, resetLayout] = useGlobalLayoutProps()
  useEffect(() => {
    setLayout({
      ...layout,
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
      invitations: {
        include: {
          user: true,
        },
      },
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
