import React from 'react'
import BlockHeading from '../../components/BlockHeading'
import Header from '../../components/Header'
import PostItem from '../../components/PostItem'
import { getBlogTagLink, postIsReady } from '../../lib/helpers'

export async function getStaticProps({ params: { tagName } }) {
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
      posts: [],
      tagName: tagName,
    },
    revalidate: 600,
  }
}

// Return our list of blog posts to prerender
export async function getStaticPaths() {
  // const postsTable = await getBlogIndex()
  // let TagArray = []
  // let duplicateTagArray = []

  // Object.values(postsTable).map((post: any) => {
  //   const tag = post.Tag // IFTTT,Slack,...
  //   if (tag) {
  //     duplicateTagArray = duplicateTagArray.concat(tag.split(','))
  //   }
  // })

  // // 重複排除
  // TagArray = duplicateTagArray.filter(function (x, i, self) {
  //   return self.indexOf(x) === i
  // })

  return {
    paths: [].map((tag) => getBlogTagLink(tag)),
    fallback: true,
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
              ? // ? `${tagName} が含まれる記事はありません`
                `TODO 再実装中……`
              : `${tagName} が含まれる記事一覧`}
          </BlockHeading>
        </div>
        <ul>
          {posts.map((post) => (
            <PostItem post={post} />
          ))}
        </ul>
      </div>
    </>
  )
}

export default RenderPost
