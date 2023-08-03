import { prisma } from '@/db'
import { NextApiRequest, NextApiResponse } from 'next'
import { IsEmail, IsPhoneNumber, IsString, validate } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { MethodOnly, myDecorator } from '@/utils/api'

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

@myDecorator
function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({
      message: 'only for post',
    })
  } else {
    const form = plainToClass(JoinFormDto, req.body)
    const err = validate(form)
    
  }
}
