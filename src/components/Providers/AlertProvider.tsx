import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from '@chakra-ui/react'
import { createContext, useState, useRef, useContext } from 'react'

export interface AlertProps {
  show: boolean
  title: string
  description: string
  cancel?: () => void
  confirm?: () => void
}

export const defaultAlertProps: AlertProps = {
  show: false,
  title: '',
  description: '',
}

const alertContext = createContext<{
  show: (props: AlertProps) => void
  close: () => void
}>(null as any)

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alertProps, setAlertProps] = useState<AlertProps>(defaultAlertProps)
  const cancelRef = useRef(undefined as any)
  return (
    <alertContext.Provider
      value={{
        show: (props: AlertProps) => {
          setAlertProps(props)
        },
        close() {
          setAlertProps(defaultAlertProps)
        },
      }}
    >
      {children}
      <AlertDialog
        isOpen={alertProps.show}
        leastDestructiveRef={cancelRef}
        onClose={() => {
          setAlertProps(defaultAlertProps)
        }}
        motionPreset='slideInBottom'
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              {alertProps.title}
            </AlertDialogHeader>

            <AlertDialogBody>{alertProps.description}</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => {
                  alertProps.cancel?.()
                  setAlertProps(defaultAlertProps)
                }}
              >
                取消
              </Button>
              <Button
                colorScheme='red'
                onClick={() => {
                  alertProps.confirm?.()
                  setAlertProps(defaultAlertProps)
                }}
                ml={3}
              >
                确认
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </alertContext.Provider>
  )
}

export const useAlert = () => {
  const props = useContext(alertContext)
  return props
}
