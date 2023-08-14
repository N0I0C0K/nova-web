import { prisma } from '@/db'
import { LoginRequired, PostMethod } from '@/utils/api'
import {
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Length,
} from 'class-validator'
import { getToken } from 'next-auth/jwt'

class UserModifyDto {
  @Length(2, 10)
  @IsString()
  @IsOptional()
  name?: string

  @Length(1, 100)
  @IsString()
  @IsOptional()
  description?: string

  @IsPhoneNumber()
  @IsOptional()
  phone?: string

  @IsUrl()
  @IsOptional()
  avatarUrl?: string
}

const handler = LoginRequired(
  PostMethod(UserModifyDto, async (req, res, form) => {
    const { id } = (await getToken({
      req,
    })) as unknown as { id: string }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        secure: true,
      },
    })
    if (!user) {
      res.redirect(401, '/login')
      return
    }
    const user_modified = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: form.name ?? user.name,
        description: form.description ?? user.description,
        avatarUrl: form.avatarUrl ?? user.avatarUrl,
        secure: {
          update: {
            phone: form.phone ?? user.secure?.phone,
          },
        },
      },
      include: {
        secure: true,
      },
    })
    if (user_modified.secure) user_modified.secure.password = ''
    res.status(200).json(user_modified)
  })
)

export default handler