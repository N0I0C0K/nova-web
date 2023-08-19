import CustomRenderer from '@/components/markdown/CustomRenderer'
import { prisma } from '@/db'
import { options } from '@/pages/api/auth/[...nextauth]'
import { ArticleWithContent } from '@/types'
import {
  Box,
  Button,
  Flex,
  IconButton,
  Spacer,
  useColorMode,
  useToast,
} from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import EditCode, { SelectionText } from '@/components/EditableCodeTextare'
import { useAxios } from '@/components/AxiosProvider'
import { useRouter } from 'next/router'
import { useGlobalLayoutProps } from '@/components/GlobalHeaderProvider'
import { RefreshIcon } from '@/components/Icons'

const BlogEditPage: FC<{
  post: ArticleWithContent
}> = ({ post }) => {
  const [text, setText] = useState(post.content.content)
  const editerRef = useRef<HTMLDivElement>(null)
  const showRef = useRef<HTMLDivElement>(null)
  const mode = useColorMode()
  const axios = useAxios()
  const toast = useToast()
  const router = useRouter()
  const [markdownKey, setMarkdownKey] = useState(0)
  const [layoutProps, setLayoutProps, reset] = useGlobalLayoutProps()
  const textRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    setLayoutProps({
      ...layoutProps,
      showHead: false,
      showFooter: false,
      gloablBoxProps: {
        p: '2rem',
        h: '100vh',
      },
    })
    return () => {
      reset()
    }
  }, [])
  return (
    <Box h={'100%'}>
      <Flex h={'100%'} w='100%' flexDir='row' gap={'.5rem'}>
        <Flex gap={'.5rem'} flexDir={'column'}>
          <Button
            onClick={() => {
              axios
                .post('/post/modify', {
                  postSlug: post.slug,
                  content: text,
                  title: post.title,
                  synopsis: post.synopsis,
                })
                .then(({ data, status }) => {
                  toast({
                    title: 'Modify success',
                    status: 'success',
                    isClosable: true,
                  })
                  router.push(`/blog/${post.slug}`)
                })
                .catch((err) => {
                  toast({
                    title: 'Modify failed',
                    description: err,
                    status: 'error',
                    isClosable: true,
                  })
                })
            }}
          >
            保存
          </Button>
          <Button
            onClick={() => {
              router.back()
            }}
          >
            取消
          </Button>
        </Flex>
        <Box
          w={'50%'}
          h={'100%'}
          minH={'100%'}
          maxH={'100%'}
          overflow={'scroll'}
          overflowX={'hidden'}
          borderRadius={'xl'}
          onScroll={(e) => {
            const sourceElement = editerRef.current
            const targetElement = showRef.current

            if (sourceElement && targetElement) {
              const scrollPercentage =
                (sourceElement.scrollTop /
                  (sourceElement.scrollHeight - sourceElement.clientHeight)) *
                100
              const targetScrollPosition =
                (targetElement.scrollHeight - targetElement.clientHeight) *
                (scrollPercentage / 100)
              targetElement.scrollTop = targetScrollPosition
            }
          }}
          ref={editerRef}
          onDrop={async (event) => {
            event.preventDefault()
            const file = event.dataTransfer.files[0]
            const filereader = new FileReader()
            const getUplaodUrl = await axios.post<{
              url: string
              filename: string
              fileurl: string
            }>('/cos/uploadUrl', {
              filename: file.name,
              filetype: file.type,
            })

            const { url: uploadUrl, filename, fileurl } = getUplaodUrl.data
            console.log(uploadUrl)

            filereader.onload = (e) => {
              if (file.type.startsWith('image')) {
                const textApi = new SelectionText(textRef.current!)
                textApi!.insertText(`![${filename}](${fileurl})`)
                textApi!.notifyChange()
                axios
                  .put(uploadUrl, e.target?.result, {
                    headers: {
                      'Content-Type': file.type,
                    },
                    timeout: 60 * 1000,
                  })
                  .then((res: any) => {
                    setMarkdownKey(markdownKey + 1)
                  })
              } else if (file.type.startsWith('text')) {
                axios
                  .put(uploadUrl, e.target?.result, {
                    headers: {
                      'Content-Type': file.type,
                    },
                  })
                  .then((res) => {
                    console.log(res)
                  })
              }
            }
            filereader.readAsArrayBuffer(file)
          }}
          onDragEnd={(ev) => {
            ev.preventDefault()
          }}
          onDragEnter={(ev) => {
            ev.preventDefault()
          }}
        >
          <EditCode
            value={text}
            ref={textRef}
            language='md'
            data-color-mode={mode.colorMode}
            style={{
              fontSize: '1rem',
              fontFamily: 'monospace',
              minHeight: '100%',
            }}
            onChange={(e) => {
              setText(e.target.value)
            }}
          />
        </Box>
        <Box
          px={'2rem'}
          maxH={'100%'}
          w={'50%'}
          pos={'relative'}
          overflowY={'scroll'}
          overflowX={'hidden'}
          className='border rounded-md'
          ref={showRef}
        >
          <IconButton
            aria-label='refrush'
            pos={'absolute'}
            top={'1rem'}
            right={'1rem'}
            onClick={() => {
              setMarkdownKey(markdownKey + 1)
            }}
          >
            <RefreshIcon />
          </IconButton>
          <ReactMarkdown
            components={CustomRenderer()}
            remarkPlugins={[remarkGfm]}
            key={markdownKey}
          >
            {text}
          </ReactMarkdown>
        </Box>
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
