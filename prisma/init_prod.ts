import { PrismaClient } from '@prisma/client'

import { MD5 } from 'crypto-js'
import { UserRole } from '@prisma/client'
import { RandomStr } from '@/utils'

const prisma = new PrismaClient()

async function main() {
  //create admin user
  const salt = MD5(RandomStr(12)).toString()
  await prisma.user.create({
    data: {
      name: '正经的管理员',
      description: '系统管理员',
      secure: {
        create: {
          username: process.env.ADMIN_USERNAME!,
          password: MD5(`${process.env.ADMIN_PASSWORD!}${salt}`).toString(),
          salt: salt,
        },
      },
    },
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
