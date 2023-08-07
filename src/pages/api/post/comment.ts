import { prisma } from '@/db'
import { LoginRequired, PostMethod } from '@/utils/api'
import { IsString } from 'class-validator'
import { getServerSession } from 'next-auth'
import { CustomToken, options } from '../auth/[...nextauth]'
import { getToken } from 'next-auth/jwt'

class CommentForm {
  @IsString()
  content!: string

  @IsString()
  postId!: string
}

const handler = LoginRequired(
  PostMethod(CommentForm, async (req, res, form) => {
    console.log(form)
    const sess = await getServerSession(req, res, options)
    const token = await getToken({ req })
    const { id: user_id } = token as unknown as CustomToken
    const comment = await prisma.comment.create({
      data: {
        content: form.content,
        post_id: form.postId,
        user_id: user_id,
      },
      include: {
        author: true,
      },
    })
    res.status(200).json(comment)
  })
)

export default handler
