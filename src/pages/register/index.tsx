import { useAxios } from '@/components/AxiosProvider'
import { useAlert } from '@/components/Providers/AlertProvider'
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

const nameMap = {
  name: '用户名',
  password: '密码',
  inviteCode: '邀请码',
  phone: '手机',
  realName: '真实姓名',
  stuId: '学号',
}

const RegisterPage = () => {
  const sess = useSession()
  const axios = useAxios()
  const router = useRouter()
  const toast = useToast()
  const alert = useAlert()
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
            inviteCode: '',
            name: '',
            realName: '',
            stuId: '',
            phone: '',
            password: '',
          }}
          validate={(val) => {
            const err = {} as any
            if (val.name.length < 3) {
              err.name = '用户名长度至少为3'
            }
            if (val.name.includes(' ')) {
              err.name = '用户名不能包含空格'
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
            if (val.stuId.length < 10) {
              err.stuId = '学号错误'
            }
            if (val.realName.length < 2) {
              err.realName = '真实姓名错误'
            }

            return err
          }}
          onSubmit={async (val) => {
            console.log(val)
            alert.show({
              title: '注意😱',
              description:
                '注册用户名为登录账户名，此后不允许更改（只有显示用户名可以修改），并且一个邀请码只能使用一次！请谨慎填写！',
              show: true,
              confirm() {
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
              },
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
                className='flex flex-col gap-5 w-80'
              >
                {Object.keys(values).map((val) => {
                  return (
                    <FormControl
                      isRequired
                      key={val}
                      isInvalid={
                        errors[val as keyof typeof errors] !== undefined &&
                        touched[val as keyof typeof touched]
                      }
                    >
                      <FormLabel>
                        {nameMap[val as keyof typeof nameMap]}:
                      </FormLabel>
                      <Input
                        value={values[val as keyof typeof values]}
                        name={val}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <FormErrorMessage>
                        {errors[val as keyof typeof errors]}
                      </FormErrorMessage>
                    </FormControl>
                  )
                })}
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
