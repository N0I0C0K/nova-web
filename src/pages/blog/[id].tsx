import { ArticleProps } from '@/types'
import { Box, Flex, Heading } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { FC } from 'react'

const ArticlePage: FC<{
  article: ArticleProps
}> = ({ article }) => {
  return (
    <Flex pt={'5rem'} flexDirection={'column'} className='items-center'>
      <Box w={'50vw'}>
        <Heading>{article.title}</Heading>
      </Box>
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps<
  {
    article: ArticleProps
  },
  {
    id: string
  }
> = async (ctx) => {
  const { id } = ctx.params!
  return {
    props: {
      article: {
        id,
        title: ' Test Title',
        synopsis: 'test synopsis',
        badges: ['badge1', 'badge2'],
      },
    },
  }
}

export default ArticlePage
