import { FC, createContext, useContext, useState } from 'react'
import Axios, { AxiosInstance } from 'axios'

const AxiosContext = createContext<AxiosInstance>(null as any)

export const AxiosProvider: FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [axios] = useState<AxiosInstance>(() => {
    return Axios.create({
      baseURL: '/api',
      timeout: 10000,
    })
  })
  return <AxiosContext.Provider value={axios}>{children}</AxiosContext.Provider>
}

export interface UtilsFunc {
  uploadFile: () => {}
}

export const useAxios = () => {
  const axios = useContext(AxiosContext)
  return axios
}
