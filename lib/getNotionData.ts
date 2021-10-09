import { Client } from '@notionhq/client'
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints'
import { sleep } from './sleep'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

export const getNotionData = async (databaseId: string, filter: any = undefined) => {
  console.log('🤟 getNotionData, fetch start ...')
  let results = []
  let hasMore = true // 再帰フェッチ用フラグ
  let cursor // 再帰フェッチ用フラグ

  //
  while (hasMore) {
    const response = await notion.databases.query({
      database_id: databaseId,
      // Sort posts in descending order based on the Date column.
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
    console.log('.')
  }

  console.log('🤟 getNotionData, fetch done')
  return results
}

export const getPage = async (pageId) => {
  console.log('👌 getPageData, fetch start ...')
  const response = await notion.pages.retrieve({ page_id: pageId })
  console.log('👌 getPageData, fetch done ...')
  return response
}

export const getBlocks = async (blockId) => {
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
    console.log('.')
  }

  console.log('👌 getBlocks, fetch done')
  return results
}
