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

const JoinPage = () => {
  return (
    <Flex pt={'5rem'} flexDir={'column'} className='items-center'>
      <Heading>Join Us</Heading>
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
          className='flex flex-col items-center gap-3'
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
          <Button type='submit' colorScheme='blue' width={'100%'}>
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
