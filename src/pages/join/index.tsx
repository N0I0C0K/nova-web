import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  Image,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { Formik, Form, Field } from 'formik'
import { useSession } from 'next-auth/react'
import { useAxios } from '@/components/AxiosProvider'
import { useRouter } from 'next/router'

const JoinPage = () => {
  const router = useRouter()
  const toast = useToast()
  const axios = useAxios()
  return (
    <Flex
      flexDir={'column'}
      mb={'10rem'}
      className='items-center'
      pos={'relative'}
    >
      <Flex
        pos={'relative'}
        w={'50rem'}
        h={'10rem'}
        mt={'5rem'}
        className='items-center justify-center'
      >
        <Image
          src={'https://nova-1257272505.cos.ap-guangzhou.myqcloud.com/Join.png'}
          alt='11'
          style={{
            width: '100%',
            height: '100%',
          }}
          className='object-cover rounded-xl absolute brightness-90 shadow-xl'
        />
        <Heading zIndex={1} colorScheme='blackAlpha'>
          Join Us
        </Heading>
      </Flex>
      <Formik
        initialValues={{
          name: '',
          email: '',
          phone: '',
          introduction: '',
        }}
        validate={(val) => {
          const err = {} as any
          if (val.name.length < 3) {
            err.name = '用户名长度至少为3'
          }
          if (val.phone.length != 11) {
            err.phone = '手机号码长度为11位'
          }
          if (val.introduction.length < 20) {
            err.introduction = '自我介绍至少20字'
          }
          return err
        }}
        onSubmit={(val) => {
          console.log(val)
          axios
            .post('/form/join', val)
            .then(() => {
              router.push('/')
              toast({
                title: 'Success',
                description: '提交成功，请等待我们联系',
                status: 'success',
                isClosable: true,
              })
            })
            .catch((e) => {
              toast({
                title: 'Error',
                description: e.message,
                status: 'error',
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
          <Form
            className='flex flex-col items-center gap-3 mt-10'
            onSubmit={handleSubmit}
            style={{
              width: '30rem',
            }}
          >
            <FormControl isInvalid={errors.name !== undefined && touched.name}>
              <FormLabel>Name:</FormLabel>
              <Input
                value={values.name}
                name='name'
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Email:</FormLabel>
              <Input
                value={values.email}
                name='email'
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </FormControl>
            <FormControl
              isInvalid={errors.phone !== undefined && touched.phone}
            >
              <FormLabel>Phone:</FormLabel>
              <Input
                type='tel'
                value={values.phone}
                name='phone'
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FormErrorMessage>{errors.phone}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={
                errors.introduction !== undefined && touched.introduction
              }
            >
              <FormLabel>introduction:</FormLabel>
              <Textarea
                value={values.introduction}
                name='introduction'
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder='why you love game?'
              />
              <FormErrorMessage>{errors.introduction}</FormErrorMessage>
            </FormControl>
            <Button type='submit' colorScheme='blue' width={'100%'} mt={'3rem'}>
              Submit!
            </Button>
          </Form>
        )}
      </Formik>
    </Flex>
  )
}

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   return {
//     props: {},
//   }
// }

export default JoinPage
