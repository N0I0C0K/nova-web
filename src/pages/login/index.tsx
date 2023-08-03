import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from '@chakra-ui/react'
import { GetServerSideProps } from 'next'

const LoginPage = () => {
  return (
    <Flex
      flexDir={'column'}
      pt={'5rem'}
      className='items-center justify-center'
    >
      <Heading mb={'3rem'}>Login</Heading>
      <Flex w={'20rem'} flexDir={'column'} gap={'1rem'}>
        <FormControl>
          <FormLabel>Username:</FormLabel>
          <Input />
        </FormControl>
        <FormControl>
          <FormLabel>Password:</FormLabel>
          <Input type='password' />
        </FormControl>
        <Button mt={'2rem'} colorScheme='blue'>
          login
        </Button>
      </Flex>
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  }
}

export default LoginPage
