import { User } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { createContext, useContext, useEffect, useState } from 'react'
import { useAxios } from '../AxiosProvider'

const UserContext = createContext<User | undefined>({} as unknown as any)

export function UserInfoProvider({ children }: { children: React.ReactNode }) {
  const sess = useSession()
  const axios = useAxios()
  const [usserinfo, setUser] = useState<User>()
  useEffect(() => {
    axios
      .get<User>('/user/info')
      .then((res) => {
        console.log('update user info')
        setUser(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])
  return (
    <UserContext.Provider value={usserinfo}>{children}</UserContext.Provider>
  )
}

export function useUserInfo() {
  return useContext(UserContext)
}
