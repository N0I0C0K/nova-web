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
  useToast,
} from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { GetServerSideProps } from 'next'
import { useSession, signIn, getCsrfToken } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { MD5 } from 'crypto-js'
import { Link } from '@chakra-ui/next-js'

const LoginPage = () => {
  const sess = useSession()
  const axios = useAxios()
  const router = useRouter()
  const err = useMemo(() => {
    return router.query.error
  }, [router])
  const toast = useToast()
  useEffect(() => {
    if (err) {
      toast({
        title: '登录失败',
        description: '请检查用户名和密码是否正确',
        status: 'error',
        duration: 10000,
        isClosable: true,
      })
    }
  }, [err, toast])
  return (
    <Flex
      flexDir={'column'}
      pt={'5rem'}
      className='items-center justify-center'
    >
      <Heading mb={'3rem'}>Login</Heading>
      {sess.status === 'authenticated' ? (
        <Text
          color={'gray'}
        >{`你已经以 ${sess.data?.user?.name} 的身份登录`}</Text>
      ) : (
        <>
          <Formik
            initialValues={{
              username: '',
              password: '',
            }}
            onSubmit={async (val) => {
              console.log(val)
              const salt = await axios.get<{
                salt: string
              }>('/user/salt', {
                params: {
                  username: val.username,
                },
              })
              const csrfToken = await getCsrfToken()
              const res = await axios.post('/auth/callback/account', {
                csrfToken,
                username: val.username,
                password: MD5(`${val.password}${salt.data.salt}`).toString(),
              })
              window.location.href = res.request?.responseURL
            }}
          >
            {({ values, handleChange, handleBlur, handleSubmit }) => (
              <>
                <Form
                  onSubmit={handleSubmit}
                  className='flex flex-col gap-5 w-72'
                >
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
          <Link mt={'1rem'} href={'/register'}>
            <Text color={'gray'}>Register</Text>
          </Link>
        </>
      )}
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  }
}

export default LoginPage
