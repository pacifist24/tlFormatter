import { VFC } from 'react'
import { Select } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'

const TimeSelectBox: VFC<{
  upperLimit: number
  value: number
  setValue: (val: number) => void
}> = ({ upperLimit, value, setValue }) => (
  <FormControl size="small" variant="outlined" className="w-20">
    <InputLabel>時間</InputLabel>
    <Select
      label="時間"
      value={value}
      onChange={(e) => setValue(e.target.value as number)}
    >
      {Array.from(new Array(upperLimit))
        .map((v, i) => i + 1)
        .reverse()
        .map((val) => (
          <MenuItem value={val} key={val}>
            {Math.floor(val / 60)}:{val % 60 < 10 ? '0' + (val % 60) : val % 60}
          </MenuItem>
        ))}
    </Select>
  </FormControl>
)
export default TimeSelectBox
