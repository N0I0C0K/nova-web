import {
  InputGroup,
  InputRightElement,
  Button,
  Input,
  Kbd,
} from '@chakra-ui/react'

export const TopSearch: React.FC<{
  className?: string
}> = ({ className = '' }) => {
  return (
    <InputGroup className={className}>
      <Input pr='4.5rem' placeholder='place search here' variant={'filled'} />
      <InputRightElement width='6rem' pr={'.5rem'}>
        <span>
          <Kbd>ctrl</Kbd> + <Kbd>K</Kbd>
        </span>
        {/* <Button h='1.75rem' size='sm' colorScheme={'blue'}>
          Search
        </Button> */}
      </InputRightElement>
    </InputGroup>
  )
}
