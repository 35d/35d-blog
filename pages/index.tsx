import Link from 'next/link'
import { useEffect, useState } from 'react'
import BlockHeading from '../components/BlockHeading'
import Header from '../components/Header'
import PostItem from '../components/PostItem'
import { getNotionData } from '../lib/getNotionData'

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true)

  useEffect(() => {
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    const switchedMode = localStorage.theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', switchedMode)
  }

  return { isDarkMode, toggleDarkMode }
}

export default function Home({ posts, inventoryPosts, popularPosts }) {
  const sections = [
    { title: 'よく読まれている記事（Notion 関連）', posts: popularPosts },
    { title: '最新の記事', posts: posts, link: '/posts' },
    { title: '棚卸し', posts: inventoryPosts, link: '/tags/棚卸し' },
  ]

  return (
    <>
      <Header titlePre={`TOP`} ogImageUrl="https://blog.35d.jp/og-image.png" />
      <div className="max-w-2xl mx-auto mb-16">
        {!posts.length && <p className="text-gray-600 mb-4">No posts found.</p>}

        {sections.map((_) => (
          <section className="mb-6" key={_.title}>
            <div className="mb-3">
              <BlockHeading>{_.title}</BlockHeading>
            </div>
            <ul>
              {_.posts.map((post, index) => {
                if (index > 10) return
                return (
                  <PostItem
                    post={post}
                    key={post.properties.Slug.rich_text[0]?.plain_text + index}
                  />
                )
              })}
            </ul>
            {_.link && (
              <p>
                <Link href={_.link}>
                  <a className={'link'}>すべて見る</a>
                </Link>
              </p>
            )}
          </section>
        ))}
      </div>
    </>
  )
}

export const getStaticProps = async () => {
  // Publish されているデータを取得
  const database = await getNotionData(process.env.NOTION_DATABASE_ID)

  // 全てのデータから Popular カテゴリのもの付いているものを抽出
  const popularPosts = database.filter((_) => {
    return _.properties.Category.select?.name === 'Popular'
  })

  // 全てのデータから「棚卸し」タグが付いているものを5件抽出
  const inventoryPosts = database
    .filter((_) => {
      return _.properties.Tag.multi_select.filter((_) => _.name === '棚卸し').length > 0
    })
    .filter((_, index) => index < 5)

  return {
    props: {
      posts: database,
      popularPosts,
      inventoryPosts,
    },
    // revalidate: 6000,
  }
}
