import { ArticleProps } from '@/types'
import { Heading, Flex, Badge, Box, Text } from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'

export const BlogItem = ({
  id,
  title,
  synopsis,
  authorName,
  badges,
  updateAt,
}: {
  id: string
  title: string
  synopsis: string
  authorName: string
  badges?: string[]
  updateAt?: Date
  createAt?: Date
}) => {
  return (
    <Box
      className='rounded-lg p-10 shadow-md duration-300 hover:shadow-lg hover:scale-105'
      minW={'50rem'}
      pos={'relative'}
      sx={{
        _light: {
          bg: 'gray.50',
        },
        _dark: {
          bg: 'gray.700',
        },
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
          {updateAt && ` - ${updateAt.toLocaleDateString()}`}
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
