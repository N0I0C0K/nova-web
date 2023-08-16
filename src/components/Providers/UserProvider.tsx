import { User } from '@prisma/client'
import { createContext } from 'react'

const UserContext = createContext<User>({} as unknown as any)
