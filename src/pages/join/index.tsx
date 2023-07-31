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
import { Formik, Form, Field } from 'formik'
//import { Image } from '@chakra-ui/next-js'
import Image from 'next/image'
import backImg from './back.png'

const JoinPage = () => {
  return (
    <Flex flexDir={'column'} className='items-center' pos={'relative'}>
      <Flex
        pos={'relative'}
        w={'50rem'}
        h={'10rem'}
        mt={'5rem'}
        className='items-center justify-center'
      >
        <Image
          src={backImg}
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
        }}
        onSubmit={(val) => {
          console.log(val)
        }}
      >
        <Form
          className='flex flex-col items-center gap-3 mt-10'
          style={{
            width: '30rem',
          }}
        >
          <Field name='name'>
            {({ field }: { field: any }) => (
              <FormControl>
                <FormLabel>Name:</FormLabel>
                <Input {...field} />
              </FormControl>
            )}
          </Field>
          <Field name='email'>
            {({ field }: { field: any }) => (
              <FormControl>
                <FormLabel>Email:</FormLabel>
                <Input {...field} />
              </FormControl>
            )}
          </Field>
          <Button type='submit' colorScheme='blue' width={'100%'} mt={'3rem'}>
            Submit!
          </Button>
        </Form>
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
