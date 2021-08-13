import { VFC } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import { useState } from 'react'

const TLOutputTab: VFC<{
  tl: string
}> = ({ tl }) => {
  const [snackBarOpen, setSnackBarOpen] = useState(false)

  return (
    <>
      <main className="flex flex-col h-full border-t border-l border-gray-200">
        <button
          className="h-screen"
          onClick={() => {
            navigator.clipboard.writeText(tl)
            setSnackBarOpen(true)
          }}
          title="出力TLをコピー"
        >
          <textarea
            className="w-full h-full p-2 cursor-pointer resize-none focus:outline-none"
            value={tl}
            readOnly
          />
        </button>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          onClose={() => setSnackBarOpen(false)}
          open={snackBarOpen}
          autoHideDuration={1000}
          message="出力TLをコピーしました"
        />
      </main>
    </>
  )
}
export default TLOutputTab
