import { FC, useContext } from 'react'
import { UserContext } from './_UserAllInfoContext'
import { Button, Divider, Flex, Text } from '@chakra-ui/react'

export function InviteManage() {
  const user = useContext(UserContext)
  return (
    <Flex
      flexDir={'column'}
      p={'1rem'}
      className='border rounded-xl'
      gap={'.5rem'}
    >
      <Flex>
        <Button>新建</Button>
      </Flex>
      <Divider />
      <Flex>
        {user.invitations.map((val) => (
          <Flex key={val.id}>
            <Text fontWeight={'bold'}>{val.code}</Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}
