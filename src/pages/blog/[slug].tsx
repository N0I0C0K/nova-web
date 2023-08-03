import { ArticleContentProps, ArticleProps } from '@/types'
import { Box, Flex, Heading } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import fs from 'fs'
import CustomRenderer from '@/components/markdown/CustomRenderer'
import { prisma } from '@/db'

const ArticlePage: FC<{
  post: ArticleContentProps
}> = ({ post }) => {
  return (
    <Flex pt={'5rem'} flexDirection={'column'} className='items-center'>
      <Box w={'50vw'}>
        <Heading>{post.title}</Heading>
        <ReactMarkdown
          components={CustomRenderer()}
          remarkPlugins={[remarkGfm]}
        >
          {post.content.content}
        </ReactMarkdown>
      </Box>
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
      comments: true,
    },
  })
  if (!post) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      post,
    },
  }
}

export default ArticlePage
