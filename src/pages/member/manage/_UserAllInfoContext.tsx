import { UserAllInfo } from '@/types'
import { createContext } from 'react'

export const UserContext = createContext<UserAllInfo>({} as unknown as any)
