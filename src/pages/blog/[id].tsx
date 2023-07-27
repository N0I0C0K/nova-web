import { ArticleProps } from '@/types'
import { GetServerSideProps } from 'next'
import { FC } from 'react'

const ArticlePage: FC<{
  article: ArticleProps
}> = ({ article }) => {
  return <div>Enter</div>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  ctx.query.id
  return {
    props: {},
  }
}

export default ArticlePage
