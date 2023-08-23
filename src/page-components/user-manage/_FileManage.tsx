import { useAxios } from '@/components/AxiosProvider'
import { MemberFile } from '@/types'
import { Button, Divider, Flex, Heading, Spacer, Text } from '@chakra-ui/react'
import { FC, useContext, useEffect, useState } from 'react'
import { UserContext } from './_UserAllInfoContext'

export const FileManage: FC = () => {
  const user = useContext(UserContext)
  return (
    <Flex
      flexDir={'column'}
      p={'1rem'}
      className='border rounded-xl'
      gap={'.5rem'}
    >
      {user.files.map((val, idx) => (
        <Flex
          key={val.id}
          className={`${idx < user.files.length - 1 ? 'border-b' : ''} p-2`}
        >
          <Text>{val.objectKey}</Text>
          <Spacer />
          <Text>{val.createAt.toLocaleString()}</Text>
        </Flex>
      ))}
    </Flex>
  )
}
