import { PrismaClient } from '@prisma/client'

import { MD5 } from 'crypto-js'
import { UserRole } from '@prisma/client'

const prisma = new PrismaClient()

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

function RandomStr(len: number): string {
  let str = ''
  for (let i = 0; i < len; i++) {
    str += chars[Math.floor(Math.random() * chars.length)]
  }
  return str
}

async function development_seed() {
  const t_user = [
    {
      name: 'Nick',
      description: 'Hello! this is nick',
      role: UserRole.Programer,
    },
    {
      name: 'Link',
      description: 'Hello! this is Link',
      role: UserRole.Programer,
    },
  ]

  t_user.every(async (val) => {
    const user = await prisma.user.upsert({
      where: {
        name: val.name,
      },
      create: val,
      update: val,
    })
    const salt = MD5(`${val.name}`).toString()
    const secure = await prisma.userSecure.upsert({
      where: {
        username: val.name,
      },
      update: {},
      create: {
        username: val.name,
        password: MD5(`${val.name}123456${salt}`).toString(),
        email: `${val.name}@nova.club`,
        phone: '17228172929',
        salt: salt,
        level: 100,
        user_id: user.id,
      },
    })
    for (let i = 0; i <= 10; ++i) {
      const blogVal = {
        synopsis: `${user.name}'s test synopsis`,
        title: `${user.name}'s ${i} Blog`,
        user_id: user.id,
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
Hello This is ${user.name}'s ${i} title

## list

- item 1
- item 2
- item 3
- item 4

## table

name|type
--|--
name a|type a
name b|type b

## link

[this is test link](https://www.baidu.com)

## sy

> this is test text

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

      for (let j = 0; j <= 20; ++j) {
        const comment = await prisma.comment.create({
          data: {
            content: `this is test ${j} comment`,
            user_id: user.id,
            post_id: blog.id,
          },
        })
      }
      console.log(`content ${content.id} save`)
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
