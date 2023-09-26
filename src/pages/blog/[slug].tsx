import {
  ArticleContentProps,
  CommentProps,
  CommentWithUserProps,
} from '@/types'
import {
  Box,
  Button,
  Divider,
  Flex,
  InputGroup,
  Textarea,
  Text,
  useToast,
  Spacer,
  IconButton,
  Avatar,
  Heading,
  ButtonGroup,
  Icon,
  Tooltip,
  ChakraProps,
  Badge,
} from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { FC, useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CustomRenderer from '@/components/markdown/CustomRenderer'
import { prisma } from '@/db'
import { CommentItem } from '@/components/CommentItem'
import { useAxios } from '@/components/AxiosProvider'
import { Link } from '@chakra-ui/next-js'
import { useSession } from 'next-auth/react'
import { useUserSession } from '@/components/UserInfoProvider'
import {
  DelIcon,
  EditIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from '@/components/Icons'
import { useRouter } from 'next/router'
import { useAlert } from '@/components/Providers/AlertProvider'
import { useGlobalLayoutProps } from '@/components/LayoutPropsProvider'

const ArticleTools: FC<{
  post: ArticleContentProps
  sx?: ChakraProps
}> = ({ post, sx }) => {
  const router = useRouter()
  const alter = useAlert()
  const axios = useAxios()
  const toast = useToast()
  const flref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!flref.current) return
    const pos = flref.current?.parentElement?.getBoundingClientRect()
    const box = flref.current.getBoundingClientRect()
    flref.current.style.left = `${pos!.left - box.width - 30}px`
    flref.current.style.top = `${pos!.top + 10}px`
  }, [])

  return (
    <Flex
      pos={'fixed'}
      flexDir={'column'}
      gap={'1rem'}
      left={'2rem'}
      top={'4rem'}
      sx={{
        ...sx,
      }}
    >
      <Tooltip label='编辑文章'>
        <IconButton
          icon={<EditIcon />}
          aria-label='edit'
          onClick={() => {
            router.push(`/blog/edit/${post.slug}`)
          }}
          size={'lg'}
          isRound
          shadow={'xl'}
        />
      </Tooltip>
      <Tooltip label='删除文章'>
        <IconButton
          aria-label='del'
          icon={<DelIcon />}
          color={'red.400'}
          isRound
          size={'lg'}
          shadow={'xl'}
          onClick={() => {
            alter.show({
              show: true,
              title: '删除文章',
              description: '确定要删除这篇文章吗？',
              cancel() {},
              confirm() {
                axios
                  .post('/post/del', {
                    postId: post.id,
                  })
                  .then(() => {
                    toast({
                      title: '删除成功',
                      status: 'success',
                    })
                    router.back()
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
        />
      </Tooltip>
    </Flex>
  )
}

const ArticlePage: FC<{
  post: ArticleContentProps
}> = ({ post }) => {
  const [text, setText] = useState('')
  const [comments, setComments] = useState<CommentWithUserProps[]>(
    post.comments
  )
  const loginUser = useUserSession()
  const axios = useAxios()
  const toast = useToast()
  const [layoutProps, setProps, reset] = useGlobalLayoutProps()

  useEffect(() => {
    setProps((val) => {
      return {
        ...val,
        useAutoHideHead: true,
      }
    })
    return () => {
      reset()
    }
  }, [])

  return (
    <Flex
      pos={'relative'}
      pt={'5rem'}
      flexDirection={'column'}
      className='items-center'
    >
      <Flex pos={'relative'} w={'50rem'} flexDir={'column'} gap={'1rem'}>
        {loginUser.isLogin && loginUser.id === post.user_id ? (
          <ArticleTools post={post} />
        ) : null}
        <Flex gap={'.5rem'} alignItems={'center'}>
          <Flex flexDir={'column'}>
            <Heading>{post.title}</Heading>
            <Text color={'gray'}>{post.synopsis}</Text>
            <Flex gap={'.5rem'} mt={'.5rem'}>
              {post.badges.map((val) => (
                <Badge colorScheme='green' key={val}>
                  {val}
                </Badge>
              ))}
            </Flex>
          </Flex>
          <Spacer />
          <Flex gap={'1rem'}>
            <Avatar name={post.author.name} src={post.author.avatarUrl ?? ''} />
            <Flex flexDir={'column'}>
              <Link href={`/member/${post.author.name}`}>
                <Text fontWeight={'bold'}>{post.author.name}</Text>
              </Link>
              <Tooltip label='发布于'>
                <Text color={'gray'}>{post.createAt.toLocaleString()}</Text>
              </Tooltip>
            </Flex>
          </Flex>
        </Flex>
        <Divider />
        <Box minH={'20rem'}>
          <ReactMarkdown
            components={CustomRenderer()}
            remarkPlugins={[remarkGfm]}
          >
            {post.content.content}
          </ReactMarkdown>
        </Box>
        <ButtonGroup className='flex flex-row justify-center' isAttached>
          <Button
            aria-label='like'
            leftIcon={<ThumbsUpIcon />}
            roundedLeft={'full'}
            w={'8rem'}
          >
            {post.addition.like}
          </Button>
          <Button
            aria-label='dislike'
            rightIcon={<ThumbsDownIcon />}
            roundedRight={'full'}
            w={'8rem'}
          >
            {post.addition.dislike}
          </Button>
        </ButtonGroup>
        <Flex gap={'.5rem'} alignItems={'center'}>
          <Spacer />
          <Link href={`/member/${post.author.name}`} fontSize={'sm'}>
            @{post.author.name}
          </Link>
          <Text color={'gray'} fontSize={'sm'}>
            最后编辑于{post.updateAt.toLocaleString()}
          </Text>
          <Text color={'gray'} fontSize={'sm'}>
            浏览{post.addition.viewCount}次
          </Text>
        </Flex>

        <Divider />
        <InputGroup pos={'relative'}>
          <Textarea
            placeholder='发布友善的评论'
            value={text}
            onChange={(e) => {
              setText(e.target.value)
            }}
          />
          <Button
            h='2rem'
            size='sm'
            zIndex={1}
            colorScheme='green'
            pos={'absolute'}
            bottom={'0.5rem'}
            right={'.5rem'}
            onClick={() => {
              if (text === '') return
              axios
                .post<CommentWithUserProps>('/post/comment', {
                  postId: post.id,
                  content: text,
                })
                .then(({ data, status }) => {
                  if (status === 200) {
                    setText('')
                    setComments((val) => [
                      {
                        ...data,
                        createAt: new Date(data.createAt),
                      },
                      ...val,
                    ])
                    toast({
                      title: '评论成功',
                      description: '感谢您的评论',
                      status: 'success',
                      duration: 2000,
                      isClosable: true,
                    })
                  } else {
                    toast({
                      title: '评论失败',
                      description: '请检查网络连接',
                      status: 'error',
                      duration: 2000,
                      isClosable: true,
                    })
                  }
                })
                .catch((err) => {
                  toast({
                    title: '评论失败',
                    description: '请检查网络/登陆状态',
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                  })
                })
            }}
          >
            Submit
          </Button>
        </InputGroup>
        <Flex mt={'2rem'} flexDir={'column'} gap={'.5rem'}>
          {comments.map((val) => (
            <CommentItem comment={val} key={val.id} />
          ))}
        </Flex>
      </Flex>
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps<
  {
    post: ArticleContentProps
  },
  {
    slug: string
  }
> = async (ctx) => {
  const { slug } = ctx.params!
  const post = await prisma.post.findFirst({
    where: {
      slug: slug,
    },
    include: {
      author: true,
      content: true,
      addition: true,
      comments: {
        include: {
          author: true,
        },
      },
    },
  })
  if (!post || post.content === null) {
    return {
      notFound: true,
    }
  }
  await prisma.postAddition.update({
    where: {
      post_id: post.id,
    },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  })
  return {
    props: {
      post: {
        ...post,
        content: post.content!,
        addition: post.addition!,
      },
    },
  }
}

export default ArticlePage
