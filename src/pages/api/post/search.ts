import { prisma } from '@/db'
import { PostMethod } from '@/utils/api'
import { IsArray, IsOptional, IsString, Length } from 'class-validator'
import { NextApiHandler } from 'next'

class SearchDto {
  @Length(1)
  @IsString()
  titleInclude!: string

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  badgeInclude?: string[]
}

const handler = PostMethod(SearchDto, async (req, res, form) => {
  form.titleInclude = form.titleInclude.replaceAll(' ', ' & ')
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        {
          title: {
            search: form.titleInclude,
          },
        },
        {
          synopsis: {
            search: form.titleInclude,
          },
        },
      ],
      ...(form.badgeInclude && {
        badges: {
          hasSome: form.badgeInclude,
        },
      }),
    },
  })
  res.status(200).json({
    posts,
  })
})

export default handler
