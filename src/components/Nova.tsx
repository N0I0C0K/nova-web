import { Text } from '@chakra-ui/react'

export const NovaText = () => {
  return (
    <Text
      bgGradient='linear(to-l, #7928CA, #FF0080)'
      bgClip='text'
      fontSize='8xl'
      fontWeight='extrabold'
      className='nova'
      sx={{
        position: 'relative',
        _after: {
          content: '"Nova"',
          position: 'absolute',
          top: '0',
          left: '0',
          textShadow: '0px 0px 80px rgba(255, 0, 130, 0.7)',
        },
      }}
    >
      Nova
    </Text>
  )
}

export function NovaNmal() {
  return (
    <Text
      fontSize='4xl'
      fontWeight='extrabold'
      className='self-end cursor-pointer'
    >
      Nova
    </Text>
  )
}
