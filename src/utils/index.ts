const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export function RandomStr(len: number): string {
  let str = ''
  for (let i = 0; i < len; i++) {
    str += chars[Math.floor(Math.random() * chars.length)]
  }
  return str
}
