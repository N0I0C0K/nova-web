import { BlogItem } from '@/components/BlogItem'
import { prisma } from '@/db'
import { MemberProps, ArticleProps } from '@/types'
import { Avatar, Flex, Heading, Text } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'

const MemberSpace: React.FC<{
  member: MemberProps & { posts: ArticleProps[] }
}> = ({ member }) => {
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
        {member.posts.map((it) => (
          <BlogItem
            authorName={member.name}
            id={it.slug}
            synopsis={it.synopsis}
            title={it.title}
            badges={it.badges}
            key={it.slug}
          />
        ))}
      </Flex>
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps<
  {
    member: MemberProps & { posts: ArticleProps[] }
  },
  { name: string }
> = async (ctx) => {
  const { name } = ctx.params!
  const member = await prisma.user.findFirst({
    where: {
      name: name,
    },
    include: {
      posts: true,
    },
  })
  if (!member) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      member,
    },
  }
}

export default MemberSpace
