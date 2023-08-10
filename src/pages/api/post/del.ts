import { prisma } from '@/db'
import { LoginRequired, PostMethod } from '@/utils/api'
import { IsString } from 'class-validator'
import { getToken } from 'next-auth/jwt'

class DelPostDto {
  @IsString()
  postId!: string
}

const handler = LoginRequired(
  PostMethod(DelPostDto, async (req, res, form) => {
    const token = await getToken({ req })
    const { id: user_id } = token as unknown as { id: string }
    const delPost = await prisma.post.delete({
      where: {
        id: form.postId,
        user_id: user_id,
      },
    })
    res.status(200).json({
      message: 'success',
    })
  })
)

export default handler
