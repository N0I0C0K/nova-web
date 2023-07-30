import { BlogItem } from '@/components/BlogItem'
import { MemberProps, ArticleProps } from '@/types'
import { Avatar, Flex, Heading, Text } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'

const MemberSpace: React.FC<{
  member: MemberProps
  memberArticles: ArticleProps[]
}> = ({ member, memberArticles }) => {
  return (
    <Flex pt={'5rem'} flexDirection={'column'} className='items-center'>
      <Avatar
        name={member.name}
        src={member.avatarUrl}
        size={'2xl'}
        pb={'1rem'}
      />
      <Heading>{member.name}</Heading>
      <Text color={'gray.400'}>{member.description}</Text>

      <Flex flexDirection={'column'} pt={'1rem'} gap={'1rem'}>
        {memberArticles.map((article) => (
          <BlogItem article={article} key={article.id} />
        ))}
      </Flex>
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps<
  {
    member: MemberProps
    memberArticles: ArticleProps[]
  },
  { name: string }
> = async (ctx) => {
  const { name } = ctx.params!
  return {
    props: {
      member: {
        id: 'member1',
        name: name,
        avatarUrl: 'https://i.pravatar.cc/300',
        description: 'test description',
        role: 'test role',
      },
      memberArticles: [
        {
          id: 'article1',
          title: ' Test Title',
          synopsis: 'test synopsis',
          badges: ['badge1', 'badge2'],
          author: name,
        },
        {
          id: 'article2',
          title: ' Test Title',
          synopsis: 'test synopsis',
          badges: ['badge1', 'badge2'],
          author: name,
        },
      ],
    },
  }
}

export default MemberSpace
