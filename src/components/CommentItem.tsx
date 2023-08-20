import { CommentProps, CommentWithUserProps } from '@/types'
import { Avatar, Box, Flex, Text } from '@chakra-ui/react'
import { FC } from 'react'

export const CommentItem: FC<{
  comment: CommentWithUserProps
}> = ({ comment }) => {
  return (
    <Flex
      p={'1rem'}
      className='border rounded-md'
      gap={'1rem'}
      pos={'relative'}
    >
      <Avatar name={comment.author.name} src={comment.author.avatarUrl ?? ''} />
      <Flex flexDir={'column'}>
        <Text color={'gray'}>{comment.author.name}</Text>
        <Text>{comment.content}</Text>
        <Text
          color={'gray'}
          fontSize={'smaller'}
          pos={'absolute'}
          bottom={'.5rem'}
          right={'1rem'}
        >
          {comment.createAt.toLocaleString()}
        </Text>
      </Flex>
    </Flex>
  )
}
