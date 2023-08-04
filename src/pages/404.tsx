import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'

const NotFoundPage = () => {
  return (
    <Flex flexDir={'column'} className='items-center'>
      <Flex
        w={'50rem'}
        minH={'100vh'}
        flexDir={'column'}
        gap={'.5rem'}
        className='items-center justify-center'
      >
        <Text fontSize={'8xl'}>Oops!</Text>
        <Text color={'gray'}>你要找的东西好像没有在这个星球上...</Text>
        <Button
          colorScheme='orange'
          mt={'2rem'}
          onClick={() => {
            window.history.back()
          }}
        >
          返回上一级
        </Button>
      </Flex>
    </Flex>
  )
}

export default NotFoundPage
