import { getDateStr } from '../../lib/helpers'

interface DateInfoArgs {
  dateStr: string // 日付
  lastUpdatedAtStr: string // 最終更新日
}

const DateInfo = ({ dateStr, lastUpdatedAtStr }: DateInfoArgs) => {
  // 最終更新日を表示するかどうか
  const shouldShowLastUpdatedDate = dateStr !== lastUpdatedAtStr

  return (
    <span className="mr-2">
      <span className="fs12 mr-2">📆</span>
      {getDateStr(dateStr)}
      {shouldShowLastUpdatedDate && `（最終更新日：${getDateStr(lastUpdatedAtStr)}）`}
    </span>
  )
}

export default DateInfo
