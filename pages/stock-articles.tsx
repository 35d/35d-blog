import Link from 'next/link'
import Header from '../components/Header'
import Heading1 from '../components/Heading1'
import { ListItem } from '../components/PostItem'
import BlockHeading from '../components/BlockHeading'
import { getNotionData } from '../lib/getNotionData'

const LINK = '2020-10-27-notion-stock-article'
const ID = '93082d8d4b424ac8b67bfa7d4a37e633'

export async function getStaticProps() {
  const database = await getNotionData(ID)

  return {
    props: {
      stockArticles: database,
    },
    revalidate: 60,
  }
}

const StockArticles = (props) => {
  // console.log(props.stockArticles.map((_) => _.properties))
  interface BookForRender {
    date: string
    stockArticles: any
  }

  const tempStockArticlesForRender: BookForRender[] = []
  const stockArticlesForRender: BookForRender[] = []

  // [0] まずはすべて代入
  props.stockArticles
    .map((_) => _.properties)
    .forEach((_) => {
      tempStockArticlesForRender.push({ date: _.Date.select.name, stockArticles: [_] })
    })

  // console.log(tempStockArticlesForRender)

  // [1] ソートする
  tempStockArticlesForRender.sort((a, b) => {
    if (b.date < a.date) {
      return -1
    }
    if (b.date > a.date) {
      return 1
    }

    return 0
  })

  // [2] 重複削除
  let a = ''
  tempStockArticlesForRender.forEach((_) => {
    if (a !== _.date) {
      stockArticlesForRender.push({ date: _.date, stockArticles: [_.stockArticles[0]] })
      a = _.date
    } else {
      stockArticlesForRender.forEach((__, index) => {
        if (__.date === _.date) stockArticlesForRender[index].stockArticles.push(_.stockArticles[0])
      })
    }
  })

  return (
    <div>
      {props.stockArticles.length === 0 && <p>There are no posts yet</p>}
      <div>
        <Header
          titlePre={`気になった WEB ページ一覧`}
          ogImageUrl="https://blog.35d.jp/ogp/2021-01-04-01.jpg"
        />
        <div className="mb-4">
          <Heading1>気になった WEB ページ一覧</Heading1>
        </div>
        <p>
          読んでて良いなと思った記事やツイート等のストックをこのサイトで公開しています。
          日付は僕がストックした日です（記事の公開日ではありません）。どういう仕組みになってるかの説明は
          <Link href={LINK} prefetch={false}>
            <a className="b">こちら</a>
          </Link>
          。
        </p>
        <hr className="hr border-gray-300 dark:border-gray-400" />
        <div>
          {stockArticlesForRender.map((_, i) => {
            return (
              <section key={_.date + i} className="mb-4">
                <div className="mb-2">
                  <BlockHeading>{_.date}</BlockHeading>
                </div>
                <ul className="list-none">
                  {_.stockArticles.map((_, i) => {
                    return (
                      <div key={_.title + i}>
                        <ListItem
                          title={_.title.title[0]?.plain_text}
                          url={_.url.url}
                          subTitle={_.comment.rich_text[0]?.plain_text}
                          isExtLink={true}
                        />
                      </div>
                    )
                  })}
                </ul>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default StockArticles
