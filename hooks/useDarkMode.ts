import { useLayoutEffect, useState } from 'react'

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true)

  useLayoutEffect(() => {
    setIsDarkMode(localStorage.getItem('theme') === 'dark')

    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // ダークモードとライトモードを切り替える
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)

    const switchedMode = isDarkMode ? 'light' : 'dark'
    setIsDarkMode(switchedMode === 'dark')
    window.localStorage.setItem('theme', switchedMode)
  }

  return { isDarkMode, toggleDarkMode }
}
