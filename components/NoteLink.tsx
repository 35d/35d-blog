import ExtLink from './ExtLink'

const NOTE_URL = 'https://note.com/35d/m/m7c560704a9b8'

const NoteLink = () => {
  return (
    <>
      <p className={'bg-gray-300 dark:bg-gray-900 p-3'}>
        🐈 「
        <ExtLink href={NOTE_URL} className={`tdu`}>
          （少しマニアックな）Notion の使い方まとめ
        </ExtLink>
        」という note マガジンでも、毎週1本 Notion の使い方に関する記事を発信をしています。
        もしよければそちらも覗いてみてください。
      </p>
    </>
  )
}

export default NoteLink
