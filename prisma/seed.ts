import { PrismaClient, User } from '@prisma/client'

import { MD5 } from 'crypto-js'
import { UserRole } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

function choice<T>(arr: T[]): T {
  if (arr.length === 0) return undefined as any
  return arr[faker.number.int({ min: 0, max: arr.length - 1 })]
}

function RandomStr(len: number): string {
  let str = ''
  for (let i = 0; i < len; i++) {
    str += chars[Math.floor(Math.random() * chars.length)]
  }
  return str
}

async function development_seed() {
  const groups = []
  for (let i = 0; i < 4; ++i) {
    const group = await prisma.group.create({
      data: {
        name: faker.word.words({ count: { min: 1, max: 3 } }),
        description: faker.lorem.lines(),
        avatarUrl: faker.image.avatar(),
      },
    })
    groups.push(group)
  }

  const t_user = Array.from({ length: 50 }).map(() => ({
    name: faker.person.firstName(),
    description: faker.lorem.lines(),
    avatarUrl: faker.image.avatar(),
    role: UserRole.User,
  }))
  t_user.push({
    name: 'Nick',
    avatarUrl: '',
    description: 'This is nick!',
    role: UserRole.User,
  })
  const user_ids: string[] = []
  for (let val of t_user) {
    const user = await prisma.user.upsert({
      where: {
        name: val.name,
      },
      create: {
        ...val,
        groupId: choice(groups).id,
      },
      update: val,
    })
    const salt = MD5(`${faker.string.alpha({ length: 10 })}`).toString()
    const secure = await prisma.userSecure.upsert({
      where: {
        username: val.name,
      },
      update: {},
      create: {
        username: val.name,
        password: MD5(`${val.name}123456${salt}`).toString(),
        email: `${val.name}@nova.club`,
        phone: faker.phone.imei(),
        qq: faker.string.numeric({ length: 10 }),
        salt: salt,
        level: 100,
        user_id: user.id,
      },
    })
    for (let group of groups) {
      const groupNow = await prisma.group.findUnique({
        where: {
          id: group.id,
        },
        include: {
          users: true,
        },
      })
      if (!groupNow) continue
      await prisma.group.update({
        where: {
          id: group.id,
        },
        data: {
          master_id: choice(groupNow?.users)?.id,
        },
      })
    }
    user_ids.push(user.id)
  }
  user_ids.every(async (user_id) => {
    for (let i = 0; i <= faker.number.int({ min: 3, max: 20 }); ++i) {
      const blogVal = {
        synopsis: faker.lorem.lines(),
        title: faker.lorem.lines(1),
        user_id: user_id,
        badges: i % 3 === 0 ? ['game', 'c++'] : ['python', 'art'],
      }
      const blog = await prisma.post.upsert({
        where: {
          title: blogVal.title,
        },
        create: blogVal,
        update: {},
      })
      let md = `# ${blog.title}
## ${faker.lorem.words()}

${faker.lorem.paragraph()}

## list

- ${faker.lorem.lines(1)}
- ${faker.lorem.lines(1)}
- ${faker.lorem.lines(1)}
- ${faker.lorem.lines(1)}

## table

name|type
--|--
name a|type a
name b|type b

## link

[this is test link](https://www.baidu.com)

## sy

> ${faker.lorem.lines()}

## code

\`\`\`c++
#include<iostream>

using namespace std;

int main(){
cout<<"Hello world"<<endl;
return 0;
}
\`\`\`
    `
      const content = await prisma.postContent.create({
        data: {
          post_id: blog.id,
          content: md,
        },
      })
      const addition = await prisma.postAddition.create({
        data: {
          like: 100,
          post_id: blog.id,
        },
      })

      for (let j = 0; j <= faker.number.int({ min: 5, max: 40 }); ++j) {
        const comment = await prisma.comment.create({
          data: {
            content: faker.lorem.lines({ min: 1, max: 5 }),
            user_id: choice(user_ids),
            post_id: blog.id,
          },
        })
      }
      console.log(`blod add ${blog.title}`)
    }
  })
}

async function production_seed() {
  const salt = MD5(RandomStr(12)).toString()
  await prisma.user.create({
    data: {
      name: '正经的管理员',
      description: '系统管理员',
      secure: {
        create: {
          username: process.env.ADMIN_USERNAME!,
          password: MD5(`${process.env.ADMIN_PASSWORD!}${salt}`).toString(),
          salt: salt,
          level: 100,
        },
      },
    },
  })
}

async function main() {
  switch (process.env.NODE_ENV) {
    case 'development':
      console.log('init database with [development] seed')
      await development_seed()
      break
    case 'production':
      console.log('init database with [production] seed')
      await production_seed()
      break
    default:
      console.log('init database with [development] seed')
      await development_seed()
      break
  }
}

main()
  .then(() => {
    prisma.$disconnect()
  })
  .catch((e) => {
    console.log(e)
    prisma.$disconnect()
  })
