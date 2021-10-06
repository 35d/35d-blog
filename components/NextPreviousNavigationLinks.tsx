import Link from 'next/link'

export interface NavLink {
  next: {
    slug: string | undefined
    title: string | undefined
  }
  prev: {
    slug: string | undefined
    title: string | undefined
  }
}

interface Props {
  navLink: NavLink
}

const NextPreviousNavigationLinks = ({ navLink }: Props) => {
  return (
    <nav className="nav">
      <ul>
        <li>
          <span>（次の記事）</span>
          <Link href={'/' + navLink.next.slug} prefetch={false}>
            <a>{navLink.next.title}</a>
          </Link>
        </li>
        <li>
          <span>（前の記事）</span>
          <Link href={'/' + navLink.prev.slug} prefetch={false}>
            <a>{navLink.prev.title}</a>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default NextPreviousNavigationLinks
