import {
  Box,
  Flex,
  Stack,
  Spacer,
  Input,
  InputGroup,
  InputRightElement,
  ButtonGroup,
  Button,
} from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'
import { TopSearch } from './TopSearch'
import { NovaNmal, NovaText } from './Nova'

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Box>
      <Flex
        className='base-header items-center'
        gap={10}
        py={3}
        px={10}
        position={'fixed'}
        w={'100vw'}
        h={'4em'}
      >
        <NovaNmal />
        <Link href='/'>Home</Link>
        <Link href='/game'>Games</Link>
        <Link href='/about'>About</Link>
        <Spacer />
        <TopSearch className='max-w-xs' />
      </Flex>
      <Box>{children}</Box>
    </Box>
  )
}
