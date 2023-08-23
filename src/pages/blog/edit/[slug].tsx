import CustomRenderer from '@/components/markdown/CustomRenderer'
import { prisma } from '@/db'
import { options } from '@/pages/api/auth/[...nextauth]'
import { ArticleProps, ArticleWithContent } from '@/types'
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Tooltip,
  useBoolean,
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
import { CancelIcon, InfoIcon, RefreshIcon, SaveIcon } from '@/components/Icons'
import { UploadFile } from '@/utils/front'
import { Form, Formik } from 'formik'
import { HelpMarkDownText } from '@/page-components/edit/_help'

function HelpModal({ open, onClose }: { open: boolean; onClose: () => any }) {
  return (
    <Modal isOpen={open} onClose={onClose} scrollBehavior='inside' size={'xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Markdown 语法</ModalHeader>
        <ModalBody>
          <ReactMarkdown
            components={CustomRenderer()}
            remarkPlugins={[remarkGfm]}
          >
            {HelpMarkDownText}
          </ReactMarkdown>
        </ModalBody>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  )
}

const BlogEditPage: FC<{
  post?: ArticleWithContent
}> = ({ post }) => {
  const [text, setText] = useState(post?.content.content ?? '')
  const editerRef = useRef<HTMLDivElement>(null)
  const showRef = useRef<HTMLDivElement>(null)
  const mode = useColorMode()
  const axios = useAxios()
  const toast = useToast()
  const router = useRouter()
  const [markdownKey, setMarkdownKey] = useState(0)
  const [layoutProps, setLayoutProps, reset] = useGlobalLayoutProps()
  const textRef = useRef<HTMLTextAreaElement>(null)
  const [open, setOpen] = useState(false)
  const [helpOpen, help] = useBoolean()
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
      <Flex h={'100%'} w='100%' flexDir='row' gap={'.5rem'} pb={'2rem'}>
        <Flex
          gap={'.5rem'}
          flexDir={'row'}
          pos={'fixed'}
          bottom={'1rem'}
          left={'1rem'}
          zIndex={1}
        >
          <Tooltip label='保存文章'>
            <IconButton
              aria-label='save'
              colorScheme='blue'
              isRound
              onClick={() => {
                setOpen(true)
              }}
            >
              <SaveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip label='取消'>
            <IconButton
              colorScheme='red'
              aria-label='cancel'
              isRound
              onClick={() => {
                router.back()
              }}
            >
              <CancelIcon />
            </IconButton>
          </Tooltip>
          <Tooltip label='帮助'>
            <IconButton aria-label='help' isRound onClick={help.on}>
              <InfoIcon />
            </IconButton>
          </Tooltip>
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
            const textApi = new SelectionText(textRef.current!)
            const { filename, fileurl } = await UploadFile(axios, file, () => {
              setMarkdownKey(markdownKey + 1)
            })
            textApi!.insertText(`![${filename}](${fileurl})`)
            textApi!.notifyChange()
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
            padding={20}
            style={{
              fontSize: '1rem',
              fontFamily:
                'ui-monospace,"SFMono-Regular","SF Mono","Menlo","Consolas","Liberation Mono",monospace',
              minHeight: '100%',
            }}
            onPaste={(e) => {
              console.log(e)
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
      <Modal
        isOpen={open}
        onClose={() => {
          setOpen(false)
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>设置文章属性</ModalHeader>
          <ModalBody>
            <Formik
              initialValues={{
                title: post?.title ?? '',
                synopsis: post?.synopsis ?? '',
                bages: post?.badges ?? [],
              }}
              onSubmit={(val) => {
                console.log(val)
                if (post) {
                  axios
                    .post('/post/modify', {
                      postSlug: post.slug,
                      content: text,
                      title: val.title,
                      synopsis: val.synopsis,
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
                        description: err.message,
                        status: 'error',
                        isClosable: true,
                      })
                    })
                } else {
                  axios
                    .post<ArticleProps>('/post/new', {
                      title: val.title,
                      synopsis: val.synopsis,
                      content: text,
                    })
                    .then(({ data }) => {
                      console.log(data)
                      router.push(`/blog/${data.slug}`)
                    })
                    .catch((err) => {
                      toast({
                        title: 'Create failed',
                        description: err.message,
                        status: 'error',
                        isClosable: true,
                      })
                    })
                }
              }}
            >
              {({ values, handleBlur, handleChange, handleSubmit }) => {
                return (
                  <Form onSubmit={handleSubmit}>
                    <Flex flexDir={'column'} gap={'1rem'}>
                      <FormControl>
                        <FormLabel>标题</FormLabel>
                        <Input
                          name='title'
                          value={values.title}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>简介</FormLabel>
                        <Input
                          name='synopsis'
                          value={values.synopsis}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </FormControl>
                      <Flex gap={'.5rem'}>
                        <Spacer />
                        <Button colorScheme='blue' type='submit'>
                          提交
                        </Button>
                        <Button
                          onClick={() => {
                            setOpen(false)
                          }}
                        >
                          取消
                        </Button>
                      </Flex>
                    </Flex>
                  </Form>
                )
              }}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
      <HelpModal open={helpOpen} onClose={help.off} />
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps<
  {
    post?: ArticleWithContent
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
  if (slug === 'new') {
    return {
      props: {},
    }
  }
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
