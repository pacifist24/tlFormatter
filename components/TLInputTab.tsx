import { VFC } from 'react'

const TLInputTab: VFC<{
  tl: string
  onChange: any
}> = ({ tl, onChange }) => (
  <>
    <textarea
      className="resize-none h-screen w-full focus:outline-none p-2"
      value={tl}
      onChange={onChange}
      placeholder="アプリから取得したTLを貼りつけてください"
    />
  </>
)
export default TLInputTab
