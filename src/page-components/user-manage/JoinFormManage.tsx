import { useAxios } from '@/components/AxiosProvider'
import { JoinFormProps } from '@/types'
import {
  Button,
  Divider,
  Flex,
  Spacer,
  Text,
  Textarea,
  Tooltip,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export function JoinFormManage() {
  const [joinFormList, setJoinList] = useState<JoinFormProps[]>([])
  const axios = useAxios()
  useEffect(() => {
    axios
      .get<{
        joinList: JoinFormProps[]
      }>('/form/joinlist')
      .then((res) => setJoinList(res.data.joinList))
  }, [])
  return (
    <Flex
      flexDir={'column'}
      p={'1rem'}
      className='border rounded-xl'
      gap={'.5rem'}
    >
      {joinFormList.map((item, idx) => (
        <>
          <Flex
            key={item.id}
            className='rounded-md p-3'
            flexDir={'column'}
            gap={'1rem'}
          >
            <Flex alignItems={'center'} gap={'1rem'}>
              <Text fontWeight={'bold'} fontSize={'lg'}>
                {item.name}
              </Text>
              <Spacer />
              <Tooltip label={'点击复制'}>
                <Button
                  size={'sm'}
                  variant={'ghost'}
                  colorScheme='blue'
                  onClick={() => {
                    navigator.clipboard.writeText(item.qq)
                  }}
                >
                  QQ: {item.qq}
                </Button>
              </Tooltip>
              <Tooltip label={'点击复制'}>
                <Button
                  size={'sm'}
                  variant={'ghost'}
                  colorScheme='green'
                  onClick={() => {
                    navigator.clipboard.writeText(item.phone)
                  }}
                >
                  手机: {item.phone}
                </Button>
              </Tooltip>
              <Tooltip label={'点击复制'}>
                <Button
                  size={'sm'}
                  variant={'ghost'}
                  colorScheme='facebook'
                  onClick={() => {
                    navigator.clipboard.writeText(item.email)
                  }}
                >
                  邮箱: {item.email}
                </Button>
              </Tooltip>
            </Flex>
            <Textarea
              variant={'filled'}
              color={'gray'}
              isReadOnly
              minH={'6rem'}
              value={item.introduction}
            />

            <Flex>
              <Spacer />
              <Tooltip label='最后修改时间'>
                <Text color={'gray'}>
                  {new Date(item.updateAt).toLocaleString()}
                </Text>
              </Tooltip>
              -
              <Tooltip label='创建时间'>
                <Text color={'gray'}>
                  {new Date(item.createAt).toLocaleString()}
                </Text>
              </Tooltip>
            </Flex>
          </Flex>
          {idx !== joinFormList.length - 1 && <Divider />}
        </>
      ))}
    </Flex>
  )
}
