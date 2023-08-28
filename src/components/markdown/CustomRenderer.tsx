// this code is from https://github.com/mustaphaturhan/chakra-ui-markdown-renderer Modified part of the code for custom
// Thanks!
// Custom renderer

import * as React from 'react'
import deepmerge from 'deepmerge'
import { Components } from 'react-markdown'
import {
  Code,
  Divider,
  Heading,
  Link,
  ListItem,
  OrderedList,
  Text,
  UnorderedList,
} from '@chakra-ui/layout'
import { Image } from '@chakra-ui/image'
import { Checkbox } from '@chakra-ui/checkbox'
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table'
import { chakra } from '@chakra-ui/system'
import dynamic from 'next/dynamic'
import { Box, Button, useColorMode } from '@chakra-ui/react'
import {
  oneDark as codedark,
  oneLight as codelight,
} from 'react-syntax-highlighter/dist/cjs/styles/prism'

const SyntaxHighlighter = dynamic(
  () =>
    import('react-syntax-highlighter').then((mod) => {
      return mod.Prism
    }),
  {
    loading: () => <Text>loading...</Text>,
  }
)

type GetCoreProps = {
  children?: React.ReactNode
  'data-sourcepos'?: any
}

function getCoreProps(props: GetCoreProps): any {
  return props['data-sourcepos']
    ? { 'data-sourcepos': props['data-sourcepos'] }
    : {}
}

interface Defaults extends Components {
  /**
   * @deprecated Use `h1, h2, h3, h4, h5, h6` instead.
   */
  heading?: Components['h1']
}

export const defaults: Defaults = {
  strong: (props) => {
    return (
      <Text
        as={'strong'}
        sx={{
          px: 1,
          py: 0.5,
          rounded: 'md',
          _dark: {
            bgColor: 'orange.600',
          },
          _light: {
            bgColor: 'orange.200',
          },
        }}
      >
        {props.children}
      </Text>
    )
  },
  p: (props) => {
    const { children } = props
    return (
      <Text mb={2} className='first-letter:text-2xl tracking-wide'>
        {children}
      </Text>
    )
  },
  em: (props) => {
    const { children } = props
    return <Text as='em'>{children}</Text>
  },
  blockquote: (props) => {
    const { children } = props
    return (
      <Code as='blockquote' rounded={'md'} p={2}>
        {children}
      </Code>
    )
  },
  code: (props) => {
    const { inline, children, className, lang } = props
    const match = /language-(\w+)/.exec(className || '')
    if (inline) {
      return (
        <Code px={2} py={1}>
          {children}
        </Code>
      )
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const mode = useColorMode()
    return (
      <Box pos={'relative'} className='group'>
        <SyntaxHighlighter
          language={'cpp'}
          showLineNumbers
          style={mode.colorMode === 'dark' ? codedark : codelight}
          customStyle={{
            borderRadius: '10px',
          }}
        >
          {String(children)}
        </SyntaxHighlighter>
        <Button
          pos={'absolute'}
          top={'.5rem'}
          right={'.5rem'}
          variant={'ghost'}
          className='opacity-0 group-hover:opacity-100'
          onClick={() => {
            navigator.clipboard.writeText(String(children))
          }}
        >
          Copy
        </Button>
      </Box>
    )
  },
  del: (props) => {
    const { children } = props
    return <Text as='del'>{children}</Text>
  },
  hr: (props) => {
    return <Divider my={'1rem'} />
  },
  a: (props) => <Link {...props} color='blue.400' />,
  img: (props) => {
    return <Image {...props} rounded={'lg'}></Image>
  },
  text: (props) => {
    const { children } = props
    return <Text as='span'>{children}</Text>
  },
  ul: (props) => {
    const { ordered, children, depth } = props
    const attrs = getCoreProps(props)
    let Element = UnorderedList
    let styleType = 'disc'
    if (ordered) {
      Element = OrderedList
      styleType = 'decimal'
    }
    if (depth === 1) styleType = 'circle'
    return (
      <Element
        spacing={2}
        as={ordered ? 'ol' : 'ul'}
        styleType={styleType}
        pl={4}
        {...attrs}
      >
        {children}
      </Element>
    )
  },
  ol: (props) => {
    const { ordered, children, depth } = props
    const attrs = getCoreProps(props)
    let Element = UnorderedList
    let styleType = 'disc'
    if (ordered) {
      Element = OrderedList
      styleType = 'decimal'
    }
    if (depth === 1) styleType = 'circle'
    return (
      <Element
        spacing={2}
        as={ordered ? 'ol' : 'ul'}
        styleType={styleType}
        pl={4}
        {...attrs}
      >
        {children}
      </Element>
    )
  },
  li: (props) => {
    const { children, checked } = props
    let checkbox = null
    if (checked !== null && checked !== undefined) {
      checkbox = (
        <Checkbox isChecked={checked} isReadOnly>
          {children}
        </Checkbox>
      )
    }
    return (
      <ListItem
        {...getCoreProps(props)}
        listStyleType={checked !== null ? 'none' : 'inherit'}
      >
        {checkbox || children}
      </ListItem>
    )
  },
  heading: (props) => {
    const { level, children } = props
    const sizes = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs']
    return (
      <Heading
        mb={4}
        as={`h${level}`}
        size={sizes[`${level - 1}`]}
        className='hover:underline decoration-orange-200'
        {...getCoreProps(props)}
      >
        {children}
      </Heading>
    )
  },
  pre: (props) => {
    const { children } = props
    return <chakra.pre {...getCoreProps(props)}>{children}</chakra.pre>
  },
  table: Table,
  thead: Thead,
  tbody: Tbody,
  tr: (props) => <Tr>{props.children}</Tr>,
  td: (props) => <Td>{props.children}</Td>,
  th: (props) => <Th>{props.children}</Th>,
}

function CustomRenderer(theme?: Defaults, merge = true): Components {
  const elements = {
    p: defaults.p,
    strong: defaults.strong,
    em: defaults.em,
    blockquote: defaults.blockquote,
    code: defaults.code,
    del: defaults.del,
    hr: defaults.hr,
    a: defaults.a,
    img: defaults.img,
    text: defaults.text,
    ul: defaults.ul,
    ol: defaults.ol,
    li: defaults.li,
    h1: defaults.heading,
    h2: defaults.heading,
    h3: defaults.heading,
    h4: defaults.heading,
    h5: defaults.heading,
    h6: defaults.heading,
    pre: defaults.pre,
    table: defaults.table,
    thead: defaults.thead,
    tbody: defaults.tbody,
    tr: defaults.tr,
    td: defaults.td,
    th: defaults.th,
  }

  if (theme && merge) {
    return deepmerge(elements, theme)
  }

  return elements
}

export default CustomRenderer
