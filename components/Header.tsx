import { VFC } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import { isMobile } from 'react-device-detect'

type Props = {
  handleClickShare: () => void
  url: string
  snackBarOpen: boolean
  handleChangeSnackBarOpen: (val: boolean) => void
}

const Header: VFC<Props> = ({
  handleClickShare,
  url,
  snackBarOpen,
  handleChangeSnackBarOpen,
}) => {
  return (
    <header className="flex relative z-10 h-16 top-0 left-0 flex-none py-3 pl-5 items-center space-x-4">
      <div className="flex-initial text-2xl font-bold font-mono">
        TL
        <span className="italic text-turquoise-500 text-lg ml-1 tracking-tight">
          FORMATTER
        </span>
      </div>
      {!isMobile && ( //モバイル版ではShare後にコピーできないため非表示
        <>
          <div className="flex-initial">
            <button
              className="relative flex-none rounded-md border border-gray-200 text-sm font-medium leading-5 py-4 px-8 focus:border-turquoise-500 focus:outline-none focus:shadow-outline hover:bg-gray-50 ml-1"
              onClick={(e) => {
                handleClickShare()
                e.currentTarget.blur()
              }}
            >
              <span className="absolute inset-0 flex items-center justify-center">
                Share
              </span>
            </button>
          </div>
          {url && (
            <div className="flex-initial">
              <button
                className="group flex-auto min-w-0 flex items-center space-x-1.5 text-sm leading-5 font-medium text-gray-500 hover:text-gray-900 ml-1"
                title={process.env.siteUrl + url}
                onClick={() => {
                  navigator.clipboard.writeText(process.env.siteUrl + url)
                  handleChangeSnackBarOpen(true)
                }}
              >
                <span className="truncate">{'/' + url}</span>
                <svg
                  width="20"
                  height="20"
                  xmlns="http://www.w3.org/2000/svg"
                  className="opacity-0 group-hover:opacity-100 group-focus:opacity-100"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
            </div>
          )}
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            onClose={() => handleChangeSnackBarOpen(false)}
            open={snackBarOpen}
            autoHideDuration={1000}
            message="URLをコピーしました"
          />
        </>
      )}
    </header>
  )
}
export default Header
