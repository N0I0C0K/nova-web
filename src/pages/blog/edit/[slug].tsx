import CustomRenderer from '@/components/markdown/CustomRenderer'
import { prisma } from '@/db'
import { options } from '@/pages/api/auth/[...nextauth]'
import { ArticleWithContent } from '@/types'
import {
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Spacer,
  Textarea,
  useColorMode,
} from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'
import { FC, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
import remarkGfm from 'remark-gfm'
import {
  oneDark as codedark,
  oneLight as codelight,
} from 'react-syntax-highlighter/dist/cjs/styles/prism'
import EditCode from '@/components/EditableCodeTextare'

const BlogEditPage: FC<{
  post: ArticleWithContent
}> = ({ post }) => {
  const [text, setText] = useState(post.content.content)
  const mode = useColorMode()
  return (
    <Box pt={'5rem'}>
      {/* <Editable value={post.title}>
        <EditablePreview fontSize={'2xl'} fontWeight={'bold'} />
        <EditableInput />
      </Editable>
      <Editable value={post.synopsis}>
        <EditablePreview />
        <EditableInput />
      </Editable> */}
      <Flex w='100%' flexDir='row'>
        <Box w={'50%'} h={'40rem'} overflow={'scroll'} borderRadius={'xl'}>
          <EditCode
            value={text}
            language='md'
            data-color-mode={mode.colorMode}
            style={{
              fontSize: '1rem',
              fontFamily: 'monospace',
            }}
            onChange={(e) => {
              setText(e.target.value)
            }}
          />
          {/* <Textarea
            value={text}
            h={'40rem'}
            onKeyDown={(e) => {
              if (e.keyCode === 9) {
                e.preventDefault()
                return
              }
            }}
            onChange={(e) => {
              setText(e.target.value)
            }}
          /> */}
        </Box>
        <Box
          p='2rem'
          h={'40rem'}
          w={'50%'}
          overflow={'scroll'}
          className='border rounded-md'
          ml={'.5rem'}
        >
          <ReactMarkdown
            components={CustomRenderer()}
            remarkPlugins={[remarkGfm]}
          >
            {text}
          </ReactMarkdown>
        </Box>
      </Flex>
      <Flex mt='1rem' gap={'.5rem'}>
        <Spacer />
        <Button>保存</Button>
        <Button>取消</Button>
      </Flex>
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps<
  {
    post: ArticleWithContent
  },
  { slug: string }
> = async (ctx) => {
  const sess = await getServerSession(ctx.req, ctx.res, options)
  if (!sess) {
    return {
      notFound: true,
    }
  }
  console.log(sess)

  const { id: user_id } = sess as unknown as { id: string }
  const { slug } = ctx.params!
  const post = await prisma.post.findFirst({
    where: {
      slug,
      user_id,
    },
    include: {
      content: true,
    },
  })
  if (!post) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      post: {
        ...post,
        content: post.content!,
      },
    },
  }
}

export default BlogEditPage
