import { Client } from '@notionhq/client'
import { sleep } from './sleep'
import fs from 'fs'
import results1 from '../results1.json' // 記事詳細
import results2 from '../results2.json'
import results3 from '../results3.json'
import results4 from '../results4.json' // book 用
import results5 from '../results5.json' // web stock 用

// 開発モードの場合はローカルに保存したデータを利用するかどうか
const IS_USE_LOCAL_DATA = false

// ローカル開発用のデータを新しくするかどうか
const IS_DATA_REFRESH_MODE = true

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

/**
 * databaseId を引数に取り、Notion のデータベースから記事全件を取得し返却する
 * @param {string} databaseId
 */
export const getNotionData = async (databaseId: string, _filter: TODO = undefined) => {
  if (IS_USE_LOCAL_DATA) return results1

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

  // データリフレッシュ書き込み
  if (IS_DATA_REFRESH_MODE) {
    fs.writeFile('results5.json', JSON.stringify(results), (err) => {
      if (err) throw err
      console.log('正常に書き込みが完了しました')
    })
  }

  return results
}

export const getBlocks = async (blockId) => {
  if (IS_USE_LOCAL_DATA) return results2

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

  if (IS_DATA_REFRESH_MODE) {
    fs.writeFile('results2.json', JSON.stringify(results), (err) => {
      if (err) throw err
      console.log('正常に書き込みが完了しました')
    })
  }

  return results
}

export const getPage = async (pageId) => {
  if (IS_USE_LOCAL_DATA) return results3

  const response = await notion.pages.retrieve({ page_id: pageId })

  if (IS_DATA_REFRESH_MODE) {
    fs.writeFile('results3.json', JSON.stringify(response), (err) => {
      if (err) throw err
      console.log('正常に書き込みが完了しました')
    })
  }

  return response
}
