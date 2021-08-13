import { VFC } from 'react'
import { TextField } from '@material-ui/core'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
type Props = {
  minutes: number
  handleChangeMin: (val: number) => void
  seconds: number
  handleChangeSec: (val: number) => void
  namePadding: string
  handleChangeNamePadding: (val: string) => void
}

const ConfigTab: VFC<Props> = ({
  minutes,
  handleChangeMin,
  seconds,
  handleChangeSec,
  namePadding,
  handleChangeNamePadding,
}) => {
  return (
    <>
      <div>
        <h1 className="mx-3 mt-3 text-lg font-medium">バトル開始時間変換</h1>
        <p className="mx-5 mt-2 text-sm">
          持ち越しのためTLの記述時間をずらしたい場合の設定
        </p>
        <div className="flex items-center mt-5 ml-10">
          <TextField
            label="分"
            variant="outlined"
            type="number"
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            value={minutes}
            onChange={(e) => handleChangeMin(parseInt(e.target.value))}
            inputProps={{ min: 0, max: 1 }}
            className="w-20 pl-2 mt-10"
          />
          <span className="mx-2">分</span>
          <TextField
            label="秒"
            variant="outlined"
            type="number"
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            value={seconds}
            onChange={(e) => handleChangeSec(parseInt(e.target.value))}
            inputProps={{
              min: minutes === 1 ? 0 : 21,
              max: minutes === 1 ? 30 : 59,
            }}
            className="w-20 pl-2 mt-10"
          />
          <span className="mx-2">秒</span>
        </div>

        <h1 className="mx-3 mt-6 text-lg font-medium">パディング</h1>
        <p className="mx-5 mt-2 text-sm">
          名前の長さが最大のキャラクターに合わせて
          <br />
          名前の短いキャラの前方もしくは後方に空白を挿入する
          <br />
        </p>
        <div className="flex items-center mt-5 ml-10">
          <FormControl component="fieldset">
            <RadioGroup
              value={namePadding}
              name="radio-buttons-group"
              onChange={(e) => handleChangeNamePadding(e.target.value)}
            >
              <FormControlLabel
                value="none"
                control={<Radio size="small" color="primary" />}
                label="無し"
              />
              <FormControlLabel
                value="head"
                control={<Radio size="small" color="primary" />}
                label="前方"
              />
              <FormControlLabel
                value="tail"
                control={<Radio size="small" color="primary" />}
                label="後方"
              />
            </RadioGroup>
          </FormControl>
        </div>
      </div>
    </>
  )
}
export default ConfigTab
