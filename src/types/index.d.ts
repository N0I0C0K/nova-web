import type {
  User,
  Post,
  Comment,
  PostContent,
  JoinForm,
  PostAddition,
} from '@prisma/client'

export type ArticleProps = Post & {}

export type ArticleWithContent = Post & {
  content: PostContent
}

export type ArticleContentProps = Post & {
  content: PostContent
  comments: CommentWithUserProps[]
  author: User
  addition: PostAddition
}

export type MemberProps = User & {}

export type CommentProps = Comment

export type CommentWithUserProps = Comment & { author: User }
