import { BlogItem } from '@/components/BlogItem'
import { prisma } from '@/db'
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
        src={member.avatarUrl ?? ''}
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
  const member = await prisma.user.findFirst({
    where: {
      name: name,
    },
  })
  if (!member) {
    return {
      notFound: true,
    }
  }
  const articles = await prisma.post.findMany({
    where: {
      user_id: member.id,
    },
  })
  return {
    props: {
      member,
      memberArticles: articles,
    },
  }
}

export default MemberSpace
