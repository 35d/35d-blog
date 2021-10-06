import Prism from 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-yaml'
import React, { useEffect } from 'react'

const Code = ({ children, language = 'javascript' }) => {
  useEffect(() => {
    Prism.highlightAll()
  }, [])

  return (
    <pre>
      <code
        dangerouslySetInnerHTML={{
          __html: Prism.highlight(children, Prism.languages[language]),
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
