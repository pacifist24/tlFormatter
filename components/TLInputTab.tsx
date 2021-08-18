import { VFC } from 'react'
import { Button } from '@material-ui/core'
import { TextField } from '@material-ui/core'

// 80⇒01:20のように秒を分秒表記に変更
const timeNum2Str = (timeNum: number) => {
  const min = Math.floor(timeNum / 60)
  const sec = timeNum % 60
  return ('00' + min).slice(-2) + ':' + ('00' + sec).slice(-2)
}

const TLInputTab: VFC<{
  mode: string
  phase: number
  damage: number
  bossName: string
  battleDate: string
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
  endTime: number
  timeline: { time: number; name: string; remark: string }[]
  setTimeline: (val: { time: number; name: string; remark: string }[]) => void
  handleReadTL: (tl: string) => void
  handleReadError: () => void
  nameConvs: { [key: string]: string }
  setAlertState: (alertState: {
    open: boolean
    anchorOrigin: {
      vertical: 'bottom' | 'top'
      horizontal: 'center' | 'left' | 'right'
    }
    severity: 'error' | 'info' | 'success' | 'warning'
    autoHideDuration: number
    message: string
  }) => void
}> = ({
  mode,
  phase,
  damage,
  battleDate,
  bossName,
  characters,
  setCharacters,
  startTime,
  endTime,
  timeline,
  setTimeline,
  handleReadTL,
  handleReadError,
  nameConvs,
  setAlertState,
}) => {
  // テスト用
  const maxCharacterNamLength = Math.max(
    ...characters.map(
      (character) => (nameConvs[character.name] ?? character.name).length
    )
  )
  return (
    <>
      <div
        className="flex-col items-center w-full h-screen pb-5 overflow-scroll"
        placeholder="アプリから取得したTLを貼りつけてください"
      >
        <div className="flex self-center justify-center mt-5">
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              navigator.clipboard
                .readText()
                .then((clipText) => {
                  handleReadTL(clipText)
                  setAlertState({
                    open: true,
                    anchorOrigin: {
                      vertical: 'top',
                      horizontal: 'center',
                    },
                    severity: 'success',
                    autoHideDuration: 2000,
                    message: 'TLの読み込みに成功しました',
                  })
                })
                .catch(handleReadError)
            }}
          >
            クリップボードからTLを読み込み
          </Button>
        </div>
        {mode && (
          <>
            <div className="flex mt-8 ml-5">
              <span>{mode}</span>
              <span>{phase}段階目</span>
              <span>{bossName}</span>
            </div>
            <div className="flex ml-5">
              <span>{damage}ダメージ</span>
            </div>
            <div className="flex ml-5">
              <span>バトル時間</span>
              <span className="ml-1">
                {timeNum2Str(startTime - endTime).substr(1)}
              </span>
            </div>
            <div className="flex ml-5">
              <span>バトル日時</span>
              <span className="ml-1">{battleDate}</span>
            </div>
            <div className="flex ml-5">
              <span>----</span>
            </div>
            <div className="flex ml-5">
              <span>◆パーティ編成</span>
            </div>
            <div className="mt-2">
              {characters.map((character, index) => (
                <div className="flex items-center mt-3 ml-5" key={index}>
                  <span style={{ width: maxCharacterNamLength + 'rem' }}>
                    {nameConvs[character.name] ?? character.name}
                  </span>
                  <span className="ml-1">★{character.star}</span>
                  <span className="ml-1">Lv{character.lv}</span>
                  <span className="ml-1">RANK{character.rank}</span>
                  <div className="ml-4">
                    <TextField
                      label="専用LV"
                      variant="outlined"
                      type="number"
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{ min: 0, max: 999 }}
                      className="w-20 pl-2 ml-2"
                      value={character.specialLv}
                      onChange={(e) => {
                        if (
                          !isNaN(parseInt(e.target.value)) &&
                          Number.isInteger(parseInt(e.target.value))
                        ) {
                          const clone = characters.slice()
                          clone[index].specialLv = parseInt(e.target.value)
                          setCharacters(clone)
                        }
                      }}
                    />
                  </div>
                  <div className="mx-4">
                    <TextField
                      label="コメント"
                      variant="outlined"
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      className="w-48"
                      value={character.remark}
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
            <div className="flex mt-3 ml-5">
              <span>----</span>
            </div>
            <div className="flex ml-5">
              <span>◆ユニオンバースト発動時間</span>
            </div>
            <div className="flex mt-3 ml-5">
              <span className="w-10">{timeNum2Str(startTime).substr(1)}</span>
              <span className="ml-1">バトル開始</span>
            </div>
            <div className="mt-3">
              {timeline.map((line, index) => (
                <div className="flex items-center mt-3 ml-5" key={index}>
                  <span className="w-10">
                    {timeNum2Str(line.time).substr(1)}
                  </span>
                  {line.name !== bossName && (
                    <span
                      className="ml-1"
                      style={{ width: maxCharacterNamLength + 1 + 'rem' }}
                    >
                      {nameConvs[line.name] ?? line.name}
                    </span>
                  )}
                  {line.name === bossName && (
                    <span
                      className="ml-1 font-bold text-red-500"
                      style={{ width: maxCharacterNamLength + 1 + 'rem' }}
                    >
                      {'BOSS'}
                    </span>
                  )}
                  <div className="flex-1 mx-3">
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
                        const clone = timeline.slice()
                        clone[index].remark = e.target.value
                        setTimeline(clone)
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="flex mt-3 ml-5">
                <span className="w-10">{timeNum2Str(endTime).substr(1)}</span>
                <span className="ml-1">バトル終了</span>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
export default TLInputTab
