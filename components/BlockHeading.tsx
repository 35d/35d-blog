import React from 'react'

const BlockHeading: React.FC = ({ children }) => {
  return (
    <h1
      className={
        'bg-gray-800 text-gray-200 dark:text-gray-800 dark:bg-gray-200 dark:font-semibold inline-block px-2 text-sm'
      }
    >
      {children}
    </h1>
  )
}

export default BlockHeading
