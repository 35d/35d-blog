import { Client } from '@notionhq/client'
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints'
import { sleep } from './sleep'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

export const getNotionData = async (databaseId) => {
  let results = []
  let hasMore = true // 再帰フェッチ用フラグ
  let cursor // 再帰フェッチ用フラグ

  //
  while (hasMore) {
    sleep(500) // API 制限によって調整

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
    })
    results = results.concat(response.results)
    hasMore = response.has_more
    cursor = response.next_cursor
  }

  console.log(results.length)

  return results
}

export const getPage = async (pageId) => {
  const response = await notion.pages.retrieve({ page_id: pageId })
  return response
}

export const getBlocks = async (blockId) => {
  const response = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 50,
  })
  return response.results
}
