import { useAxios } from '@/components/AxiosProvider'
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
} from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { GetServerSideProps } from 'next'
import { useSession, signIn, getCsrfToken } from 'next-auth/react'

const LoginPage = () => {
  const sess = useSession()
  const axios = useAxios()
  return (
    <Flex
      flexDir={'column'}
      pt={'5rem'}
      className='items-center justify-center'
    >
      <Heading mb={'3rem'}>Login</Heading>
      {sess.status === 'authenticated' && (
        <Text>{`你已经以 ${sess.data?.user?.name} 的身份登录`}</Text>
      )}
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        onSubmit={async (val) => {
          console.log(val)
          const csrfToken = await getCsrfToken()
          const res = await axios!.post('/auth/callback/account', {
            csrfToken,
            username: val.username,
            password: val.password,
          })
          console.log(res)
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit }) => (
          <>
            <Form onSubmit={handleSubmit} className='flex flex-col gap-5 w-72'>
              <FormControl>
                <FormLabel>Username:</FormLabel>
                <Input
                  value={values.username}
                  name='username'
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Password:</FormLabel>
                <Input
                  type='password'
                  value={values.password}
                  name='password'
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormControl>
              <Button mt={'2rem'} colorScheme='blue' type='submit'>
                login
              </Button>
            </Form>
          </>
        )}
      </Formik>
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  }
}

export default LoginPage
