import type {
  User,
  Post,
  Comment,
  PostContent,
  JoinForm,
  PostAddition,
  Game,
  UserSecure,
  Group,
  InvitationCode,
  UserFile,
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

export type UserAllInfo = User & {
  posts: Post[]
  comments: Comment[]
  games: Game[]
  secure: UserSecure
  invitations: InvitationCode[]
  masterGroup?: Group | null
  group?: Group | null
  files: UserFile[]
}
