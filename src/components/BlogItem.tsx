import { ArticleProps } from '@/types'
import { Heading, Flex, Badge, Box, Text, ChakraProps } from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'

export const BlogItem = ({
  id,
  title,
  synopsis,
  authorName,
  badges,
  updateAt,
  sx,
}: {
  id: string
  title: string
  synopsis: string
  authorName: string
  badges?: string[]
  updateAt?: Date
  createAt?: Date
  sx?: ChakraProps
}) => {
  return (
    <Box
      className='rounded-lg p-10 shadow-md duration-300 hover:shadow-lg hover:scale-105'
      minW={'50rem'}
      maxW={'50rem'}
      pos={'relative'}
      sx={{
        _light: {
          bg: 'gray.50',
        },
        _dark: {
          bg: 'gray.700',
        },
        ...sx,
      }}
    >
      <Link href={`/blog/${id}`}>
        <Heading fontSize={'lg'}>{title}</Heading>
      </Link>
      <Text color={'gray.400'}>{synopsis}</Text>
      <Link href={`/member/${authorName}`}>
        <Text
          position={'absolute'}
          color={'gray.400'}
          bottom={'1rem'}
          right={'1rem'}
        >
          {authorName}
          {updateAt && ` - ${updateAt.toLocaleString()}`}
        </Text>
      </Link>
      {badges && badges.length > 0 && (
        <Flex gap={'.5rem'} mt={'1rem'}>
          {badges.map((badge, idx) => {
            return (
              <Badge key={idx} colorScheme={'green'} variant={'subtle'}>
                {badge}
              </Badge>
            )
          })}
        </Flex>
      )}
    </Box>
  )
}
