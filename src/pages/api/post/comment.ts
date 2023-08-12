import { prisma } from '@/db'
import { LoginRequired, PostMethod } from '@/utils/api'
import { IsNumber, IsString } from 'class-validator'
import { getServerSession } from 'next-auth'
import { CustomToken, options } from '../auth/[...nextauth]'
import { getToken } from 'next-auth/jwt'

class CommentForm {
  @IsString()
  content!: string

  @IsNumber()
  postId!: number
}

const handler = LoginRequired(
  PostMethod(CommentForm, async (req, res, form) => {
    if (form.content.length > 200) {
      res.status(403).json({
        message: '你的话太多了，分成多次说',
      })
      return
    }
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
