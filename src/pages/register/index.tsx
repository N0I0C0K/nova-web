import { useAxios } from '@/components/AxiosProvider'
import { MemberProps } from '@/types'
import {
  useToast,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
} from '@chakra-ui/react'
import { AxiosError } from 'axios'
import { MD5 } from 'crypto-js'
import { Formik, Form } from 'formik'
import { GetServerSideProps } from 'next'
import { useSession, getCsrfToken } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useMemo, useEffect } from 'react'

const RegisterPage = () => {
  const sess = useSession()
  const axios = useAxios()
  const router = useRouter()
  const toast = useToast()
  return (
    <Flex
      flexDir={'column'}
      pt={'5rem'}
      className='items-center justify-center'
    >
      <Heading mb={'3rem'}>Register</Heading>
      {sess.status === 'authenticated' ? (
        <Text
          color={'gray'}
        >{`你已经以 ${sess.data?.user?.name} 的身份登录`}</Text>
      ) : (
        <Formik
          initialValues={{
            name: '',
            password: '',
            inviteCode: '',
            phone: '',
          }}
          onSubmit={async (val) => {
            console.log(val)
            axios
              .post<MemberProps>('/user/register', val)
              .then(({ data }) => {
                toast({
                  title: '注册成功',
                  status: 'success',
                  isClosable: true,
                })
                router.push('/login')
              })
              .catch((e: AxiosError) => {
                console.log(e)
                toast({
                  title: '注册失败',
                  description: e.message,
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                })
              })
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
                    value={values.name}
                    name='name'
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
                <FormControl>
                  <FormLabel>Phone:</FormLabel>
                  <Input
                    value={values.phone}
                    name='phone'
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>InviteCode:</FormLabel>
                  <Input
                    type='text'
                    value={values.inviteCode}
                    name='inviteCode'
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FormControl>
                <Button mt={'2rem'} colorScheme='blue' type='submit'>
                  Register
                </Button>
              </Form>
            </>
          )}
        </Formik>
      )}
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  }
}

export default RegisterPage
