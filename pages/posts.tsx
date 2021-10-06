import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getNotionData } from '../lib/getNotionData'
import Header from '../components/Header'
import PostItem from '../components/PostItem'
import BlockHeading from '../components/BlockHeading'

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

export default function Home({ posts }) {
  return (
    <>
      <Header titlePre={`記事一覧`} ogImageUrl="https://blog.35d.jp/ogp/2021-01-06-01.jpg" />
      <div className="max-w-2xl mx-auto mb-16">
        {!posts.length && <p className="text-gray-600 mb-4">No posts found.</p>}

        <section className="mb-6">
          <div className="mb-3">
            <BlockHeading>記事一覧</BlockHeading>
          </div>
          <ul>
            {posts.map((post, index) => {
              return (
                <PostItem post={post} key={post.properties.Slug.rich_text[0]?.plain_text + index} />
              )
            })}
          </ul>
        </section>
      </div>
    </>
  )
}

export const getStaticProps = async () => {
  const database = await getNotionData(process.env.NOTION_DATABASE_ID)

  return {
    props: {
      posts: database,
    },
  }
}
