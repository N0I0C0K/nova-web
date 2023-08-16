import { useAxios } from '@/components/AxiosProvider'
import { useAlert } from '@/components/Providers/AlertProvider'
import {
  useToast,
  Flex,
  Divider,
  Button,
  Badge,
  Spacer,
  Tooltip,
  Text,
} from '@chakra-ui/react'

import { observer } from 'mobx-react-lite'
import { useContext } from 'react'
import { UserContext } from './_UserAllInfoContext'
import { Link } from '@chakra-ui/next-js'

export const PostManage = observer(() => {
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