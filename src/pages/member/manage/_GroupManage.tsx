import { useContext } from 'react'
import { UserContext } from './_UserAllInfoContext'
import { Divider, Flex, Text } from '@chakra-ui/react'

export function GroupManage() {
  const user = useContext(UserContext)
  return (
    <Flex
      p={'1rem'}
      className='border rounded-xl'
      flexDir={'column'}
      gap={'1rem'}
    >
      <Divider />
      <Text fontSize={'xl'} fontWeight={'extrabold'}>
        加入的小组：
      </Text>
      <Flex
        flexDir={'row'}
        p={'1rem'}
        border={'ActiveBorder'}
        rounded={'md'}
      ></Flex>
      <Divider />
    </Flex>
  )
}
