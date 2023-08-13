import { prisma } from '@/db'
import { ExceptionCatch } from '@/utils/api'

const handler = ExceptionCatch(async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' })
    return
  }
  const { username } = req.query
  const user = await prisma.userSecure.findUniqueOrThrow({
    where: {
      username: username as string,
    },
  })
  res.status(200).json({ salt: user.salt })
})

export default handler
