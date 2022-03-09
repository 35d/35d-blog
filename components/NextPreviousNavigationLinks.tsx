import Link from 'next/link'

export interface NavLink {
  next: {
    slug: string
    title: string
  }
  prev: {
    slug: string
    title: string
  }
}

interface Props {
  navLink: NavLink
}

const NextPreviousNavigationLinks = ({ navLink }: Props) => {
  return (
    <nav className="nav">
      <ul className="flex gap-x-4">
        {navLink.next.slug.length > 0 && (
          <li className="flex-1 list-none">
            <Link href={'/' + navLink.next.slug} prefetch={false}>
              <a className="flex items-center no-underline">
                <span className="mr-2 text-lg">&lt;</span>
                <span className="line-clamp-2">{navLink.next.title}</span>
              </a>
            </Link>
          </li>
        )}
        {navLink.prev.slug.length > 0 && (
          <li className="flex-1 list-none">
            <Link href={'/' + navLink.prev.slug} prefetch={false}>
              <a className="flex justify-end items-center no-underline">
                <span className="text-right line-clamp-2">{navLink.prev.title}</span>
                <span className="ml-2 text-lg">&gt;</span>
              </a>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default NextPreviousNavigationLinks
