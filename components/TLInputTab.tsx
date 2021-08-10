import { VFC } from 'react'

const TLInputTab: VFC<{
  tl: string
  onChange: (val: string) => void
}> = ({ tl, onChange }) => (
  <>
    <textarea
      className="resize-none h-screen w-full focus:outline-none p-2"
      value={tl}
      onChange={(e) => {
        onChange(e.target.value)
      }}
      placeholder="アプリから取得したTLを貼りつけてください"
    />
  </>
)
export default TLInputTab
