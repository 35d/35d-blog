import Link from 'next/link'

const Tags = ({ tags }: { tags: string[] }) => {
  return (
    <>
      {tags.map((tag) => (
        <Link
          href={`/tags/[tagName]`}
          as={`/tags/${encodeURIComponent(tag)}`}
          passHref
          prefetch={false}
          key={tag}
        >
          <a className={`hover:bg-gray-300 dark:hover:bg-gray-900 mr-1`}>{tag}</a>
        </Link>
      ))}
    </>
  )
}

export default Tags
