import { ArticleProps } from '@/types'
import { Heading, Flex, Badge, Box, Text } from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'

export const BlogItem = ({ article }: { article: ArticleProps }) => {
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
      <Link href={`/blog/${article.id}`}>
        <Heading fontSize={'lg'}>{article.title}</Heading>
      </Link>
      <Text color={'gray.400'}>{article.synopsis}</Text>
      <Text
        position={'absolute'}
        color={'gray.400'}
        bottom={'1rem'}
        right={'1rem'}
      >
        {article.author}
      </Text>
      {article.badges && (
        <Flex gap={'.5rem'} mt={'1rem'}>
          {article.badges.map((badge, idx) => {
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
