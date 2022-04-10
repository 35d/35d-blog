import dayjs from 'dayjs'
import { TwitterTweetEmbed } from 'react-twitter-embed'
import Code from '../components/Code'
import { Heading, ListItem, Text, ToDo, Toggle } from '../components/ContentBlocks'
import Header from '../components/Header'
import Heading1 from '../components/Heading1'
import NoteLink from '../components/NoteLink'
import Tags from '../components/Tags'
import { getBlocks, getNotionData, getPage } from '../lib/getNotionData'
import { getAltStr, getCaptionStr, getDateStr } from '../lib/helpers'
import saveImageIfNeeded from '../lib/saveImage'
import NextPreviousNavigationLinks, { NavLink } from '../components/NextPreviousNavigationLinks'

const databaseId = process.env.NOTION_DATABASE_ID

// TODO
type Post = any

/**
 * Notion のブロックから JSX エレメントを返却する
 */
const getJsxElementFromNotionBlock = (block: any): JSX.Element => {
  const { type, id } = block
  const value = block[type]
  const texts: any[] = value?.rich_text || []

  switch (type) {
    case 'paragraph':
      return <Text text={texts} id={id} key={id} />

    case 'heading_1':
      return <Heading text={texts} id={id} level={type} key={id} />

    case 'heading_2':
      return <Heading text={texts} id={id} level={type} key={id} />

    case 'heading_3':
      return <Heading text={texts} id={id} level={type} key={id} />

    case 'bulleted_list_item':
    case 'numbered_list_item':
      return <ListItem key={id} text={texts} id={id} />

    case 'to_do':
      return <ToDo id={id} key={id} value={value} text={value.text} />

    case 'toggle':
      return <Toggle key={id} text={value.text} children={value.children} />

    case 'image':
      // 外部埋め込み画像は現在非対応
      if (block.image.type === 'file') {
        return (
          <figure key={id} className={'mb-3'}>
            <img
              // src={value.file.url} // Notion s3 を使用する場合
              src={'/blogImages/' + block.id + '.png'}
              alt={getAltStr(value.caption)}
              className={'mb-2'}
            />
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
      return (
        <Code key={id} language={value.language}>
          {texts[0]?.plain_text}
        </Code>
      )

    case 'divider':
      return (
        <p key={id} className={'text-center'}>
          🐈
        </p>
      )

    // <hr className="w-full border-1 border-gray-300 dark:border-gray-400" key={id} />

    case 'quote':
      return (
        <blockquote
          className="italic border-neutral-500 quote border-l-2 px-4 py-1 text-sm mb-4"
          key={id}
        >
          {value.rich_text[0].plain_text}
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
  if (!page || !blocks) {
    return <div>ページが存在しません</div>
  }

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
  const database = await getNotionData(databaseId)

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

  const allData = await getNotionData(databaseId, {
    // NOTE: 2022/03/09 全てのデータを取得することにするのでコメントアウト（ページネーション用）
    // Notion API がカイゼンされたらロジックを見直す
    //
    // and: [
    //   {
    //     property: 'Slug',
    //     rich_text: {
    //       equals: slug,
    //     },
    //   },
    // ],
  })

  let nextIndex: number, prevIndex: number

  // Slug に一致するものだけをフィルタ
  const database = allData.filter((_, index) => {
    if (_.properties.Slug.rich_text[0].plain_text === slug) {
      // 最初の記事でなければ次（未来）の記事が存在
      if (index !== 0) nextIndex = index - 1

      // 最後の記事でなければ前（過去）の記事が存在
      if (index !== allData.length - 1) prevIndex = index + 1

      return true
    }
    return false
  })

  // ページのメタデータを取得する
  const page = await getPage(database[0].id)

  // ページの本文を取得する
  const blocks = await getBlocks(database[0].id)

  // ナビゲーション用
  const navLink: NavLink = {
    next: {
      title: allData[nextIndex]?.properties.Page.title[0]?.plain_text || '',
      slug: allData[nextIndex]?.properties.Slug.rich_text[0].plain_text || '',
    },
    prev: {
      title: allData[prevIndex]?.properties.Page.title[0]?.plain_text || '',
      slug: allData[prevIndex]?.properties.Slug.rich_text[0].plain_text || '',
    },
  }

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
