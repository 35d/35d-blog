import Link from 'next/link'
import { useDarkMode } from '../pages'
import ExtLink from './ExtLink'

const navItems: { label: string; page?: string; link?: string }[] = [
  { label: 'ABOUT', page: '/2021-08-19-about' },
  { label: 'ARTICLES', page: '/posts' },
  { label: 'WEB CLIPS', page: '/stock-articles' },
  { label: 'READ BOOKS', page: '/books' },
  { label: 'PROFILE', page: '/2020-09-19-profile' },
  { label: 'RSS FEED', page: '/feed' },
  // { label: 'FAST NOTION', page: '/2021-04-22-fast-notion-help-center' },
]

const Navigation = ({ titlePre = '', ogImageUrl = '', description = '', slug = '' }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  return (
    <header className={`z-50 static sm:fixed w-full sm:w-36 ml-0 mb-10`}>
      <ul className="list-none">
        <li className={'mb-4 font-bold text-lg'}>
          <Link href={'/'} prefetch={false}>
            <a className="no-underline">35D BLOG</a>
          </Link>
        </li>
        {navItems.map(({ label, page, link }) => (
          <li key={label} className={'text-sm mb-3'}>
            {page ? (
              <Link href={page} prefetch={false}>
                <a className="no-underline hover:bg-gray-300 dark:hover:bg-gray-900">{label}</a>
              </Link>
            ) : (
              <ExtLink href={link}>{label}</ExtLink>
            )}
          </li>
        ))}
        <li className={'text-sm mb-3'}>
          <ExtLink
            href={'https://note.com/35d'}
            className="no-underline hover:bg-gray-300 dark:hover:bg-gray-900"
          >
            note
          </ExtLink>{' '}
          /{' '}
          <ExtLink
            href={'https://www.youtube.com/channel/UCMBoZr4HyLmDGyv5tIQ006g'}
            className="no-underline hover:bg-gray-300 dark:hover:bg-gray-900"
          >
            YouTube
          </ExtLink>
        </li>
        <li className={'text-sm mb-3'}>
          <ExtLink
            href={'https://twitter.com/___35d'}
            className="no-underline hover:bg-gray-300 dark:hover:bg-gray-900"
          >
            Twitter
          </ExtLink>
        </li>
      </ul>
      <button onClick={toggleDarkMode}>{isDarkMode ? '🌑' : '🌝'}</button>
    </header>
  )
}

export default Navigation
