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
  FormErrorMessage,
} from '@chakra-ui/react'
import { AxiosError } from 'axios'
import { MD5 } from 'crypto-js'
import { Formik, Form, Field } from 'formik'
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
          validate={(val) => {
            const err = {} as any
            if (val.name.length < 3) {
              err.name = '用户名长度至少为3'
            }
            if (val.password.length < 8) {
              err.password = '密码长度至少为8'
            }
            if (val.phone.length != 11) {
              err.phone = '手机号码长度为11位'
            }
            if (val.inviteCode.length != 6) {
              err.inviteCode = '邀请码长度为6位'
            }
            return err
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
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            errors,
            touched,
          }) => (
            <>
              <Form
                onSubmit={handleSubmit}
                className='flex flex-col gap-5 w-72'
              >
                <FormControl
                  isInvalid={errors.name !== undefined && touched.name}
                >
                  <FormLabel>Username:</FormLabel>
                  <Input
                    value={values.name}
                    name='name'
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={errors.password !== undefined && touched.password}
                >
                  <FormLabel>Password:</FormLabel>
                  <Input
                    type='password'
                    value={values.password}
                    name='password'
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={errors.phone !== undefined && touched.phone}
                >
                  <FormLabel>Phone:</FormLabel>
                  <Input
                    value={values.phone}
                    name='phone'
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FormControl>
                <FormControl
                  isInvalid={
                    errors.inviteCode !== undefined && touched.inviteCode
                  }
                >
                  <FormLabel>InviteCode:</FormLabel>
                  <Input
                    type='text'
                    value={values.inviteCode}
                    name='inviteCode'
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <FormErrorMessage>{errors.inviteCode}</FormErrorMessage>
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
