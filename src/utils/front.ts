import { AxiosInstance } from 'axios'

export async function UploadFile(
  axios: AxiosInstance,
  file: File,
  onUploadSuccess: () => any
) {
  const getUplaodUrl = await axios.post<{
    url: string
    filename: string
    fileurl: string
  }>('/cos/uploadUrl', {
    filename: file.name,
    filetype: file.type,
  })
  const filereader = new FileReader()

  filereader.onload = (e) => {
    axios
      .put(getUplaodUrl.data.url, e.target?.result, {
        headers: {
          'Content-Type': file.type,
        },
        timeout: 60 * 1000,
      })
      .then((res: any) => {
        onUploadSuccess()
      })
  }

  filereader.readAsArrayBuffer(file)

  return getUplaodUrl.data
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export function RandomStr(len: number): string {
  let str = ''
  for (let i = 0; i < len; i++) {
    str += chars[Math.floor(Math.random() * chars.length)]
  }
  return str
}
