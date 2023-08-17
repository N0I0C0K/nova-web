import COS from 'cos-nodejs-sdk-v5'
//const COS = require('cos-nodejs-sdk-v5')

const globalForCOS = globalThis as unknown as {
  cos: COS | undefined
}

export const cos =
  globalForCOS.cos ??
  new COS({
    SecretId: process.env.COS_SecretId!,
    SecretKey: process.env.COS_SecretKey!,
  })

if (process.env.NODE_ENV !== 'production') globalForCOS.cos = cos
