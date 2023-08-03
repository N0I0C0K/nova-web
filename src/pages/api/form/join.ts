import { prisma } from '@/db'
import { NextApiRequest, NextApiResponse } from 'next'
import { IsEmail, IsPhoneNumber, IsString, validate } from 'class-validator'
import { PostMethod } from '@/utils/api'

class JoinFormDto {
  @IsString()
  name!: string

  @IsString()
  @IsEmail()
  email!: string

  @IsPhoneNumber()
  phone!: string

  @IsString()
  introduction!: string
}

export const func = PostMethod(JoinFormDto, async (req, res, form) => {
  const data = await prisma.joinForm.create({
    data: {
      ...form,
    },
  })
  console.log(data)
  res.status(200).json({
    message: 'success',
  })
})


