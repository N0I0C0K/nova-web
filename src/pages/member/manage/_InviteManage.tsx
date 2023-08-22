import { FC, useContext } from 'react'
import { UserContext } from './_UserAllInfoContext'
import { Button, Divider, Flex, Text, Toast } from '@chakra-ui/react'
import { useAxios } from '@/components/AxiosProvider'
import { InviteCode } from '@/types'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'

export const InviteManage = observer(() => {
  const user = useContext(UserContext)
  const axios = useAxios()
  return (
    <Flex
      flexDir={'column'}
      p={'1rem'}
      className='border rounded-xl'
      gap={'.5rem'}
    >
      <Flex>
        <Button
          onClick={() => {
            axios
              .post<InviteCode>('user/createInvitationCode')
              .then(({ data }) => {
                runInAction(() => {
                  user.invitations.push(data)
                })
                Toast({
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
        {user.invitations.map((val) => (
          <Flex key={val.id}>
            <Text fontWeight={'bold'}>{val.code}</Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
})
