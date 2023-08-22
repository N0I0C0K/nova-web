import { prisma } from '@/db'
import { RandomStr } from '@/utils'
import { LoginRequired } from '@/utils/api'
import { getToken } from 'next-auth/jwt'

const handler = LoginRequired(async (req, res) => {
  const token = await getToken({ req })
  const { id } = token as unknown as { id: string }
  if (!id) {
    return res.status(400).json({
      message: '用户不存在',
    })
  }
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  })
  if (!user) {
    return res.status(400).json({
      message: '用户不存在',
    })
  }
  const code = RandomStr(6)
  const invite = await prisma.invitationCode.create({
    data: {
      code: code,
      owner_id: user!.id,
    },
  })
  return res.status(200).json(invite)
})

export default handler
