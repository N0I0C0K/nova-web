import { MemberProps } from '@/types'
import { Box, Flex, Heading } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'

const MemberCard: React.FC<MemberProps> = (member) => {
  return <Box></Box>
}

const MemberPage: React.FC<{
  members: MemberProps[]
}> = ({ members }) => {
  return (
    <Flex flexDirection={'column'} pt={'5rem'} className='items-center'>
      <Heading>Member</Heading>
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps<{
  members: MemberProps[]
}> = async (ctx) => {
  return {
    props: {
      members: [
        {
          id: 'member1',
          name: 'Test Name',
          avatar: 'https://i.pravatar.cc/300',
          description: 'test description',
          role: 'test role',
        },
      ],
    },
  }
}

export default MemberPage
