import type { User, Post, Comment, PostContent } from '@prisma/client'

export type ArticleProps = Post & {}

export type ArticleContentProps = Post & {
  content: PostContent
  comments: Comment[]
  author: User
}

export type MemberProps = User & {}
