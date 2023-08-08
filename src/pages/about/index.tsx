import CustomRenderer from '@/components/markdown/CustomRenderer'
import { Link } from '@chakra-ui/next-js'
import { Box, Flex, Text } from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const about = `
## Nova独立游戏研究社团
作为独立游戏开发社团，我们提供一个讨论和交流独立游戏开发的平台，让你可以与其他充满热情的志同道合者一起探索游戏创作的无限可能。在这里，你可以分享自己的创意和想法，与其他团队成员合作开发独立游戏项目。

无论你是具备专业技能的经验开发者，还是对游戏开发充满激情并希望学习的新手，我们都欢迎你的加入。无论你擅长编程、美术、策划或者建模，你都能找到适合自己的角色，并与团队合作，共同打造出令人惊叹的独立游戏作品。

### 加入我们
加入 Nova 独立游戏研究社，你将有机会：

- 参与独立游戏开发项目：积累珍贵的实战经验，锻炼自己的技术能力，并与团队成员共同实现游戏创意。
- 学习与成长：通过与经验丰富的开发者合作，你将不断学习和成长，不断提升自己的技能水平。
- 创意分享与讨论：我们重视独立游戏创意的孕育和分享，社团将为你提供一个积极的创意交流环境，让你的想法得到重视和发展。
- 展示自我：我们鼓励社员们展示自己的作品和才华，例如参加游戏开发比赛、展览等活动，让更多人欣赏和认可你的创造力。

无论你对独立游戏开发充满热情，还是对游戏创意和讨论感兴趣，Nova 独立游戏研究社都是你发挥才华和追求梦想的理想之地。加入我们，一起探索独立游戏的奇妙世界！
`

export default function AboutPage() {
  return (
    <Flex pt={'5rem'} flexDirection={'column'} className='items-center'>
      <Box width={'45rem'}>
        <ReactMarkdown
          components={CustomRenderer()}
          remarkPlugins={[remarkGfm]}
        >
          {about}
        </ReactMarkdown>
      </Box>
      <Link
        href={'/join'}
        fontSize={'3xl'}
        color={'orange.400'}
        fontStyle={'italic'}
        fontWeight={'bold'}
        mt={'2rem'}
      >
        Join Us
      </Link>
    </Flex>
  )
}
