import { BlogItem } from '@/components/BlogItem'
import { ArticleProps } from '@/types'
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

export const getServerSideProps: GetServerSideProps<{
  articles: ArticleProps[]
}> = async (ctx) => {
  return {
    props: {
      articles: [
        {
          id: 'article1',
          title: 'Test Title1',
          synopsis: 'this is a test synopsis!!!!!!',
          author: 'nick',
        },
        {
          id: 'article2',
          title: 'Test Title2cakjsdkas',
          synopsis: 'this is a test synopsis!!!!!!',
          author: 'nick',
        },
        {
          id: 'article3',
          title: 'Test Title3',
          synopsis: 'this is a test synopsis!!!!!!\ndadadas',
          badges: ['badge1', 'badge2'],
          author: 'nick',
        },
      ],
    },
  }
}

export default function BlogPage({ articles }: { articles: ArticleProps[] }) {
  return (
    <Flex pt={'5rem'} flexDirection={'column'} className='items-center'>
      <Heading>Blog</Heading>
      <List pt={'3rem'} spacing={'1rem'}>
        {articles.map((it, idx) => {
          return (
            <ListItem key={idx}>
              <BlogItem article={it} />
            </ListItem>
          )
        })}
      </List>
    </Flex>
  )
}
