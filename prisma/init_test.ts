import { PrismaClient } from '@prisma/client'

import { MD5 } from 'crypto-js'
import { UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
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

main()
  .then(() => {
    prisma.$disconnect()
  })
  .catch((e) => {
    console.log(e)
    prisma.$disconnect()
  })
