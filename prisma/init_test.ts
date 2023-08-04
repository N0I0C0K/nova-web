import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const t_user = [
    {
      name: 'Nick',
      description: 'Hello! this is nick',
      role: '社长',
    },
    {
      name: 'Link',
      description: 'Hello! this is Link',
      role: 'Gamemes 组员',
    },
  ]

  t_user.every(async (val) => {
    const user = await prisma.user.create({ data: val })
    console.log(user)
    for (let i = 0; i <= 10; ++i) {
      const blog = await prisma.post.create({
        data: {
          synopsis: `${user.name}'s test synopsis`,
          title: `${user.name}'s ${i} Blog`,
          user_id: user.id,
          badges: i % 3 === 0 ? ['game', 'c++'] : ['python', 'art'],
        },
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
      for (let j = 0; j <= 10; ++j) {
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
