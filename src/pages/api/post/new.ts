import { prisma } from '@/db'
import { LoginRequired, PostMethod } from '@/utils/api'
import { IsString } from 'class-validator'
import { getToken } from 'next-auth/jwt'

class NewPostDto {
  @IsString()
  content!: string

  @IsString()
  title!: string

  @IsString()
  synopsis!: string
}

const handler = LoginRequired(
  PostMethod(NewPostDto, async (req, res, form) => {
    const token = await getToken({ req })
    const { id: user_id } = token as unknown as { id: string }
    const post = await prisma.post.create({
      data: {
        synopsis: form.synopsis,
        title: form.title,
        user_id: user_id,
      },
    })
    const postContent = await prisma.postContent.create({
      data: {
        content: form.content,
        post_id: post.id,
      },
    })
    const addition = await prisma.postAddition.create({
      data: {
        post_id: post.id,
      },
    })
  })
)

export default handler
