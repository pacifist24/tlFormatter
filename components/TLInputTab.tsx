import { VFC } from 'react'

const TLInputTab: VFC<{
  tl: string
  onChange: (val: string) => void
}> = ({ tl, onChange }) => (
  <>
    <textarea
      className="w-full h-screen p-2 resize-none focus:outline-none"
      value={tl}
      onChange={(e) => {
        onChange(e.target.value)
      }}
      placeholder="アプリから取得したTLを貼りつけてください"
    />
  </>
)
export default TLInputTab
