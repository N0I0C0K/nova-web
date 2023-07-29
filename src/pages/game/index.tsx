import { Link } from '@chakra-ui/next-js'
import { Flex, Heading, useColorMode } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'

const GamePage = () => {
  const { colorMode } = useColorMode()
  return (
    <Flex
      pt={'5rem'}
      className='items-center'
      flexDirection={'column'}
      gap={'3rem'}
    >
      <Heading>Games</Heading>
      <iframe
        src={`https://itch.io/embed/1366295?border_width=0&amp;${
          colorMode === 'dark' ? '&dark=true' : ''
        }`}
        width='550'
        height='165'
        className='shadow-lg'
      />
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  }
}

export default GamePage
