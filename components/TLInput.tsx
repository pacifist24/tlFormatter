import { VFC } from 'react'

const TLInput: VFC<{
  tl: string
  onChange: any
}> = ({ tl, onChange }) => (
  <>
    <textarea
      className="h-screen w-full focus:outline-none p-2"
      value={tl}
      onChange={onChange}
      onPaste={onChange}
      placeholder="TLを貼りつけてください"
    />
  </>
)
export default TLInput
