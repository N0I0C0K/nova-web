import { Text } from '@chakra-ui/react'

export const NovaText = () => {
  return (
    <Text
      bgGradient='linear(to-l, #7928CA, #FF0080)'
      bgClip='text'
      fontSize='8xl'
      fontWeight='extrabold'
    >
      Nova
    </Text>
  )
}

export function NovaNmal() {
  return (
    <Text
      fontSize="4xl"
      fontWeight="extrabold"
      className="self-end cursor-pointer"
    >
      Nova
    </Text>
  )
}
