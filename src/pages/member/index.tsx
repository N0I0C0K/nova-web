import { prisma } from '@/db'
import { MemberProps } from '@/types'
import { Link } from '@chakra-ui/next-js'
import { Avatar, Box, Flex, Heading, Image, Text } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'

const MemberCard: React.FC<{ member: MemberProps }> = ({ member }) => {
  return (
    <Flex
      className='shadow-md rounded-lg p-4 bg-opacity-5'
      alignItems={'center'}
      width={'auto'}
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
      <Avatar name={member.name} src={member.avatarUrl ?? ''} size={'md'} />
      <Flex flexDir={'column'}>
        <Link href={`/member/${member.name}`}>
          <Text fontSize={'2xl'}>{member.name}</Text>
        </Link>
        <Text color={'gray.400'}>{member.role}</Text>
      </Flex>
    </Flex>
  )
}

function GroupColumn({
  groupName,
  members,
}: {
  groupName: string
  members: MemberProps[]
}) {
  return (
    <Flex
      flexDir={'column'}
      className='rounded-lg shadow-lg items-center duration-500 group hover:w-96 cursor-pointer'
      w={'10rem'}
      h={'auto'}
      pos={'relative'}
      shadow={'lg'}
    >
      <Heading color={'white'} mt={'1rem'}>
        {groupName}
      </Heading>
      <Box
        className='opacity-0 delay-200 mt-96 duration-500  group-hover:block group-hover:opacity-100 group-hover:mt-4'
        height={'80%'}
        overflowY={'scroll'}
      >
        <Flex flexDir={'column'} gap={'.5rem'}>
          {members.map((val) => (
            <MemberCard member={val} key={val.id} />
          ))}
        </Flex>
      </Box>
      <Image
        alt='back'
        src='https://nova-1257272505.cos.ap-guangzhou.myqcloud.com/Join.png'
        pos={'absolute'}
        zIndex={-1}
        height={'100%'}
        width={'100%'}
        objectFit={'cover'}
        rounded={'md'}
        className='brightness-50 duration-500 group-hover:brightness-90'
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
        <GroupColumn
          groupName='策划'
          members={members.filter((val) => val.role === 'GameDesigner')}
        />
        <GroupColumn
          groupName='程序'
          members={members.filter((val) => val.role === 'Programer')}
        />
        <GroupColumn
          groupName='美术'
          members={members.filter((val) => val.role === 'ArtDesigner')}
        />
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
