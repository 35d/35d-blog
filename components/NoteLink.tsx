import ExtLink from './ExtLink'

const NOTE_URL = 'https://note.com/35d/m/m7c560704a9b8'

const NoteLink = () => {
  return (
    <>
      <p className={'bg-gray-300 dark:bg-gray-900 p-3'}>
        ð ã
        <ExtLink href={NOTE_URL} className={`tdu`}>
          ï¼å°ãããã¢ãã¯ãªï¼Notion ã®ä½¿ãæ¹ã¾ã¨ã
        </ExtLink>
        ãã¨ãã note ãã¬ã¸ã³ã§ããæ¯é±1æ¬ Notion ã®ä½¿ãæ¹ã«é¢ããè¨äºãçºä¿¡ããã¦ãã¾ãã
        ãããããã°ãã¡ããè¦ãã¦ã¿ã¦ãã ããã
      </p>
    </>
  )
}

export default NoteLink
