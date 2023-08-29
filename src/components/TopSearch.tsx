import {
  InputGroup,
  InputRightElement,
  Button,
  Input,
  Kbd,
  Center,
  Box,
} from '@chakra-ui/react'
import { useSearchModal } from './Providers/SearchProvider'

export const TopSearch: React.FC<{
  className?: string
}> = ({ className = '' }) => {
  const search = useSearchModal()
  return (
    <InputGroup className={className}>
      <Input
        pr='4.5rem'
        placeholder='place search here'
        variant={'filled'}
        onClick={search.show}
      />
      <InputRightElement width='6rem' pr={'.5rem'}>
        <Box lineHeight={'100%'}>
          <Kbd>ctrl</Kbd> + <Kbd>K</Kbd>
        </Box>
        {/* <Button h='1.75rem' size='sm' colorScheme={'blue'}>
          Search
        </Button> */}
      </InputRightElement>
    </InputGroup>
  )
}
