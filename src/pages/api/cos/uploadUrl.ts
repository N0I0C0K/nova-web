import { LoginRequired, PostMethod } from '@/utils/api'
import { IsOptional, IsString, Length } from 'class-validator'
import { cos } from './_cosHelper'
import { getToken } from 'next-auth/jwt'

class UploadFileDto {
  @Length(3)
  @IsString()
  filename!: string
}

const handler = LoginRequired(
  PostMethod(UploadFileDto, async (req, res, form) => {
    const token = await getToken({ req })
    const { name } = token as unknown as { name: string }
    if (name) {
      form.filename = `${name}/${form.filename}`
    }

    // 是否重命名
    // try {
    //   const hasObj = await cos.headObject({
    //     Bucket: process.env.COS_Bucket!,
    //     Region: process.env.COS_Region!,
    //     Key: form.filename,
    //   })
    //   if (hasObj.statusCode && hasObj.statusCode === 200) {
    //     let idx = form.filename.lastIndexOf('.')
    //     idx = idx === -1 ? form.filename.length : idx
    //     form.filename = `${form.filename.substring(0, idx)}-0${
    //       idx !== -1 ? form.filename.substring(idx + 1) : ''
    //     }`
    //   }
    // } catch (error) {}

    const url = cos.getObjectUrl(
      {
        Bucket: process.env.COS_Bucket!,
        Region: process.env.COS_Region!,
        Sign: true,
        Key: form.filename,
        Method: 'PUT',
      },
      (err, url) => {}
    )
    res.status(200).json({
      url,
      filename: form.filename,
      fileurl: `https://${process.env.COS_Bucket}.cos.${process.env.COS_Region}.myqcloud.com/${form.filename}`,
    })
  })
)

export default handler
