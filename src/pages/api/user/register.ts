import { prisma } from '@/db'
import { PostMethod } from '@/utils/api'
import { IsNumber, IsPhoneNumber, IsString, Length } from 'class-validator'
import { MD5 } from 'crypto-js'

class RegisterDto {
  @Length(6, 6)
  @IsString()
  inviteCode!: string

  @Length(3)
  @IsString()
  name!: string

  @Length(8)
  @IsString()
  password!: string

  @IsPhoneNumber('CN')
  @IsString()
  phone!: string
}

const handler = PostMethod(RegisterDto, async (req, res, form) => {
  const { name, password, phone, inviteCode } = form
  const invite = await prisma.invitationCode.findUnique({
    where: {
      code: inviteCode,
    },
  })
  if (!invite) {
    return res.status(400).json({
      message: '邀请码不存在',
    })
  }
  if (invite.user_id) {
    return res.status(400).json({
      message: '邀请码已使用',
    })
  }
  const findUser = await prisma.userSecure.findUnique({
    where: {
      username: name,
    },
  })
  if (findUser) {
    return res.status(400).json({
      message: '用户名已存在',
    })
  }
  const salt = MD5(name).toString()
  const user = await prisma.user.create({
    data: {
      name: name,
      description: '',
      secure: {
        create: {
          password: MD5(`${password}${salt}`).toString(),
          username: name,
          salt,
          phone,
        },
      },
    },
  })
  await prisma.invitationCode.update({
    where: {
      code: inviteCode,
    },
    data: {
      user_id: user.id,
    },
  })
  return res.status(200).json(user)
})

export default handler
