export interface ArticleProps {
  id: string
  title: string
  synopsis: string
  imageUrl?: string
  badges?: string[]
}

export interface MemberProps {
  id: string
  name: string
  avatarUrl?: string
  role: string
  description: string
}
