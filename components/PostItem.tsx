import Link from 'next/link'
import tags from './Tags'
import { getBlogLink, slugToDate } from '../lib/helpers'
import ExtLink from '../components/ExtLink'

// TODO
type Post = any

/**
 * 記事一覧で使用するコンポーネント
 */
const PostItem = ({ post }: { post: Post }) => {
  return (
    <li className="list-none">
      <Link
        href="/[slug]"
        as={getBlogLink(post.properties.Slug.rich_text[0].plain_text)}
        prefetch={false}
      >
        <a className="no-underline font-medium hover:bg-gray-300 dark:hover:bg-gray-900">
          <span>{post.properties.Page.title[0].plain_text}</span>
        </a>
      </Link>
      <p className={'opacity-90'}>
        {slugToDate(post.properties.Slug.rich_text[0].plain_text)} {post.Tag && tags(post.Tag)}
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
          <ExtLink href={url} className={'no-underline'}>
            <a className="no-underline font-medium hover:bg-gray-300 dark:hover:bg-gray-900">
              <span>{title}</span>
            </a>
          </ExtLink>
        ) : (
          <Link href={url} as={url} prefetch={false}>
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
