import dayjs from 'dayjs'

export const getBlogLink = (slug: string) => {
  return `/${encodeURIComponent(slug)}`
}

export const getBlogTagLink = (tag: string) => {
  return `/tags/${encodeURIComponent(tag)}`
}

/**
 * 表示用の日付を返却する
 * @param date date の string
 * @returns 日付（2022/10/15）
 */
export const getDateStr = (dateStr: string | undefined) => {
  if (!dateStr) return ''
  return dayjs(dateStr).format('YYYY/MM/DD')
}

export const postIsReady = (post: any) => {
  return process.env.NODE_ENV !== 'production' || post.Published === 'Yes'
}

export const normalizeSlug = (slug) => {
  if (typeof slug !== 'string') return slug

  let startingSlash = slug.startsWith('/')
  let endingSlash = slug.endsWith('/')

  if (startingSlash) {
    slug = slug.substr(1)
  }
  if (endingSlash) {
    slug = slug.substr(0, slug.length - 1)
  }
  return startingSlash || endingSlash ? normalizeSlug(slug) : slug
}

export const getCaptionStr = (caption: TODO[]): string | undefined => {
  if (!caption) return undefined
  if (caption.length === 0) return undefined
  return caption[0].plain_text.split(' | ')[0]
}

export const getAltStr = (caption: TODO[]): string => {
  if (!caption) return ''
  if (caption.length === 0) return ''
  return caption[0].plain_text.split(' | ')[1]
}

/**
 * Slug(例: 2020-03-24-mujirushi から日付を取得して、それを返す)
 * @param {string} slug - slug
 * @returns {string} date - 2020/03/24
 */
export const slugToDate = (slug: string): string => {
  const splitedSlug = slug.split('-')
  if (splitedSlug.length < 3) return ''
  return splitedSlug[0] + '-' + splitedSlug[1] + '-' + splitedSlug[2]
}
