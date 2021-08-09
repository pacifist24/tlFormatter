import { VFC } from 'react'
import { TextField } from '@material-ui/core'

type Props = {
  headerFormat: string
  handleHeaderFormatChange: (val: string) => void
  selfUbFormat: string
  handleSelfUbFormatChange: (val: string) => void
  bossUbFormat: string
  handleBossUbFormatChange: (val: string) => void
  footerFormat: string
  handleFooterFormatChange: (val: string) => void
}

const FormatTab: VFC<Props> = ({
  headerFormat,
  handleHeaderFormatChange,
  selfUbFormat,
  handleSelfUbFormatChange,
  bossUbFormat,
  handleBossUbFormatChange,
  footerFormat,
  handleFooterFormatChange,
}) => (
  <>
    <div className="flex flex-col items-center mt-2">
      <TextField
        margin="dense"
        className="w-11/12"
        size="small"
        label="ヘッダー部"
        variant="outlined"
        multiline={true}
        minRows={1}
        maxRows={10}
        value={headerFormat}
        onChange={(e) => handleHeaderFormatChange(e.target.value)}
      />
      <TextField
        margin="dense"
        className="w-11/12"
        size="small"
        label="​UB発動(味方)"
        variant="outlined"
        multiline={true}
        minRows={1}
        maxRows={10}
        value={selfUbFormat}
        onChange={(e) => handleSelfUbFormatChange(e.target.value)}
      />
      <TextField
        margin="dense"
        className="w-11/12"
        size="small"
        label="​UB発動(ボス)"
        variant="outlined"
        multiline={true}
        minRows={1}
        maxRows={10}
        value={bossUbFormat}
        onChange={(e) => handleBossUbFormatChange(e.target.value)}
      />
      <TextField
        margin="dense"
        className="w-11/12"
        size="small"
        label="フッター部"
        variant="outlined"
        multiline={true}
        minRows={1}
        maxRows={10}
        value={footerFormat}
        onChange={(e) => handleFooterFormatChange(e.target.value)}
      />
    </div>
  </>
)
export default FormatTab
