import { GetServerSidePropsContext } from 'next'
import { generateFeedXml } from '../lib/feed'

export const getServerSideProps = async ({ res }: GetServerSidePropsContext) => {
  const xml = await generateFeedXml()

  res.statusCode = 200
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate') // 24時間キャッシュする
  res.setHeader('Content-Type', 'text/xml')
  res.end(xml)

  return {
    props: {},
  }
}

const Page = () => null
export default Page
