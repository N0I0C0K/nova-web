import {
  Center,
  Divider,
  Flex,
  Highlight,
  Input,
  Kbd,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAxios } from '../AxiosProvider'
import { ArticleProps } from '@/types'
import { Link } from '@chakra-ui/next-js'

const searchContext = createContext<
  [SearchInter, React.Dispatch<React.SetStateAction<SearchInter>>]
>(undefined as any)

export interface SearchInter {
  isShow: boolean
}

const defaultSearchProps: SearchInter = {
  isShow: false,
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchState, setState] = useState<SearchInter>(defaultSearchProps)
  const [text, setText] = useState('')
  const axios = useAxios()
  const [result, setResult] = useState<
    {
      title: string
      subTitle: string
      url: string
    }[]
  >([])
  useEffect(() => {
    setText('')
    setResult([])
  }, [searchState.isShow])
  const hightLightQuery = useMemo(() => {
    return text.split(' ')
  }, [result])
  const search = (s: string) => {
    if (text.length === 0) return
    setResult([])
    axios
      .post<{
        posts: ArticleProps[]
      }>('/post/search', {
        titleInclude: s,
      })
      .then(({ data }) => {
        if (data.posts.length > 0) {
          setResult((pre) => [
            ...pre,
            ...data.posts.map((post) => ({
              title: post.title,
              subTitle: post.synopsis,
              url: `/blog/${post.slug}`,
            })),
          ])
        } else {
          setResult((pre) => [
            ...pre,
            {
              title: '没有找到相关文章',
              subTitle: '尝试切换关键字',
              url: '',
            },
          ])
        }
      })
  }
  const close = () => {
    setState((val) => ({
      ...val,
      isShow: false,
    }))
  }
  return (
    <searchContext.Provider value={[searchState, setState]}>
      {children}
      <Modal
        isOpen={searchState.isShow}
        onClose={() => {
          setState({
            isShow: false,
          })
        }}
        size={'lg'}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>搜索</ModalHeader>
          <ModalBody>
            <Flex flexDir={'column'} gap={'.5rem'}>
              <Input
                autoFocus={true}
                placeholder='search any thing'
                value={text}
                onChange={(e) => {
                  setText(e.target.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    search(text)
                  }
                }}
              />
              {result.length > 0 ? (
                <>
                  <Divider />
                  <Flex
                    flexDir={'column'}
                    overflow={'scroll'}
                    gap={'.5rem'}
                    h={'30rem'}
                  >
                    {result.map((val, idx) => (
                      <Flex key={idx} className='border rounded-md p-2'>
                        <Flex flexDir={'column'}>
                          <Link href={val.url} onClick={close}>
                            <Text fontWeight={'bold'} fontSize={'lg'}>
                              <Highlight
                                query={hightLightQuery}
                                styles={{
                                  px: 1,
                                  bgColor: 'orange.400',
                                  display: 'inline',
                                }}
                              >
                                {val.title}
                              </Highlight>
                            </Text>
                          </Link>
                          <Text textColor={'gray'}>
                            <Highlight
                              query={hightLightQuery}
                              styles={{
                                px: 1,
                                bgColor: 'orange.400',
                                display: 'inline',
                              }}
                            >
                              {val.subTitle}
                            </Highlight>
                          </Text>
                        </Flex>
                      </Flex>
                    ))}
                  </Flex>
                </>
              ) : (
                <>
                  <Center>
                    <Text>
                      <Kbd>Enter</Kbd> {'to search'}
                    </Text>
                  </Center>
                </>
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </searchContext.Provider>
  )
}

export function useSearchModal(): {
  show: () => void
  close: () => void
} {
  const [searchState, setSearch] = useContext(searchContext)
  return {
    show() {
      setSearch((val) => ({
        ...val,
        isShow: true,
      }))
    },
    close() {
      setSearch((val) => ({
        ...val,
        isShow: false,
      }))
    },
  }
}
