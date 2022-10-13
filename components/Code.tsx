import Prism from 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-lua'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-markdown'
import React, { useEffect } from 'react'

/**
 * 言語 string を表示用に変換して返却
 * NOTE: 言語の表示形式で気になるところがあったら case 追加する
 */
const getLanguageLabel = (language: string) => {
  let languageLabel = ''

  switch (language) {
    case 'javascript':
      languageLabel = 'JavaScript'
      break
    case 'Lua':
      languageLabel = 'Lua'
      break
    default:
      languageLabel = language
      break
  }

  return languageLabel
}

const Code = ({ children, language }) => {
  useEffect(() => {
    Prism.highlightAll()
  }, [])

  return (
    <pre className="relative">
      <p className="absolute bottom-0 right-4 text-gray-800 text-xs font-semibold bg-gray-200 mb-0 px-2 py-[2px]">
        {getLanguageLabel(language)}
      </p>
      <code
        dangerouslySetInnerHTML={{
          __html: Prism.highlight(
            children,
            Prism.languages[language] || Prism.languages['markdown'],
            language
          ),
        }}
      />

      <style jsx>{`
        code {
          vertical-align: middle;
          white-space: pre;
          word-break: break-all;
          max-width: 100%;
          display: block;
          font-size: 0.8rem;
          line-height: 1.4;
          padding: 1.25rem 1.5rem;
          margin: 0.85rem 0;
          background-color: #282c34;
          color: #ccc;
          border-radius: 6px;
          overflow: auto;
        }
      `}</style>
    </pre>
  )
}

export default Code
