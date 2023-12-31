import { prisma } from '@/db'
import { options } from '@/pages/api/auth/[...nextauth]'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import { getServerSession } from 'next-auth'

export function ExceptionCatch(handler: NextApiHandler): NextApiHandler {
  return async (req, res) => {
    try {
      await handler(req, res)
    } catch (e) {
      res.status(500)
      if (process.env.NODE_ENV === 'development') {
        console.error(e)
        if (e instanceof Error) {
          res.status(500).json({
            message: e.message,
          })
        } else if (e instanceof String) {
          res.status(500).json({
            message: e,
          })
        }
      } else {
        res.status(500).json({
          message: 'error in handle',
        })
      }
    }
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
    if (!req.body || typeof req.body !== 'object') {
      res.status(405).json({
        message: 'please submit form',
      })
      return
    }
    const form = plainToClass(cls, req.body)
    const err = await validate(form)
    if (err && err.length > 0) {
      res.status(405).json({
        message: err[0].toString(),
      })
      return
    }
    await handler(req, res, form)
  }
}

export function LoginRequired(
  handler: (
    req: NextApiRequest,
    res: NextApiResponse
  ) => unknown | Promise<unknown>,
  limit: {
    level?: number
  } = {
    level: 0,
  }
): NextApiHandler {
  return async (req, res) => {
    const sess = await getServerSession(req, res, options)
    if (!sess) {
      res.status(401).redirect('/login')
      return
    }
    if (limit.level) {
      const { id } = sess as any as { id: string }
      if (!id) {
        res.status(401).redirect('/login')
        return
      }
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          secure: true,
        },
      })

      if (!user) {
        res.status(401).redirect('/login')
        return
      }

      if (user.secure!.level < limit.level) {
        res.status(405).json({
          message: 'permission denied',
        })
        return
      }
    }
    await handler(req, res)
  }
}

export function IpRatingLimit(
  perSecond: number,
  handler: NextApiHandler
): NextApiHandler {
  return async (req, res) => {}
}
