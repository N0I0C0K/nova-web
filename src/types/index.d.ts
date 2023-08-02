import type { User, Post } from '@prisma/client'

export type ArticleProps = Post & {}

export type ArticleContentProps = {
  content: string
}

export type MemberProps = User & {}
