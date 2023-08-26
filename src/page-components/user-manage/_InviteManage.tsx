import { FC, useContext } from 'react'
import { UserContext } from './_UserAllInfoContext'
import {
  Button,
  Divider,
  Flex,
  IconButton,
  Text,
  Spacer,
  Tooltip,
  useToast,
} from '@chakra-ui/react'
import { useAxios } from '@/components/AxiosProvider'
import { InviteCode } from '@/types'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { CopyIcon } from '@chakra-ui/icons'

export const InviteManage = observer(() => {
  const user = useContext(UserContext)
  const axios = useAxios()
  const toast = useToast()
  return (
    <Flex
      flexDir={'column'}
      p={'1rem'}
      className='border rounded-xl'
      gap={'.5rem'}
    >
      <Flex>
        <Button
          colorScheme='green'
          onClick={() => {
            axios
              .post<InviteCode>('user/createInvitationCode')
              .then(({ data }) => {
                runInAction(() => {
                  user.invitations.push({
                    ...data,
                    createAt: new Date(data.createAt),
                    updateAt: new Date(data.updateAt),
                  })
                })
                toast({
                  title: '创建成功',
                  status: 'success',
                  isClosable: true,
                })
              })
          }}
        >
          新建
        </Button>
      </Flex>
      <Divider />
      <Flex flexDirection={'column'} gap={'.5rem'}>
        {user.invitations.map((val, idx) => {
          return (
            <Flex
              key={val.code}
              alignItems={'center'}
              gap={'.5rem'}
              className={`${
                idx < user.invitations.length - 1 ? 'border-b' : ''
              } p-1 rounded-md duration-300 hover:shadow-md hover:translate-x-1`}
            >
              <Text
                fontWeight={'bold'}
                color={val.user_id === null ? '' : 'gray'}
                onClick={() => {
                  if (val.user_id === null) {
                    return
                  }
                  console.log(val.user_id)
                }}
              >
                {val.code}
              </Text>
              <Tooltip label={val.user_id === null ? '拷贝' : '已使用'}>
                <IconButton
                  size={'sm'}
                  aria-label='copy'
                  variant={'ghost'}
                  disabled={true}
                  onClick={() => {
                    console.log(val)
                    console.log(val.user_id === null)
                    navigator.clipboard.writeText(val.code)
                    toast({
                      title: '复制成功',
                      status: 'success',
                      isClosable: true,
                    })
                  }}
                  isDisabled={val.user_id !== null}
                >
                  <CopyIcon />
                </IconButton>
              </Tooltip>
              {val.user_id !== null && (
                <>
                  <Tooltip label='使用者名称'>
                    <Text color={'gray'}>{val.user?.name}</Text>
                  </Tooltip>
                  <Tooltip label='使用时间'>
                    <Text color={'gray'}>{val.updateAt.toLocaleString()}</Text>
                  </Tooltip>
                </>
              )}
              <Spacer />
              <Tooltip label='创建时间'>
                <Text color={'gray'}>{val.createAt.toLocaleString()}</Text>
              </Tooltip>
            </Flex>
          )
        })}
      </Flex>
    </Flex>
  )
})
