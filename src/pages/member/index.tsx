import { prisma } from '@/db'
import { MemberProps } from '@/types'
import { Link } from '@chakra-ui/next-js'
import { Avatar, Box, Flex, Heading, Text } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'

const MemberCard: React.FC<MemberProps> = (member) => {
  return (
    <Flex
      className='shadow-md rounded-lg p-4'
      width={'20rem'}
      _dark={{}}
      gap={'1rem'}
      sx={{
        _light: {
          bg: 'gray.50',
        },
        _dark: {
          bg: 'gray.700',
        },
      }}
    >
      <Avatar name={member.name} src={member.avatarUrl ?? ''} size={'lg'} />
      <Flex flexDir={'column'}>
        <Link href={`/member/${member.name}`}>
          <Text fontSize={'2xl'}>{member.name}</Text>
        </Link>
        <Text color={'gray.400'}>{member.role}</Text>
      </Flex>
    </Flex>
  )
}

const MemberPage: React.FC<{
  members: MemberProps[]
}> = ({ members }) => {
  return (
    <Flex
      flexDirection={'column'}
      pt={'5rem'}
      className='items-center'
      gap={'2rem'}
    >
      <Heading>Member</Heading>
      {members.map((member) => (
        <MemberCard {...member} key={member.id} />
      ))}
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps<{
  members: MemberProps[]
}> = async (ctx) => {
  const users = await prisma.user.findMany()
  return {
    props: {
      members: users.map((val) => ({
        id: val.id,
        name: val.name,
        description: val.description,
        role: val.role,
        avatarUrl: `https://i.pravatar.cc/300?id=${val.id}`,
      })),
    },
  }
}

export default MemberPage
