import { VFC } from 'react'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import { Select } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'

type Props = {
  startTime: number
  handleChangeStartTime: (val: number) => void
  namePadding: string
  handleChangeNamePadding: (val: string) => void
  arrange: string
  handleChangeArrange: (val: string) => void
}

const ConfigTab: VFC<Props> = ({
  startTime,
  handleChangeStartTime,
  namePadding,
  handleChangeNamePadding,
  arrange,
  handleChangeArrange,
}) => {
  return (
    <>
      <div>
        <h1 className="mx-3 mt-3 text-lg font-medium">バトル開始時間変換</h1>
        <p className="mx-5 mt-2 text-sm">
          持ち越しのためTLの記述時間をずらしたい場合の設定
        </p>
        <div className="mt-3 ml-10">
          <FormControl size="small" variant="outlined" className="w-20">
            <InputLabel>時間</InputLabel>
            <Select
              label="時間"
              value={startTime}
              onChange={(e) => handleChangeStartTime(e.target.value as number)}
            >
              {Array.from(new Array(70))
                .map((v, i) => i + 21)
                .reverse()
                .map((val) => (
                  <MenuItem value={val} key={val}>
                    {Math.floor(val / 60)}:
                    {val % 60 < 10 ? '0' + (val % 60) : val % 60}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>

        <h1 className="mx-3 mt-6 text-lg font-medium">
          同一秒数UB発動の場合のまとめ書き
        </h1>
        <p className="mx-5 mt-2 text-sm">
          同一秒数のUB発動でコメントが無い場合、横並べでまとめ書きする
        </p>
        <div className="flex items-center mt-5 ml-10">
          <FormControl component="fieldset" size="small">
            <RadioGroup
              value={arrange}
              name="radio-arrage"
              onChange={(e) => handleChangeArrange(e.target.value)}
            >
              <div className="flex">
                <div>
                  <FormControlLabel
                    value="none"
                    control={<Radio size="small" color="primary" />}
                    label="無し"
                  />
                </div>
                <div className="ml-3">
                  <FormControlLabel
                    value="same"
                    control={<Radio size="small" color="primary" />}
                    label="同行"
                  />
                </div>
                <div className="ml-3">
                  <FormControlLabel
                    value="next"
                    control={<Radio size="small" color="primary" />}
                    label="次行"
                  />
                </div>
              </div>
            </RadioGroup>
          </FormControl>
        </div>

        <h1 className="mx-3 mt-6 text-lg font-medium">パディング</h1>
        <p className="mx-5 mt-2 text-sm">
          名前の長さが最大のキャラクターに合わせて
          <br />
          名前の短いキャラの前方もしくは後方に空白を挿入する
        </p>
        <div className="flex items-center mt-5 ml-10">
          <FormControl component="fieldset" size="small">
            <RadioGroup
              value={namePadding}
              name="radio-name-padding"
              onChange={(e) => handleChangeNamePadding(e.target.value)}
            >
              <div className="flex">
                <div>
                  <FormControlLabel
                    value="none"
                    control={<Radio size="small" color="primary" />}
                    label="無し"
                  />
                </div>
                <div className="ml-3">
                  <FormControlLabel
                    value="head"
                    control={<Radio size="small" color="primary" />}
                    label="前方"
                  />
                </div>
                <div className="ml-3">
                  <FormControlLabel
                    value="tail"
                    control={<Radio size="small" color="primary" />}
                    label="後方"
                  />
                </div>
              </div>
            </RadioGroup>
          </FormControl>
        </div>
      </div>
    </>
  )
}
export default ConfigTab
