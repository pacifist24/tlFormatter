import { VFC } from 'react'
import { Button } from '@material-ui/core'
import { TextField } from '@material-ui/core'
import { Select } from '@material-ui/core'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import TimeSelectBox from './TimeSelectBox'

const TLInputTab: VFC<{
  mode: string
  setMode: (val: string) => void
  phase: number
  setPhase: (val: number) => void
  damage: number
  setDamage: (val: number) => void
  bossName: string
  setBossName: (val: string) => void
  battleDate: string
  setBattleDate: (val: string) => void
  characters: {
    lv: number
    name: string
    star: number
    rank: number
    specialLv: number
    remark: string
  }[]
  setCharacters: (
    val: {
      lv: number
      name: string
      star: number
      rank: number
      specialLv: number
      remark: string
    }[]
  ) => void
  startTime: number
  setStartTime: (val: number) => void
  endTime: number
  setEndTime: (val: number) => void
  timeline: { time: number; name: string; remark: string }[]
  setTimeline: (val: { time: number; name: string; remark: string }[]) => void
}> = ({
  mode,
  setMode,
  phase,
  setPhase,
  damage,
  setDamage,
  battleDate,
  setBattleDate,
  bossName,
  setBossName,
  characters,
  setCharacters,
  startTime,
  // setStartTime,
  // endTime,
  // setEndTime,
  timeline,
  setTimeline,
}) => {
  // テスト用

  return (
    <>
      <div
        className="flex-col items-center w-full h-screen overflow-scroll"
        placeholder="アプリから取得したTLを貼りつけてください"
      >
        <div className="flex self-center justify-center mt-5">
          <Button variant="contained" color="primary">
            クリップボードからTLを読み込み
          </Button>
        </div>
        <div className="flex mt-8 ml-5">
          <div>
            <FormControl size="small" variant="outlined" className="pl-2 w-36">
              <InputLabel id="mode-label">モード</InputLabel>
              <Select
                labelId="mode-label"
                id="mode-select"
                label="モード"
                value={mode}
                onChange={(e) => setMode(e.target.value as string)}
              >
                <MenuItem value="クラン">クラン</MenuItem>
                <MenuItem value="模擬戦">模擬戦</MenuItem>
                <MenuItem value="トレーニング">トレーニング</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="ml-2">
            <TextField
              label="段階"
              variant="outlined"
              type="number"
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{ min: 1, max: 5 }}
              className="w-16 pl-2 ml-2"
              value={phase}
              onChange={(e) => setPhase(parseInt(e.target.value))}
            />
          </div>
          <span className="flex items-center ml-1">段階目</span>
          <div className="ml-4">
            <TextField
              label="ボス名"
              variant="outlined"
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{ min: 0, max: 99999, step: 100 }}
              className="w-48 pl-2"
              value={bossName}
              onChange={(e) => setBossName(e.target.value)}
            />
          </div>
        </div>
        <div className="flex mt-3 ml-5">
          <div>
            <TextField
              label="ダメージ"
              variant="outlined"
              type="number"
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{ min: 0, max: 999999, step: 100 }}
              className="w-24 pl-2 ml-2"
              value={damage}
              onChange={(e) => {
                if (!e.target.value) {
                  setDamage(undefined)
                }
                const setVal = parseInt(e.target.value)
                if (setVal >= 0 && setVal <= 999999)
                  setDamage(parseInt(e.target.value))
              }}
            />
          </div>
          <span className="flex items-center ml-1">万ダメージ</span>
          <div className="ml-5">
            <TextField
              label="バトル日時"
              variant="outlined"
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{ min: 0, max: 99999, step: 100 }}
              className="w-48 pl-2"
              value={battleDate}
              onChange={(e) => setBattleDate(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-10">
          {characters.map((character, index) => (
            <div className="flex mt-3 ml-5" key={index}>
              <div className="w-48 ">
                <TextField
                  label="キャラ1名"
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{ min: 0, max: 99999, step: 100 }}
                  className="pl-2"
                  value={character.name}
                  onChange={(e) => {
                    const clone = characters.slice()
                    clone[index].name = e.target.value
                    setCharacters(clone)
                  }}
                />
              </div>
              <div className="ml-2">
                <TextField
                  label="星"
                  variant="outlined"
                  type="number"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{ min: 1, max: 6 }}
                  className="w-16 pl-2 ml-2"
                  value={character.star}
                  onChange={(e) => {
                    const clone = characters.slice()
                    clone[index].star = parseInt(e.target.value)
                    setCharacters(clone)
                  }}
                />
              </div>
              <div className="ml-2">
                <TextField
                  label="ランク"
                  variant="outlined"
                  type="number"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{ min: 1, max: 99 }}
                  className="w-20 pl-2 ml-2"
                  value={character.rank}
                  onChange={(e) => {
                    const clone = characters.slice()
                    clone[index].rank = parseInt(e.target.value)
                    setCharacters(clone)
                  }}
                />
              </div>
              <div className="ml-2">
                <TextField
                  label="キャラLV"
                  variant="outlined"
                  type="number"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{ min: 1, max: 999 }}
                  className="w-20 pl-2 ml-2"
                  value={character.lv}
                  onChange={(e) => {
                    const clone = characters.slice()
                    clone[index].lv = parseInt(e.target.value)
                    setCharacters(clone)
                  }}
                />
              </div>
              <div className="ml-2">
                <TextField
                  label="専用LV"
                  variant="outlined"
                  type="number"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{ min: 1, max: 999 }}
                  className="w-20 pl-2 ml-2"
                  value={character.specialLv}
                  onChange={(e) => {
                    const clone = characters.slice()
                    clone[index].specialLv = parseInt(e.target.value)
                    setCharacters(clone)
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10">
          {timeline.map((line, index) => (
            <div className="flex mt-3 ml-5" key={index}>
              <TimeSelectBox
                upperLimit={index === 0 ? startTime : timeline[index - 1].time}
                value={line.time}
                setValue={(val) => {
                  const clone = timeline.slice()
                  clone[index].time = val
                  setTimeline(clone)
                }}
              />
              <div className="ml-2">
                <FormControl size="small" variant="outlined">
                  <InputLabel>キャラ名</InputLabel>
                  <Select
                    label="キャラ名"
                    value={line.name}
                    fullWidth={true}
                    onChange={(e) => {
                      const clone = timeline.slice()
                      clone[index].name = e.target.value as string
                      setTimeline(clone)
                    }}
                  >
                    {characters.map((character, index) => (
                      <MenuItem value={character.name} key={index}>
                        {character.name}
                      </MenuItem>
                    ))}
                    <MenuItem value={bossName} key={5}>
                      {bossName}
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="flex-1 ml-2">
                <TextField
                  label="コメント"
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className="w-full"
                  value={line.remark}
                  onChange={(e) => {
                    const clone = characters.slice()
                    clone[index].remark = e.target.value
                    setCharacters(clone)
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
export default TLInputTab
