export interface ArticleProps {
  id: string
  title: string
  author: string
  synopsis: string
  imageUrl?: string
  badges?: string[]
  createAt?: string
  updateAt?: string
}

export interface ArticleContentProps {
  content: string
}

export interface MemberProps {
  id: string
  name: string
  avatarUrl?: string
  role: string
  description: string
}
