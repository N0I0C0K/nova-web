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
          author: 'nick`',
        },
      ],
    },
  }
}

const BlogItem = ({ article }: { article: ArticleProps }) => {
  return (
    <Box
      className='rounded-lg p-10 shadow-md duration-300 hover:shadow-lg hover:scale-105'
      minW={'50rem'}
      sx={{
        _light: {
          bg: 'gray.50',
        },
        _dark: {
          bg: 'gray.700',
        },
      }}
    >
      <Link href={`/blog/${article.id}`}>
        <Heading fontSize={'lg'}>{article.title}</Heading>
      </Link>
      <Text color={'gray.400'}>{article.synopsis}</Text>
      {article.badges && (
        <Flex gap={'.5rem'} mt={'1rem'}>
          {article.badges.map((badge, idx) => {
            return (
              <Badge key={idx} colorScheme={'green'} variant={'subtle'}>
                {badge}
              </Badge>
            )
          })}
        </Flex>
      )}
    </Box>
  )
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
