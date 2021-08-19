import { VFC } from 'react'

const TLOutputTab: VFC<{
  tl: string
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
}> = ({ tl, setAlertState }) => {
  return (
    <>
      <main className="flex flex-col h-full border-t border-l border-gray-200">
        <button
          className="h-screen"
          onClick={() => {
            navigator.clipboard.writeText(tl)
            setAlertState({
              open: true,
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
              },
              severity: 'success',
              autoHideDuration: 2000,
              message: '出力TLをコピーしました',
            })
          }}
          title="出力TLをコピー"
        >
          <textarea
            className="w-full h-full p-2 cursor-pointer resize-none focus:outline-none"
            value={tl}
            readOnly
          />
        </button>
      </main>
    </>
  )
}
export default TLOutputTab
