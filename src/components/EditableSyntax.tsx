import React, { useState, useEffect, useRef } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import debounce from 'lodash/debounce'
import { Box } from '@chakra-ui/react'

const EditableSyntaxHighlighter = ({ language, value, onChange, style }) => {
  const [code, setCode] = useState(value)
  const codeRef = useRef<HTMLDivElement>(null)

  const onKeyup = debounce(() => {
    const updatedCode = codeRef.current!.innerText
    console.log(updatedCode)

    // setCode(updatedCode)
    // onChange(updatedCode)
  }, 200)

  useEffect(() => {
    codeRef.current!.setAttribute('contentEditable', 'true')
    console.log(codeRef)

    codeRef.current!.addEventListener('keydown', (e) => {
      const selection = window.getSelection()
      const step = selection?.getRangeAt(0)
      console.log(selection, step)

      if (e.keyCode === 13) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
    })
    codeRef.current!.addEventListener('keyup', onKeyup)
    return () => {
      codeRef.current!.removeEventListener('keyup', onKeyup)
    }
  }, [onKeyup])

  return (
    <Box style={style}>
      <Box ref={codeRef}>
        <SyntaxHighlighter language={language}>{code}</SyntaxHighlighter>
      </Box>
    </Box>
  )
}

export default EditableSyntaxHighlighter
