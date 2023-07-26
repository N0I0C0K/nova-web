import { InputGroup, InputRightElement, Button, Input } from '@chakra-ui/react'

export const TopSearch: React.FC<{
  className?: string
}> = ({ className = '' }) => {
  return (
    <InputGroup className={className}>
      <Input pr="4.5rem" placeholder="place search here" variant={'filled'} />
      <InputRightElement width="4.5rem" pr={'.5rem'}>
        <Button h="1.75rem" size="sm" colorScheme={'blue'}>
          Search
        </Button>
      </InputRightElement>
    </InputGroup>
  )
}
