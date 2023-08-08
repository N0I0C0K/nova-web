import { options } from '@/pages/api/auth/[...nextauth]'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import { getServerSession } from 'next-auth'

export function MethodOnly(method: 'POST' | 'GET' | 'PUT' | 'DELETE') {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const func = descriptor.value
    descriptor.value = function (...args: any[]) {
      const [req, res] = args
      const { method: req_method } = req
      if (req_method !== method) {
        res.status(405).json({ message: `Method ${req_method} Not Allowed` })
        return
      }
      return func.apply(this, args)
    }
    return descriptor
  }
}

export function PostMethod<T extends object>(
  cls: new (...args: any[]) => T,
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    form: T
  ) => unknown | Promise<unknown>
): NextApiHandler {
  return async (req, res) => {
    const { method } = req
    if (method !== 'POST') {
      res.status(405).json({
        message: 'only for post',
      })
      return
    }
    const form = plainToClass(cls, req.body)
    const err = await validate(form)
    if (err && err.length > 0) {
      res.status(405).json({
        message: 'invaild form data',
      })
      return
    }
    return await handler(req, res, form)
  }
}

export function LoginRequired(
  handler: (
    req: NextApiRequest,
    res: NextApiResponse
  ) => unknown | Promise<unknown>
): NextApiHandler {
  return async (req, res) => {
    const sess = await getServerSession(req, res, options)
    if (!sess) {
      res.status(401).json({
        messgae: 'required login',
      })
      return
    }
    return await handler(req, res)
  }
}
