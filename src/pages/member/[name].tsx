import { BlogItem } from '@/components/BlogItem'
import { EditIcon } from '@/components/Icons'
import { prisma } from '@/db'
import { MemberProps, ArticleProps } from '@/types'
import {
  Avatar,
  ChakraProps,
  Flex,
  Heading,
  IconButton,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { useSession } from 'next-auth/react'

const MemberTools: React.FC<{
  sx?: ChakraProps
}> = ({ sx }) => {
  return (
    <Flex {...sx}>
      <Tooltip label='修改账户属性'>
        <IconButton aria-label='edit'>
          <EditIcon />
        </IconButton>
      </Tooltip>
    </Flex>
  )
}

const MemberSpace: React.FC<{
  member: MemberProps & { posts: ArticleProps[] }
}> = ({ member }) => {
  const sess = useSession()
  return (
    <Flex
      pt={'5rem'}
      flexDirection={'column'}
      className='items-center'
      pos={'relative'}
    >
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
            createAt={it.createAt}
            updateAt={it.updateAt}
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
