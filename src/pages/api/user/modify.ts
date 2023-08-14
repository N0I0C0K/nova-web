import { prisma } from '@/db'
import { LoginRequired, PostMethod } from '@/utils/api'
import { IsOptional, IsString } from 'class-validator'
import { isString } from 'lodash'
import { getToken } from 'next-auth/jwt'

class UserModifyDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  phone?: string

  @IsString()
  @IsOptional()
  avatarUrl?: string
}

const handler = LoginRequired(
  PostMethod(UserModifyDto, async (req, res, form) => {
    const { id } = getToken({
      req,
    }) as unknown as { id: string }
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
        id,
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
