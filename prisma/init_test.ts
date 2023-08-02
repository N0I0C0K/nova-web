import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const t_user = [
    {
      name: 'Nick',
      description: 'Hello! this is nick',
      role: '社长',
    },
    {
      name: 'Link',
      description: 'Hello! this is Link',
      role: 'Gamemes 组员',
    },
  ]

  t_user.every(async (val) => {
    const user = await prisma.user.create({ data: val })
    console.log(user)
  })
}

main()
  .then(() => {
    prisma.$disconnect()
  })
  .catch((e) => {
    console.log(e)
    prisma.$disconnect()
  })
