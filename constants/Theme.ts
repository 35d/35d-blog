declare module 'styled-components' {
  export interface DefaultTheme {
    background: string
    text: string
    codeBackground: string
  }
}

export const lightTheme = {
  text: '#06192d',
  background: '#FFF',
  codeBackground: '#d6dbe0',
}

export const darkTheme = {
  text: '#EEE',
  background: '#111',
  codeBackground: '#22252f',
}
