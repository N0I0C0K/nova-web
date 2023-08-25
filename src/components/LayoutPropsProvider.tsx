import { ChakraProps } from '@chakra-ui/react'
import { useContext, useState, createContext } from 'react'

export interface HeaderProps {
  showHead: boolean
  showFooter: boolean
  gloablBoxProps: ChakraProps
  useAutoHideHead: boolean
}

const defaultHeaderProps: HeaderProps = {
  showHead: true,
  showFooter: true,
  gloablBoxProps: {
    minH: '100vh',
    px: '5rem',
    pb: '1rem',
  },
  useAutoHideHead: false,
}

const gloablLayoutPropsContext = createContext<
  [HeaderProps, React.Dispatch<React.SetStateAction<HeaderProps>>]
>([defaultHeaderProps, () => {}])

export const GlobalLayoutPropsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [head, setHead] = useState<HeaderProps>(defaultHeaderProps)
  return (
    <gloablLayoutPropsContext.Provider value={[head, setHead]}>
      {children}
    </gloablLayoutPropsContext.Provider>
  )
}

export const useGlobalLayoutProps = (): [
  HeaderProps,
  React.Dispatch<React.SetStateAction<HeaderProps>>,
  () => void
] => {
  const [head, setHead] = useContext(gloablLayoutPropsContext)
  return [
    head,
    setHead,
    () => {
      setHead(defaultHeaderProps)
    },
  ]
}
