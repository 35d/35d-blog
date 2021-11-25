import RSS from 'rss'
import { getNotionData } from './getNotionData'

export const generateFeedXml = async () => {
  const feed = new RSS({
    title: '35D BLOG',
    description:
      '@___35d のブログです。Notion / Notion Blog / Fast Notion についての情報を中心に発信しています。また、読んだ本や、観た動画、勉強したことについても書いていきます。',
    site_url: 'https://blog.35d.jp',
    feed_url: 'https://blog.35d.jp/feed',
    language: 'ja',
    image_url: 'https://blog.35d.jp/og-image.png',
  })

  const database = await getNotionData(process.env.NOTION_DATABASE_ID)

  database.forEach((post) => {
    const description = encodeURIComponent(
      post.properties.Description.rich_text[0]?.plain_text || ''
    )

    feed.item({
      title: post.properties.Page.title[0].plain_text,
      description,
      date: new Date(post.properties.Date.date.start),
      url: `https://blog.35d.jp/${post.properties.Slug.rich_text[0]?.plain_text}`,
    })
  })

  // XML形式の文字列にする
  return feed.xml()
}
