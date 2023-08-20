import { LoginRequired, PostMethod } from '@/utils/api'
import { IsOptional, IsString, Length } from 'class-validator'
import { cos } from './_cosHelper'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/db'
import { RandomStr } from '@/utils/front'

class UploadFileDto {
  @Length(3)
  @IsString()
  filename!: string

  @IsString()
  filetype!: string
}

const handler = LoginRequired(
  PostMethod(UploadFileDto, async (req, res, form) => {
    const token = await getToken({ req })
    const { name, id } = token as unknown as { name: string; id: string }
    if (name) {
      form.filename = `${name}/${form.filename}`
    }

    // 是否重命名
    try {
      //此方法是远程调用接口查询，速度较慢
      // const hasObj = await cos.headObject({
      //   Bucket: process.env.COS_Bucket!,
      //   Region: process.env.COS_Region!,
      //   Key: form.filename,
      // })
      // if (hasObj.statusCode && hasObj.statusCode === 200) {
      //   let idx = form.filename.lastIndexOf('.')
      //   idx = idx === -1 ? form.filename.length : idx
      //   form.filename = `${form.filename.substring(0, idx)}-0${
      //     idx !== -1 ? form.filename.substring(idx) : ''
      //   }`
      // }
      const existFile = await prisma.userFile.findUnique({
        where: {
          objectKey: form.filename,
        },
      })
      if (existFile) {
        let idx = form.filename.lastIndexOf('.')
        idx = idx === -1 ? form.filename.length : idx
        form.filename = `${form.filename.substring(0, idx)}-${RandomStr(4)}${
          idx !== -1 ? form.filename.substring(idx) : ''
        }`
      }
    } catch (error) {
      res.status(500)
    }
    let url = ''
    try {
      url = cos.getObjectUrl(
        {
          Bucket: process.env.COS_Bucket!,
          Region: process.env.COS_Region!,
          Sign: true,
          Key: form.filename,
          Method: 'PUT',
        },
        (err: any, url: any) => {}
      )
      if (url.length < 10) {
        throw new Error('未能获取到上传链接')
      }
    } catch (err) {
      res.status(500)
    }

    await prisma.userFile.create({
      data: {
        user_id: id,
        objectKey: form.filename,
        fileType: form.filetype,
      },
    })

    res.status(200).json({
      url,
      filename: form.filename,
      fileurl: `https://${process.env.COS_Bucket}.cos.${process.env.COS_Region}.myqcloud.com/${form.filename}`,
    })
  })
)

export default handler
