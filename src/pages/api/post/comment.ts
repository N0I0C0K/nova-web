import { prisma } from '@/db'
import { LoginRequired, PostMethod } from '@/utils/api'
import { IsString } from 'class-validator'
import { getServerSession } from 'next-auth'
import { CustomSession, options } from '../auth/[...nextauth]'

class CommentForm {
  @IsString()
  comment!: string

  @IsString()
  postId!: string
}

export default LoginRequired(
  PostMethod(CommentForm, async (req, res, form) => {
    console.log(form)
    const sess = await getServerSession(req, res, options)

    // await prisma.comment.create({
    //   data: {
    //     content: form.comment,
    //     post_id: form.postId,
    //     user_id: sess.
    //   },
    // })
  })
)
