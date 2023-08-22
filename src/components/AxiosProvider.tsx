import { FC, createContext, useContext, useEffect, useState } from 'react'
import Axios, { AxiosError, AxiosInstance } from 'axios'
import { useToast } from '@chakra-ui/react'

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
  const toast = useToast()
  useEffect(() => {
    axios.interceptors.response.use(
      async (response) => {
        return response
      },
      async (error: AxiosError) => {
        if (error.response) {
          error.message =
            (error.response.data as { message: string })?.message ?? '未知错误'
        }
        return Promise.reject(error)
      }
    )
  }, [axios])
  return <AxiosContext.Provider value={axios}>{children}</AxiosContext.Provider>
}

export interface UtilsFunc {
  uploadFile: () => {}
}

export const useAxios = () => {
  const axios = useContext(AxiosContext)
  return axios
}
