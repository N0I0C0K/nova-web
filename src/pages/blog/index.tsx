import { BlogItem } from '@/components/BlogItem'
import { prisma } from '@/db'
import { ArticleProps, MemberProps } from '@/types'
import { Link } from '@chakra-ui/next-js'
import {
  Badge,
  Box,
  Flex,
  Heading,
  List,
  ListItem,
  Text,
} from '@chakra-ui/react'
import { GetServerSideProps } from 'next/types'

type BlogProps = { author: MemberProps } & ArticleProps

export default function BlogPage({ articles }: { articles: BlogProps[] }) {
  return (
    <Flex pt={'5rem'} flexDirection={'column'} className='items-center'>
      <Heading>Blog</Heading>
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
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps<{
  articles: (ArticleProps & {
    author: MemberProps
  })[]
}> = async (ctx) => {
  const allArticle = await prisma.post.findMany({
    take: 10,
    include: {
      author: true,
    },
  })
  return {
    props: {
      articles: allArticle,
    },
  }
}
