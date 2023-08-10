import { prisma } from '@/db'
import { LoginRequired, PostMethod } from '@/utils/api'
import { IsArray, IsString } from 'class-validator'
import { getToken } from 'next-auth/jwt'

class RemoveCommentDto {
  @IsString({ each: true })
  @IsArray()
  commentId!: string[]
}

const handler = LoginRequired(
  PostMethod(RemoveCommentDto, async (req, res, form) => {
    const token = await getToken({ req })
    const { id: user_id } = token as unknown as { id: string }
    const comment = await prisma.comment.deleteMany({
      where: {
        id: {
          in: form.commentId,
        },
        user_id,
      },
    })
    res.status(200).json({
      message: 'success',
      count: comment.count,
    })
  })
)

export default handler
