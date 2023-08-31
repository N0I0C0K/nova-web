import { BlogItem } from '@/components/BlogItem'
import { prisma } from '@/db'
import { ArticleProps, MemberProps } from '@/types'
import { Link } from '@chakra-ui/next-js'
import {
  Button,
  Divider,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Text,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next/types'
import { useMemo, useState } from 'react'
import { nanoid } from 'nanoid'

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
  const [key] = useState(nanoid())
  return (
    <Flex flexDir={'column'} alignItems={'center'}>
      <Flex
        pt={'5rem'}
        flexDirection={'column'}
        className='items-center'
        gap={'1rem'}
        w={'50rem'}
        key={key}
      >
        <Heading>Blog</Heading>
        <Text color={'gray.400'}></Text>
        <Text color='gray.400'>
          这里是全部社员发布的文章，共{allBlogNum}篇文章，当前第{pageN}页
        </Text>
        <InputGroup mb={'1rem'}>
          <Input placeholder='serach..' />
          <InputRightElement width='4rem' pr={'.5rem'}>
            <Button h={'1.75rem'} size='sm' colorScheme={'blue'}>
              search
            </Button>
          </InputRightElement>
        </InputGroup>

        <Divider />
        <List spacing={'1rem'}>
          {articles.map((it, idx) => {
            return (
              <ListItem key={it.slug}>
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
          <Link href={'/blog?page=0'}>
            <Button>首页</Button>
          </Link>
          {Array.from({ length: Math.min(allPage, 5) }).map((_, idx) => {
            let p = idx + pageN - 2
            if (p < 0 || p > allPage) {
              return <></>
            }
            return (
              <Link key={idx} href={`/blog?page=${p}`}>
                <Button colorScheme={pageN === p ? 'linkedin' : 'gray'}>
                  {p}
                </Button>
              </Link>
            )
          })}
          <Link href={`/blog?page=${allPage}`}>
            <Button>尾页</Button>
          </Link>
        </Flex>
        <Text color='gray.400' mt={'1rem'}>
          共{allBlogNum}篇文章，当前第{pageN}页，一共{allPage}页
        </Text>
      </Flex>
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
