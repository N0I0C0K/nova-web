import { ArticleProps } from '@/types'
import { Box, Flex, Heading, List, ListItem, Text } from '@chakra-ui/react'
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
        },
        {
          id: 'article2',
          title: 'Test Title2cakjsdkas',
          synopsis: 'this is a test synopsis!!!!!!',
        },
        {
          id: 'article3',
          title: 'Test Title3',
          synopsis: 'this is a test synopsis!!!!!!\ndadadas',
          badges: ['badge1', 'badge2'],
        },
      ],
    },
  }
}

export default function BlogPage({ articles }: { articles: ArticleProps[] }) {
  return (
    <Flex pt={'6rem'} flexDirection={'column'} className="items-center">
      <Heading>Blog</Heading>
      <List pt={'3rem'} spacing={'1rem'}>
        {articles.map((it, idx) => {
          return (
            <ListItem key={idx}>
              <Box
                className="rounded-lg p-10 shadow-md cursor-pointer duration-300 hover:shadow-lg hover:scale-105"
                minW={'50rem'}
                bgColor={'gray.50'}
              >
                <Heading fontSize={'lg'}>{it.title}</Heading>
                <Text color={'gray.400'}>{it.synopsis}</Text>
              </Box>
            </ListItem>
          )
        })}
      </List>
    </Flex>
  )
}
