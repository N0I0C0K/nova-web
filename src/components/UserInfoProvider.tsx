import { useSession } from 'next-auth/react'
import { ReactNode, createContext, useContext, useMemo } from 'react'

export type UserSession = {
  name?: string | null
  id?: string | null
  isLogin: boolean
}

const UserContext = createContext<UserSession>({
  isLogin: false,
})

export function UserProvider({ children }: { children: ReactNode }) {
  const sess = useSession()
  const id = useMemo(() => {
    if (sess.data) {
      return (sess.data as unknown as { id?: string | null }).id
    }
    return undefined
  }, [sess])
  return (
    <UserContext.Provider
      value={{
        name: sess.data?.user?.name,
        id: id,
        isLogin: sess.status === 'authenticated',
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUserSession() {
  return useContext(UserContext)
}
