import { ArticleProps } from '@/types'
import { Box, Flex, Heading } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import fs from 'fs'
import CustomRenderer from '@/components/markdown/CustomRenderer'

const ArticlePage: FC<{
  article: ArticleProps
  content: string
}> = ({ article, content }) => {
  return (
    <Flex pt={'5rem'} flexDirection={'column'} className='items-center'>
      <Box w={'50vw'}>
        <Heading>{article.title}</Heading>
        <ReactMarkdown
          components={CustomRenderer()}
          remarkPlugins={[remarkGfm]}
        >
          {content}
        </ReactMarkdown>
      </Box>
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps<
  {
    article: ArticleProps
    content: string
  },
  {
    id: string
  }
> = async (ctx) => {
  const { id } = ctx.params!
  const fileContent = fs.readFileSync('./README.md', 'utf-8')
  return {
    props: {
      article: {
        id,
        title: ' Test Title',
        synopsis: 'test synopsis',
        badges: ['badge1', 'badge2'],
        author: 'nick',
      },
      content: fileContent,
    },
  }
}

export default ArticlePage
