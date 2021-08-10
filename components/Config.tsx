import { VFC } from 'react'
import { TextField } from '@material-ui/core'

type Props = {
  minutes: number
  handleChangeMin: any
  seconds: number
  handleChangeSec: any
}

const ConfigTab: VFC<Props> = ({
  minutes,
  handleChangeMin,
  seconds,
  handleChangeSec,
}) => {
  return (
    <>
      <div>
        <h1 className="text-lg font-medium mt-3 mx-3">バトル開始時間変換</h1>
        <p className="text-sm mx-5 mt-2">
          持ち越しでバトル開始時間が1:30ではない場合にTLの表示時間を実際のバトル開始時間に合わせて変更するための設定
        </p>
        <div className="flex ml-10 mt-5 items-center">
          <TextField
            label="分"
            variant="outlined"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            value={minutes}
            onChange={(e) => handleChangeMin(parseInt(e.target.value))}
            inputProps={{ min: 0, max: 1 }}
            className="w-20 mt-10 pl-2"
          />
          <span className="mx-2">分</span>
          <TextField
            label="秒"
            variant="outlined"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            value={seconds}
            onChange={(e) => handleChangeSec(parseInt(e.target.value))}
            inputProps={{
              min: minutes === 1 ? 0 : 21,
              max: minutes === 1 ? 30 : 59,
            }}
            className="w-20 mt-10 pl-2"
          />
          <span className="mx-2">秒</span>
        </div>
      </div>
    </>
  )
}
export default ConfigTab
