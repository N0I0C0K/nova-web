import { BlogItem } from '@/components/BlogItem'
import { prisma } from '@/db'
import { ArticleProps, MemberProps } from '@/types'
import { Link } from '@chakra-ui/next-js'
import {
  Badge,
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Heading,
  Input,
  List,
  ListItem,
  NumberInput,
  Spacer,
  Text,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next/types'
import { useMemo } from 'react'

type BlogProps = { author: MemberProps } & ArticleProps

export default function BlogPage({
  articles,
  allBlogNum,
  allPage,
}: {
  articles: BlogProps[]
  allPage: number
  allBlogNum: number
}) {
  const router = useRouter()
  const pageN = useMemo(() => {
    return parseInt(router.query.page as string) || 0
  }, [router])
  return (
    <Flex
      pt={'5rem'}
      flexDirection={'column'}
      className='items-center'
      gap={'.5rem'}
    >
      <Heading>Blog</Heading>
      <Text color={'gray.400'}></Text>
      <Text color='gray.400'>
        这里是全部社员发布的文章，共{allBlogNum}篇文章，当前第{pageN}页
      </Text>
      <List pt={'3rem'} spacing={'1rem'}>
        {articles.map((it, idx) => {
          return (
            <ListItem key={idx}>
              <BlogItem
                authorName={it.author.name}
                id={it.slug}
                synopsis={it.synopsis}
                title={it.title}
                badges={it.badges}
                createAt={it.createAt}
                updateAt={it.updateAt}
              />
            </ListItem>
          )
        })}
      </List>
      <Flex pt={'3rem'} gap={'1rem'}>
        <Button>上一页</Button>
        {Array.from({ length: allPage }).map((_, idx) => (
          <Link key={idx} href={`/blog?page=${idx}`}>
            <Button colorScheme={pageN === idx ? 'linkedin' : 'gray'}>
              {idx}
            </Button>
          </Link>
        ))}
        <Button>下一页</Button>
      </Flex>
      <Text color='gray.400' mt={'1rem'}>
        共{allBlogNum}篇文章，当前第{pageN}页
      </Text>
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps<{
  articles: (ArticleProps & {
    author: MemberProps
  })[]
}> = async (ctx) => {
  const { page } = ctx.query
  let pageN = 0
  if (page && typeof page === 'string') {
    pageN = parseInt(page)
  }
  const blogNum = await prisma.post.count()
  const allArticle = await prisma.post.findMany({
    skip: pageN * 10,
    take: 10,
    include: {
      author: true,
    },
    orderBy: {
      createAt: 'desc',
    },
  })
  return {
    props: {
      allPage: Math.ceil(blogNum / 10),
      allBlogNum: blogNum,
      articles: allArticle,
    },
  }
}
