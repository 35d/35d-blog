import Link from 'next/link'

const Breadcrumbs = ({ route }: { route: string }) => {
  if (route === '/[slug]')
    return (
      <p className="fs-12 mb-2 opacity-80">
        <Link href={'/'} prefetch={false}>
          <span className="mr-2 hover:bg-gray-300 dark:hover:bg-gray-900 cursor-pointer">
            トップ
          </span>
        </Link>
        <span className="mr-2">/</span>
        <Link href={'/posts'} prefetch={false}>
          <span className="mr-2 hover:bg-gray-300 dark:hover:bg-gray-900 cursor-pointer">
            記事一覧
          </span>
        </Link>
      </p>
    )

  return null
}

export default Breadcrumbs
