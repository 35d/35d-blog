import Link from 'next/link'
import Tags from './Tags'
import { getBlogLink, slugToDate } from '../lib/helpers'
import ExtLink from '../components/ExtLink'

// TODO
type Post = any

/**
 * 記事一覧で使用するコンポーネント
 */
const PostItem = ({ post }: { post: Post }) => {
  const tags = post.properties.Tag.multi_select.map((_) => _.name)

  return (
    <li className="list-none">
      <Link href={getBlogLink(post.properties.Slug.rich_text[0].plain_text)}>
        <a className="no-underline font-medium hover:bg-gray-300 dark:hover:bg-gray-900">
          <span>{post.properties.Page.title[0].plain_text}</span>
        </a>
      </Link>
      <p className={'opacity-90'}>
        <span className="mr-2">{slugToDate(post.properties.Slug.rich_text[0].plain_text)}</span>
        <Tags tags={tags} />
      </p>
    </li>
  )
}

/**
 * TODO うまく抽象化したい
 * 👆 のコンポーネントと見た目の共通化できそう
 */
export const ListItem = ({ url, title, subTitle, isExtLink }) => {
  return (
    <li className="list-none">
      {url ? (
        isExtLink ? (
          <ExtLink
            href={url}
            className={'no-underline font-medium hover:bg-gray-300 dark:hover:bg-gray-900'}
          >
            <span>{title}</span>
          </ExtLink>
        ) : (
          <Link href={url}>
            <a className="no-underline font-medium hover:bg-gray-300 dark:hover:bg-gray-900">
              <span>{title}</span>
            </a>
          </Link>
        )
      ) : (
        <span className="font-medium">
          <span>{title}</span>
        </span>
      )}

      <p className={'opacity-90'}>{subTitle}</p>
    </li>
  )
}

export default PostItem
