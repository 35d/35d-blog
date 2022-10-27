import { Client } from '@notionhq/client'
import { sleep } from './sleep'
import fs from 'fs'
import results1 from '../results1.json' // 記事一覧
import results2 from '../results2.json' // 記事詳細・本文（部分的なデータにしかならないので注意）
import results3 from '../results3.json' // 記事のメタ情報
import results4 from '../results4.json' // book 用 記事一覧
import results5 from '../results5.json' // web stock 用 記事一覧

// ローカルに保存したデータを利用するかどうか（開発時のみ true にする）
const SHOULD_USE_LOCAL_DATA = true

// ローカル開発用のデータを更新するかどうか
const SHOULD_REFRESH_LOCAL_DATA = false

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

/**
 * databaseId を引数に取り、Notion のデータベースから記事全件を取得し返却する
 * @param {string} databaseId
 */
export const getNotionDataList = async (databaseId: string, _filter: TODO = undefined) => {
  if (SHOULD_USE_LOCAL_DATA) return results1

  console.log('🤟 getNotionData, fetch start ...')
  let results = []
  let hasMore = true // 再帰フェッチ用フラグ
  let cursor // 再帰フェッチ用フラグ

  // フィルタのベースとなるオブジェクト。Published のもののみを取得する。
  const filter = {
    and: [
      {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
    ],
  }

  if (_filter?.and) {
    filter.and.push(..._filter.and)
  }

  // console.log(filter)

  //
  while (hasMore) {
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
      start_cursor: cursor,
      filter,
    })

    results = results.concat(response.results)
    hasMore = response.has_more
    cursor = response.next_cursor
    await sleep(400)
    console.log('.')
  }

  console.log('🤟 getNotionData, fetch done')

  // データリフレッシュ・書き込み
  if (SHOULD_REFRESH_LOCAL_DATA) {
    fs.writeFile('results1.json', JSON.stringify(results), (err) => {
      if (err) throw err
      console.log('正常に書き込みが完了しました')
    })
  }

  return results
}

export const getBlocks = async (blockId) => {
  if (SHOULD_USE_LOCAL_DATA) return results2

  console.log('👌 getBlocks, fetch start ...')

  let results = []
  let hasMore = true // 再帰フェッチ用フラグ
  let cursor // 再帰フェッチ用フラグ

  while (hasMore) {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 50,
      start_cursor: cursor,
    })

    results = results.concat(response.results)
    hasMore = response.has_more
    cursor = response.next_cursor
    await sleep(400)
    console.log('.')
  }

  console.log('👌 getBlocks, fetch done')

  if (SHOULD_REFRESH_LOCAL_DATA) {
    fs.writeFile('results2.json', JSON.stringify(results), (err) => {
      if (err) throw err
      console.log('👌 results2.json に正常に書き込みが完了しました')
    })
  }

  return results
}

export const getPage = async (pageId) => {
  if (SHOULD_USE_LOCAL_DATA) return results3

  const response = await notion.pages.retrieve({ page_id: pageId })

  if (SHOULD_REFRESH_LOCAL_DATA) {
    fs.writeFile('results3.json', JSON.stringify(response), (err) => {
      if (err) throw err
      console.log('正常に書き込みが完了しました')
    })
  }

  return response
}
