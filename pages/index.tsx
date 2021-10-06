import { useEffect, useState } from 'react'
import Image from 'next/image'
import Container from '../components/Container'
import Link from 'next/link'
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

export default function Home({ posts }) {
  return (
    <Container>
      <div className="max-w-2xl mx-auto mb-16">
        <h2 className="font-bold text-2xl md:text-3xl tracking-tight mb-4 mt-8 text-black">SSS</h2>

        {!posts.length && <p className="text-gray-600 mb-4">No posts found.</p>}

        {posts.map((post) => {
          return (
            <Link key={post.id} href={`/${post.properties.Slug.rich_text[0].plain_text}`}>
              <a className="w-full">
                <div className="mb-8 w-full">
                  <h3 className="text-xl font-medium w-full text-gray-900">
                    {post.properties.Page.title[0].plain_text}
                  </h3>
                  <p className="text-gray-700 text-md">
                    {/* {post.properties.Description.rich_text[0].plain_text} */}
                  </p>
                </div>
              </a>
            </Link>
          )
        })}
      </div>
    </Container>
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
