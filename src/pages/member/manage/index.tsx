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
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  Tooltip,
  useBoolean,
  useToast,
} from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { GetServerSideProps } from 'next'
import { getToken } from 'next-auth/jwt'
import { FC, createContext, useContext, useEffect, useState } from 'react'
import {
  makeAutoObservable,
  makeObservable,
  observable,
  runInAction,
} from 'mobx'
import { observer } from 'mobx-react-lite'

type UserMainInfo = {
  name: string
  username: string
  description: string
  avatarUrl?: string
  phone?: string
  email?: string
}

const UserContext = createContext<UserAllInfo>({} as unknown as any)

const PostManage = observer(() => {
  const user = useContext(UserContext)

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
      {user.posts
        .slice()
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
                        user.posts = user.posts.filter((pp) => pp.id !== val.id)
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
})

const UserInfoModifyModal: FC<{
  open: boolean
  onClose: () => void
}> = observer(({ open, onClose }) => {
  const axios = useAxios()
  const toast = useToast()
  const user = useContext(UserContext)
  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader p={'1rem'}>修改用户信息</ModalHeader>
        <Formik
          initialValues={{
            name: user.name,
            description: user.description,
          }}
          onSubmit={(val) => {
            console.log(val)
            axios
              .post('/user/modify', val)
              .then((res) => {
                toast({
                  title: '修改成功',
                  status: 'success',
                  isClosable: true,
                })
                runInAction(() => {
                  user.name = val.name
                  user.description = val.description
                })
                onClose()
              })
              .catch((e) => {
                toast({
                  title: '修改失败',
                  description: '检查是否合理',
                  status: 'error',
                  isClosable: true,
                })
              })
          }}
        >
          {({ values, handleChange, handleBlur, handleSubmit }) => (
            <Form onSubmit={handleSubmit} className='flex flex-col p-4 gap-2'>
              <FormControl>
                <FormLabel>Name:</FormLabel>
                <Input
                  name='name'
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description:</FormLabel>
                <Input
                  name='description'
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormControl>
              <Button mt={'2rem'} type='submit'>
                Save
              </Button>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  )
})

const UserInfo = observer(() => {
  const user = useContext(UserContext)
  const [open, setOpen] = useBoolean(false)
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
      <IconButton aria-label='edit' variant={'ghost'} onClick={setOpen.toggle}>
        <EditIcon />
      </IconButton>
      <UserInfoModifyModal open={open} onClose={setOpen.off} />
    </Flex>
  )
})

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
