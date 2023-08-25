import { prisma } from '@/db'
import { LoginRequired } from '@/utils/api'

const handler = LoginRequired(async (req, res) => {
  const joinList = await prisma.joinForm.findMany({
    orderBy: {
      createAt: 'desc',
    },
  })
  res.status(200).json({
    joinList,
  })
})

export default handler
