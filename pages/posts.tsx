import BlockHeading from '../components/BlockHeading'
import Header from '../components/Header'
import PostItem from '../components/PostItem'
import { getNotionDataList } from '../lib/getNotionData'

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
  const database = await getNotionDataList(process.env.NOTION_DATABASE_ID)

  return {
    props: {
      posts: database,
    },
    // revalidate: 6000,
  }
}
