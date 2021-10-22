import ExtLink from './ExtLink'

const ExternalLink = ({ href, children }) => (
  <a
    className="text-gray-500 hover:text-gray-600 transition"
    target="_blank"
    rel="noopener noreferrer"
    href={href}
  >
    {children}
  </a>
)

export default function Footer() {
  return (
    <footer className="flex flex-col justify-center items-start mx-auto w-full mb-8">
      <hr className="w-full border-1 border-gray-300 dark:border-gray-400" />
      <div className="w-full max-w-2xl grid grid-cols-1 pb-16 text-center">
        <div className="flex flex-col">
          <p className="text-sm mb-2">
            Built with{' '}
            <ExtLink className="" href={'https://nextjs.org/'}>
              Next.js
            </ExtLink>{' '}
            +{' '}
            <ExtLink className="" href={'https://developers.notion.com/'}>
              Notion API
            </ExtLink>{' '}
            （
            <ExtLink className="" href={'https://github.com/35d/35d-blog'}>
              ソースコード
            </ExtLink>
            ）
          </p>
          <p className="text-sm">
            <small className="text-sm mr-2">
              <ExtLink className="no-underline" href={'https://blog.35d.jp/'}>
                © 35D BLOG
              </ExtLink>
            </small>
            <span>
              <ExtLink className="" href={'https://buy.stripe.com/8wM8Addc9e6N9JSaEE'}>
                投げ銭
              </ExtLink>
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
