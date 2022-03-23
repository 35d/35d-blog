import { Client } from '@notionhq/client'
import { sleep } from './sleep'
import fs from 'fs'
import results1 from '../results1.json'
import results2 from '../results2.json'
import results3 from '../results3.json'
import results4 from '../results4.json' // book 用

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

/**
 * databaseId を引数に取り、Notion のデータベースから記事全件を取得し返却する
 * @param {string} databaseId
 */
export const getNotionData = async (databaseId: string, _filter: TODO = undefined) => {
  // if (IS_DEVELOPMENT) return results4

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

  // 書き込み
  // fs.writeFile('results4.json', JSON.stringify(results), (err) => {
  //   if (err) throw err
  //   console.log('正常に書き込みが完了しました')
  // })

  return results
}

export const getBlocks = async (blockId) => {
  if (IS_DEVELOPMENT) return results2

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

  // fs.writeFile('results2.json', JSON.stringify(results), (err) => {
  //   if (err) throw err
  //   console.log('正常に書き込みが完了しました')
  // })

  return results
}

export const getPage = async (pageId) => {
  if (IS_DEVELOPMENT) return results3

  const response = await notion.pages.retrieve({ page_id: pageId })

  // fs.writeFile('results3.json', JSON.stringify(response), (err) => {
  //   if (err) throw err
  //   console.log('正常に書き込みが完了しました')
  // })

  return response
}
