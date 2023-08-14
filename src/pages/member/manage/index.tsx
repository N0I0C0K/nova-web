import { useAxios } from '@/components/AxiosProvider'
import { useGlobalLayoutProps } from '@/components/GlobalHeaderProvider'
import { useAlert } from '@/components/Providers/AlertProvider'
import { prisma } from '@/db'
import { ArticleProps, UserAllInfo } from '@/types'
import { EditIcon, EmailIcon, PhoneIcon } from '@chakra-ui/icons'
import { Link } from '@chakra-ui/next-js'
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Flex,
  IconButton,
  Spacer,
  Text,
  Tooltip,
  useToast,
} from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { getToken } from 'next-auth/jwt'
import { useEffect, useState } from 'react'

const PostManage = ({ posts }: { posts: ArticleProps[] }) => {
  const [postsState, setPosts] = useState(posts)
  const alert = useAlert()
  const axios = useAxios()
  const toast = useToast()
  return (
    <Flex
      flexDir={'column'}
      p={'1rem'}
      className='border rounded-xl'
      gap={'.5rem'}
    >
      <Text fontSize={'lg'} fontWeight={'bold'}>
        文章管理
      </Text>
      <Divider />
      <Flex flexDir={'row'}>
        <Button>新建</Button>
      </Flex>
      <Divider />
      {postsState
        .sort((a, b) => {
          return a.createAt.getTime() - b.createAt.getTime()
        })
        .map((val) => (
          <Flex
            key={val.id}
            className='rounded-md items-center duration-300 hover:shadow-lg hover:scale-105'
            p={'.5rem'}
            gap={'.5rem'}
          >
            <Text fontWeight={'bold'}>{val.title}</Text>
            {val.badges.map((val) => (
              <Badge key={val} colorScheme='green'>
                {val}
              </Badge>
            ))}
            <Spacer />
            <Tooltip label='最后更改时间'>
              <Text color={'gray'} ml={'2rem'}>
                {val.updateAt.toLocaleString()}
              </Text>
            </Tooltip>
            <Link href={`/blog/${val.slug}`} fontWeight={'bold'}>
              查看
            </Link>
            <Link href={`/blog/edit/${val.slug}`} fontWeight={'bold'}>
              编辑
            </Link>
            <Button
              variant={'link'}
              colorScheme='red'
              onClick={() => {
                alert.show({
                  show: true,
                  title: '删除文章',
                  description: '确定要删除这篇文章吗？',
                  cancel() {},
                  confirm() {
                    axios
                      .post('/post/del', {
                        postId: val.id,
                      })
                      .then(() => {
                        toast({
                          title: `文章“${val.title}”删除成功`,
                          status: 'success',
                        })
                        setPosts(
                          postsState.filter((pp) => {
                            return pp.id !== val.id
                          })
                        )
                      })
                      .catch((e) => {
                        toast({
                          title: '删除失败',
                          description: e.message,
                          status: 'error',
                        })
                      })
                  },
                })
              }}
            >
              删除
            </Button>
          </Flex>
        ))}
    </Flex>
  )
}

const UserInfo = ({ user }: { user: UserAllInfo }) => {
  return (
    <Flex
      flexDir={'row'}
      w={'100%'}
      h={'7rem'}
      p={'1rem'}
      gap={'1rem'}
      shadow={'lg'}
      sx={{
        _dark: {
          borderWidth: '1px',
        },
      }}
      className='border rounded-xl items-center'
    >
      <Avatar name={user.name} size={'lg'} />
      <Flex flexDir={'column'}>
        <Text fontSize={'lg'} fontWeight={'bold'}>
          {user.name} ({user.secure.username})
        </Text>
        <Text fontSize={'sm'} color={'gray'}>
          {user.description}
        </Text>
      </Flex>
      <Spacer />
      {user.secure.phone && (
        <Button leftIcon={<PhoneIcon />} variant={'ghost'}>
          {user.secure.phone}
        </Button>
      )}
      {user.secure.email && (
        <Button leftIcon={<EmailIcon />} variant={'ghost'}>
          {user.secure.email}
        </Button>
      )}
      <IconButton aria-label='edit' variant={'ghost'}>
        <EditIcon />
      </IconButton>
    </Flex>
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
        w: '100vw',
      },
    })
    return () => {
      resetLayout()
    }
  }, [])
  return (
    <Flex className='justify-center' w={'100%'}>
      <Flex
        flexDir={'column'}
        w={'100%'}
        maxW={'60rem'}
        h={'100%'}
        p={'1rem'}
        gap={'1rem'}
      >
        <UserInfo user={user} />
        <PostManage posts={user.posts} />
      </Flex>
    </Flex>
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
