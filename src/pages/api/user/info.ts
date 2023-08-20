import { prisma } from '@/db'
import { LoginRequired } from '@/utils/api'
import { getToken } from 'next-auth/jwt'

const handler = LoginRequired(async (req, res) => {
  if (req.method !== 'GET') {
    res.status(404).json({
      message: 'can  not find',
    })
    return
  }
  const token = await getToken({ req })
  const { id } = token as any as { id: string }
  if (!id) {
    res.status(404).json({
      message: 'can  not find',
    })
    return
  }
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  })
  if (!user) {
    res.status(404).json({
      message: 'can  not find',
    })
    return
  }
  res.status(200).json(user)
})

export default handler
