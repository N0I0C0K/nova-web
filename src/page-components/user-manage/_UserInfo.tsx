import { useAxios } from '@/components/AxiosProvider'
import { PhoneIcon, EmailIcon, EditIcon } from '@chakra-ui/icons'
import {
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  Text,
  ModalHeader,
  FormControl,
  FormLabel,
  Input,
  Button,
  useBoolean,
  Flex,
  Avatar,
  Spacer,
  IconButton,
  Box,
  Center,
  Tooltip,
} from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { FC, useContext, useRef } from 'react'
import { UserContext } from './_UserAllInfoContext'
import { UploadFile } from '@/utils/front'

const UserInfoModifyModal: FC<{
  open: boolean
  onClose: () => void
}> = observer(({ open, onClose }) => {
  const axios = useAxios()
  const toast = useToast()
  const user = useContext(UserContext)
  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader p={'1rem'}>修改用户信息</ModalHeader>
        <Formik
          initialValues={{
            name: user.name,
            description: user.description,
            phone: user.secure.phone,
          }}
          onSubmit={(val) => {
            axios
              .post('/user/modify', val)
              .then((res) => {
                toast({
                  title: '修改成功',
                  status: 'success',
                  isClosable: true,
                })
                runInAction(() => {
                  user.name = val.name
                  user.description = val.description
                  user.secure.phone = val.phone
                })

                onClose()
              })
              .catch((e) => {
                toast({
                  title: '修改失败',
                  description: '检查是否合理',
                  status: 'error',
                  isClosable: true,
                })
              })
          }}
        >
          {({ values, handleChange, handleBlur, handleSubmit }) => (
            <Form onSubmit={handleSubmit} className='flex flex-col p-4 gap-2'>
              <FormControl>
                <FormLabel>Name:</FormLabel>
                <Input
                  name='name'
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description:</FormLabel>
                <Input
                  name='description'
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Phone:</FormLabel>
                <Input
                  name='phone'
                  value={values.phone ?? ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormControl>
              <Button mt={'2rem'} type='submit' colorScheme='blue'>
                Save
              </Button>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  )
})

export const UserInfo = observer(() => {
  const user = useContext(UserContext)
  const fileSelect = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useBoolean(false)
  const axios = useAxios()
  return (
    <Flex
      flexDir={'row'}
      w={'100%'}
      h={'7rem'}
      p={'1rem'}
      gap={'1rem'}
      shadow={'lg'}
      sx={{
        _dark: {
          borderWidth: '1px',
        },
      }}
      className='border rounded-xl items-center'
    >
      <Input
        ref={fileSelect}
        type='file'
        display={'none'}
        accept='.jpg,.jpeg,.png'
        onChange={async (event) => {
          if (!event.target.files || event.target.files.length === 0) {
            return
          }
          const file = event.target.files[0]
          if (!file.type.startsWith('image')) {
            return
          }
          const { fileurl } = await UploadFile(axios, file, () => {
            axios.post('/user/modify', { avatarUrl: fileurl }).then(() => {
              runInAction(() => {
                user.avatarUrl = fileurl
              })
            })
          })
        }}
      />
      <Flex className='group' alignItems={'center'} justifyContent={'center'}>
        <Tooltip label='点击更改头像'>
          <Avatar
            name={user.name}
            src={user.avatarUrl ?? ''}
            size={'lg'}
            className='cursor-pointer  duration-200 group-hover:brightness-50'
            onClick={() => {
              fileSelect.current?.click()
            }}
          ></Avatar>
        </Tooltip>
        <EditIcon
          display={'none'}
          className='group-hover:inline-block'
          pos={'absolute'}
        />
      </Flex>

      <Flex flexDir={'column'}>
        <Text fontSize={'lg'} fontWeight={'bold'}>
          {user.name} ({user.secure.username})
        </Text>
        <Text fontSize={'sm'} color={'gray'}>
          {user.description}
        </Text>
      </Flex>
      <Spacer />
      {user.secure.phone && (
        <Button leftIcon={<PhoneIcon />} variant={'ghost'}>
          {user.secure.phone}
        </Button>
      )}
      {user.secure.email && (
        <Button leftIcon={<EmailIcon />} variant={'ghost'}>
          {user.secure.email}
        </Button>
      )}
      <IconButton aria-label='edit' variant={'ghost'} onClick={setOpen.toggle}>
        <EditIcon />
      </IconButton>
      <UserInfoModifyModal open={open} onClose={setOpen.off} />
    </Flex>
  )
})
