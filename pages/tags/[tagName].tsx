import React from 'react'
import BlockHeading from '../../components/BlockHeading'
import Header from '../../components/Header'
import PostItem from '../../components/PostItem'
import { getNotionData } from '../../lib/getNotionData'
import { getBlogTagLink, postIsReady } from '../../lib/helpers'

const databaseId = process.env.NOTION_DATABASE_ID

export async function getStaticProps({ params: { tagName } }) {

  const database = await getNotionData(databaseId, {
    or: [
      {
        property: 'Tag',
        multi_select: {
          contains: tagName,
        },
      },
    ],
  })
  // const postsTable = await getBlogIndex()

  // let posts: any[] = Object.keys(postsTable)
  //   .map((slug) => {
  //     const post = postsTable[slug]
  //     // remove draft posts in production
  //     if (!postIsReady(post)) {
  //       return null
  //     }

  //     return post
  //   })
  //   .filter(Boolean)

  // posts = posts
  //   .filter((post) => {
  //     if (!post.Tag) return false
  //     const tags = post.Tag.split(',')
  //     return tags.includes(tagName)
  //   })
  //   .sort((a, b) => (a.Date > b.Date ? -1 : 1))

  // posts.map((post) => {
  //   post.Authors = post.Authors.map((id) => users[id].full_name)
  // })

  return {
    props: {
      posts: database,
      tagName: tagName,
    },
    revalidate: 600,
  }
}

// Return our list of blog posts to prerender
export async function getStaticPaths() {
  // データベースのすべてのデータを取得する
  const database = await getNotionData(databaseId)

  // 重複込みでタグのデータを詰めた配列['IFTTT', 'Slack', 'IFTTT', ...]
  let duplicateTagArray = []
  let tagArray = [] // 重複削除

  database.forEach((page) => {
    duplicateTagArray = duplicateTagArray.concat(
      page.properties.Tag.multi_select.map((tag) => tag.name)
    )
  })

  // // 重複排除
  tagArray = duplicateTagArray.filter(function (x, i, self) {
    return self.indexOf(x) === i
  })

  return {
    paths: tagArray.map((tag) => ({
      params: {
        tagName: tag,
      },
    })),
    fallback: false,
  }
}

const RenderPost = ({ posts = [], tagName = '' }) => {
  return (
    <>
      <div>
        <Header />
        <div className={'mb-2'}>
          <BlockHeading>
            {posts.length === 0
              ? `${tagName} が含まれる記事はありません`
              : `${tagName} が含まれる記事一覧`}
          </BlockHeading>
        </div>
        <ul>
          {posts.map((post, index) => (
            <PostItem post={post} key={post.properties.Slug.rich_text[0]?.plain_text + index} />
          ))}
        </ul>
      </div>
    </>
  )
}

export default RenderPost
