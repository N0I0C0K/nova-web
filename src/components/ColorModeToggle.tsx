import { IconButton, useColorMode } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

export function ColorModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <IconButton aria-label='color mode' onClick={toggleColorMode}>
      {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
    </IconButton>
  )
}
