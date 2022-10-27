import { getNotionDataList } from '../lib/getNotionData'
import path from 'path'
import fs from 'fs'

// キャッシュするファイル名
const CACHE_FILE_NAME = 'article-list-cache.json'

// キャッシュデータのパス
const ARTICLE_LIST_CACHE_DATA = path.resolve(CACHE_FILE_NAME)

// データベース ID
const DATABASE_ID = process.env.NOTION_DATABASE_ID

/**
 * 記事一覧を取得する
 * キャッシュがある場合は、キャッシュを返却する（プロダクションビルド時のパフォーマンス最適化のため）
 */
export const getArticleList = async (): Promise<TODO[]> => {
  // キャッシュが存在するかどうかを判定
  if (fs.existsSync(ARTICLE_LIST_CACHE_DATA)) {
    console.log('💥 Cache hit!')
    return JSON.parse(fs.readFileSync(CACHE_FILE_NAME, 'utf-8'))
  }

  // キャッシュがない場合は Notion からデータ Fetch する
  const database: TODO[] = await getNotionDataList(DATABASE_ID)

  // キャッシュファイルの書き込み
  fs.writeFile(CACHE_FILE_NAME, JSON.stringify(database), (err) => {
    if (err) throw err
    console.log(`✅ キャッシュファイルの書き込みが完了しました`)
  })

  return database
}
