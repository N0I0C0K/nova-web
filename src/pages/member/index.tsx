import { prisma } from '@/db'
import { MemberProps } from '@/types'
import { Link } from '@chakra-ui/next-js'
import { Avatar, Box, Flex, Heading, Image, Text } from '@chakra-ui/react'
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

function GroupColumn({ groupName }: { groupName: string }) {
  return (
    <Flex
      flexDir={'column'}
      className='rounded-lg p-3 items-center justify-center duration-500 group hover:w-72 '
      w={'10rem'}
      pos={'relative'}
      shadow={'lg'}
    >
      <Heading color={'white'}>{groupName}</Heading>
      <Image
        alt='back'
        src='https://nova-1257272505.cos.ap-guangzhou.myqcloud.com/Join.png'
        pos={'absolute'}
        zIndex={-1}
        height={'100%'}
        width={'100%'}
        objectFit={'cover'}
        rounded={'md'}
        className='brightness-90'
      />
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
      <Flex gap={'1rem'} h={'80vh'}>
        <GroupColumn groupName='策划' />
        <GroupColumn groupName='程序' />
        <GroupColumn groupName='美术' />
      </Flex>
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps<{
  members: MemberProps[]
}> = async (ctx) => {
  const users = await prisma.user.findMany({
    include: {
      group: true,
    },
  })
  return {
    props: {
      members: users,
    },
  }
}

export default MemberPage
