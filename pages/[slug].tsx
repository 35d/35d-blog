import Image from 'next/future/image'
import dayjs from 'dayjs'
import { TwitterTweetEmbed } from 'react-twitter-embed'
import Code from '../components/Code'
import { Heading, ListItem, Text, ToDo, Toggle } from '../components/ContentBlocks'
import Header from '../components/Header'
import Heading1 from '../components/Heading1'
import NoteLink from '../components/NoteLink'
import Tags from '../components/Tags'
import { getBlocks, getPage } from '../lib/getNotionData'
import { getAltStr, getCaptionStr, getDateStr } from '../lib/helpers'
import saveImageIfNeeded from '../lib/saveImage'
import NextPreviousNavigationLinks from '../components/NextPreviousNavigationLinks'
import { getArticleList } from '../models/article'
import { buildNavLinkViewModel } from '../models/view/NextPreviousNavigationLinks'

// TODO
type Post = any

/**
 * Notion のブロックから JSX エレメントを返却する
 * TODO: リファクタ（別のページへ移動）
 */
const getJsxElementFromNotionBlock = (block: any): JSX.Element => {
  const { type, id } = block
  const value = block[type]
  const rich_texts: any[] = value?.rich_text || []
  const texts: any[] = value?.text || []

  switch (type) {
    case 'paragraph':
      return <Text text={rich_texts} id={id} key={id} />

    case 'heading_1':
      return <Heading text={rich_texts} id={id} level={type} key={id} />

    case 'heading_2':
      return <Heading text={rich_texts} id={id} level={type} key={id} />

    case 'heading_3':
      return <Heading text={rich_texts} id={id} level={type} key={id} />

    case 'bulleted_list_item':
    case 'numbered_list_item':
      return <ListItem key={id} text={rich_texts} id={id} />

    case 'to_do':
      return <ToDo id={id} key={id} value={value} text={value.text} />

    case 'toggle':
      return <Toggle key={id} text={value.text} children={value.children} />

    case 'image':
      // 外部埋め込み画像は現在非対応
      if (block.image.type === 'file') {
        return (
          <figure key={id} className={'mb-3 relative'}>
            <Image
              src={'/blogImages/' + block.id + '.png'}
              alt={getAltStr(value.caption)}
              fill={false}
              width={900}
              height={600}
              style={{ width: '100%', height: 'auto' }}
            />
            {/* <img
              // src={value.file.url} // Notion s3 を使用する場合
              src={'/blogImages/' + block.id + '.png'}
              alt={getAltStr(value.caption)}
              className={'mb-2'}
            /> */}
            <figcaption>{getCaptionStr(value.caption)}</figcaption>
          </figure>
        )
      }

    case 'embed':
      if (value.url.includes('twitter.com')) {
        const pos = value.url.indexOf('?')
        let tweetId = value.url.substring(0, pos).split('/')[5]
        if (!tweetId) {
          tweetId = value.url.split('/')[5]
        }

        return (
          <div key={id} className={'mb-4 m-auto'}>
            <TwitterTweetEmbed tweetId={tweetId} />
          </div>
        )
      }

    case 'code':
      const code = rich_texts[0]?.plain_text || ''
      return (
        <Code key={id} language={value.language}>
          {code}
        </Code>
      )

    case 'divider':
      return (
        <p key={id} className={'text-center'}>
          🐈
        </p>
      )

    case 'quote':
      return (
        <blockquote
          className="italic border-neutral-500 quote border-l-2 px-4 py-1 text-sm mb-4"
          key={id}
        >
          {value.rich_text.map((_) => _.plain_text)}
          {value.children?.map(getJsxElementFromNotionBlock)}
        </blockquote>
      )

    case 'synced_block':
      return value.children.map(getJsxElementFromNotionBlock)

    default:
      console.log(
        `Unsupported block (${type === 'unsupported' ? 'unsupported by Notion API' : type})`
      )
      return (
        <p key={id} className={'text-center'}>
          🐈
        </p>
      )
  }
}

export default function Post({ page, blocks, navLink }) {
  if (!page || !blocks) return <div>ページが存在しません</div>

  const title = page.properties.Page.title[0]?.plain_text
  const description = page.properties.Description.rich_text[0]?.plain_text
  const ogImageUrl = page.properties.ogImageUrl.rich_text[0]?.plain_text
  const tags = page.properties.Tag.multi_select.map((_) => _.name)
  const date = page.properties.Date.date.start

  return (
    <>
      <Header titlePre={title} description={description} ogImageUrl={ogImageUrl} />
      <div className="mb-2">
        <div className="mb-4">
          <Heading1>{title}</Heading1>
        </div>
      </div>
      <div>
        <p className={'opacity-90 font-bold'}>
          <span className="posted mr-2">
            <span className="fs12 mr-2">📆</span>
            {getDateStr(date)}
          </span>
          {tags && (
            <span className="tag">
              <span className="fs12 mr-2">🔖 </span>
              <Tags tags={tags} />
            </span>
          )}
        </p>
      </div>
      {/* note マガジンへの導線 */}
      {tags.includes('Notion') && !tags.includes('Fast Notion') && (
        <div className="mb16">
          <NoteLink />
        </div>
      )}
      {dayjs(date).diff(dayjs(), 'year') < -1 && (
        <p className="text-pink-700 dark:text-pink-600">
          <span className="font-semibold">⚠ </span>この記事は内容が古くなっています
        </p>
      )}
      <div className="mb-8">{blocks.map(getJsxElementFromNotionBlock)}</div>

      {/* 前の記事 / 次の記事 */}
      <NextPreviousNavigationLinks navLink={navLink} />
    </>
  )
}

export const getStaticPaths = async () => {
  // データベースのすべてのデータを取得する
  // Slug のパスを静的に生成するのに必要
  const database = await getArticleList()

  // Slug のパスの静的生成
  const paths = database.map((page) => ({
    params: {
      slug: page.properties.Slug.rich_text[0].plain_text,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps = async (context) => {
  const { slug } = context.params

  const allData = await getArticleList()

  let currentIndex: number // 現在の記事のインデックス番号

  const database = allData
    // Slug に一致するものだけをフィルタする（Slug が重複していない前提・必ず1件だけヒットする想定）
    .filter((_, index) => {
      if (_.properties.Slug.rich_text[0].plain_text !== slug) return false
      currentIndex = index
      return true
    })

  // ナビゲーション用のデータ
  const navLink = buildNavLinkViewModel(allData, currentIndex)

  // ページのメタデータを取得する
  const page = await getPage(database[0].id)

  // ページの本文を取得する
  const blocks = await getBlocks(database[0].id)

  const childrenBlocks = await Promise.all(
    blocks
      .filter((block) => block.has_children)
      .map(async (block) => {
        return {
          id: block.id,
          children: await getBlocks(block.id),
        }
      })
  )

  const blocksWithChildren = blocks.map((block) => {
    if (block.has_children) {
      block[block.type].children = childrenBlocks.find((x) => x.id === block.id).children
    }
    return block
  })

  // 画像を保存する処理
  saveImageIfNeeded(blocksWithChildren)

  return {
    props: {
      page,
      blocks: blocksWithChildren,
      navLink,
    },
    // revalidate: 6000,
  }
}
