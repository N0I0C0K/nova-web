import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'

declare type MethodDecorator = <T>(
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
) => TypedPropertyDescriptor<T> | void

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
