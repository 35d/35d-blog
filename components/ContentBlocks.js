import ExtLink from './ExtLink'

const SpanText = ({ text, id }) => {
  if (!text) return null

  return text.map((value, i) => {
    const {
      annotations: { bold, code, color, italic, strikethrough, underline },
      text,
    } = value

    // 外部リンクかどうか 通常テキストだったら false
    const isExtLink = !!text.link && !text.link.url.includes('blog.35d.jp')

    return (
      <span
        key={id + i}
        className={[
          bold ? 'font-bold' : '',
          code
            ? 'text-gray-900 bg-gray-300 dark:bg-gray-900 dark:text-gray-200 p-1 font-mono text-sm rounded-sm'
            : '',
          italic ? 'italic' : '',
          strikethrough ? 'line-through' : '',
          underline ? 'underline' : '',
        ].join(' ')}
        style={color !== 'default' ? { color } : {}}
      >
        {text.link ? (
          // 外部リンクだった場合
          isExtLink ? (
            <ExtLink href={text.link.url} className="underline">
              {text.content}
            </ExtLink>
          ) : (
            <a href={text.link.url} className="underline">
              {text.content}
            </a>
          )
        ) : (
          text.content
        )}
      </span>
    )
  })
}

export const Text = ({ text, id }) => {
  return (
    <p className="mb-4">
      <SpanText text={text} id={id} />
    </p>
  )
}
export const ListItem = ({ text, id }) => {
  return (
    <li>
      <SpanText text={text} id={id} />
    </li>
  )
}

export const Heading = ({ text, level, id }) => {
  switch (level) {
    case 'heading_1':
      return (
        <h1 className="font-bold text-lg md:text-xl tracking-tight my-2 md:my-3">
          {text[0].text.content}
        </h1>
      )
    case 'heading_2':
      return (
        <h2 className="font-bold text-lg md:text-xl tracking-tight my-2 md:my-3">
          {text[0].text.content}
        </h2>
      )
    case 'heading_3':
      return (
        <h3 className="font-bold text-lg md:text-xl tracking-tight my-2 md:my-3">
          {text[0].text.content}
        </h3>
      )
    default:
      return null
  }
}

export const ToDo = ({ id, value, text }) => {
  return (
    <div>
      <label htmlFor={id}>
        <input type="checkbox" id={id} defaultChecked={value.checked} /> {text[0].text.content}
      </label>
    </div>
  )
}

export const Toggle = ({ text, children }) => {
  return (
    <details>
      <summary className="cursor-pointer">{text[0].text.content}</summary>
      {children?.map((block) => {
        if (block.type === 'paragraph') {
          return <Text key={block.id} text={block.paragraph.text} id={block.id} />
        }
      })}
    </details>
  )
}
