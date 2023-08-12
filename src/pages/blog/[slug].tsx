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
} from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { FC, useState } from 'react'
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
  const router = useRouter()
  return (
    <Flex
      pos={'relative'}
      pt={'5rem'}
      flexDirection={'column'}
      className='items-center'
    >
      {loginUser.isLogin && loginUser.id === post.user_id ? (
        <Flex
          pos={'absolute'}
          flexDir={'column'}
          gap={'1rem'}
          left={'4rem'}
          top={'6rem'}
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
            />
          </Tooltip>
        </Flex>
      ) : null}
      <Flex pos={'relative'} w={'50rem'} flexDir={'column'} gap={'1rem'}>
        <Flex gap={'.5rem'} alignItems={'center'}>
          <Flex flexDir={'column'}>
            <Heading>{post.title}</Heading>
            <Text color={'gray'}>{post.synopsis}</Text>
          </Flex>
          <Spacer />
          <Flex gap={'1rem'}>
            <Avatar />
            <Flex flexDir={'column'}>
              <Text fontWeight={'bold'}>{post.author.name}</Text>
              <Text color={'gray'}>{post.createAt.toLocaleString()}</Text>
            </Flex>
          </Flex>
        </Flex>
        <Divider />
        <Box>
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
            最后编剧于{post.updateAt.toLocaleString()}
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
                    setComments((val) => [...val, data])
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
