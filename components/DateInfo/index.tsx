import { getDateStr } from '../../lib/helpers'

interface DateInfoArgs {
  dateStr: string // 日付
}

const DateInfo = ({ dateStr }: DateInfoArgs) => {
  return (
    <span className="mr-2">
      <span className="fs12 mr-2">📆</span>
      {getDateStr(dateStr)}
    </span>
  )
}

export default DateInfo
