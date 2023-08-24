import { prisma } from '@/db'
import { LoginRequired, PostMethod } from '@/utils/api'
import { IsArray, IsOptional, IsString, Length } from 'class-validator'
import { getToken } from 'next-auth/jwt'

class NewPostDto {
  @Length(3)
  @IsString()
  content!: string

  @Length(3, 50)
  @IsString()
  title!: string

  @Length(3, 50)
  @IsString()
  synopsis!: string

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  bages?: string[]
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
        badges: form.bages?.map((val) => val.toLowerCase()) ?? undefined,
        content: {
          create: {
            content: form.content,
          },
        },
        addition: {
          create: {},
        },
      },
    })
    res.status(200).json(post)
  })
)

export default handler
