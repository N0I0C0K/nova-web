import { LoginRequired, PostMethod } from '@/utils/api'
import { IsString, Length } from 'class-validator'
import { getToken } from 'next-auth/jwt'
import { CustomToken } from '../auth/[...nextauth]'
import { prisma } from '@/db'

class ModifyDto {
  @Length(3)
  @IsString()
  content!: string

  @Length(3)
  @IsString()
  title!: string

  @Length(3)
  @IsString()
  synopsis!: string

  @IsString()
  postSlug!: string
}

const handler = LoginRequired(
  PostMethod(ModifyDto, async (req, res, form) => {
    const token = await getToken({ req })
    const { id: user_id } = token as unknown as CustomToken
    const post = await prisma.post.findFirst({
      where: {
        slug: form.postSlug,
        user_id: user_id,
      },
    })
    if (!post) {
      res.status(403).json({
        message: 'can not find post',
      })
      return
    }

    await prisma.post.update({
      where: {
        slug: form.postSlug,
        user_id: user_id,
      },
      data: {
        title: form.title,
        synopsis: form.synopsis,
      },
    })
    await prisma.postContent.update({
      where: {
        post_id: post.id,
      },
      data: {
        content: form.content,
      },
    })
    const post_modified = await prisma.post.findFirst({
      where: {
        id: post.id,
      },
    })
    res.status(200).json(post_modified)
  })
)

export default handler
