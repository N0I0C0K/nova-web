import { prisma } from '@/db'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  IsEmail,
  IsMobilePhone,
  IsPhoneNumber,
  IsString,
  Length,
  validate,
} from 'class-validator'
import { PostMethod } from '@/utils/api'

class JoinFormDto {
  @Length(4)
  @IsString()
  name!: string

  @IsString()
  @IsEmail()
  email!: string

  @IsPhoneNumber('CN')
  phone!: string

  @Length(20)
  @IsString()
  introduction!: string
}

const handler = PostMethod(JoinFormDto, async (req, res, form) => {
  var user = await prisma.joinForm.findFirst({
    where: {
      name: form.name,
    },
  })
  if (user) {
    user = await prisma.joinForm.update({
      where: {
        name: form.name,
      },
      data: {
        ...form,
      },
    })
    console.log(
      `success change join form, ${user.name}-${user.email} at ${user.updateAt}`
    )
    res.status(200).json({
      message: 'success',
    })
  } else {
    const data = await prisma.joinForm.create({
      data: {
        ...form,
      },
    })
    console.log(
      `success new join form, ${data.name}-${data.email} at ${data.createAt}`
    )
    res.status(200).json({
      message: 'success',
    })
  }
})

export default handler
