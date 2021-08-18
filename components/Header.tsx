import { VFC } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import { useState } from 'react'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

type Props = {
  handleMenuLoadStyle: () => void
  handleMenuSaveStyle: () => void
  handleMenuInitStyle: () => void
  handleMenuSaveTL: () => Promise<void>
  url: string
}
const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
})
type Anchor = 'left'
const Header: VFC<Props> = ({
  handleMenuLoadStyle,
  handleMenuSaveStyle,
  handleMenuInitStyle,
  handleMenuSaveTL,
  url,
}) => {
  const [snackBarOpen, setSnackBarOpen] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState('')

  const classes = useStyles()
  const [state, setState] = useState({
    left: false,
  })

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }

      setState({ ...state, [anchor]: open })
    }

  return (
    <header className="relative top-0 left-0 z-10 flex items-center flex-none h-16 py-3 pl-5 space-x-4">
      <div>
        <Button onClick={toggleDrawer('left', true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </Button>
        <Drawer
          anchor={'left'}
          open={state['left']}
          onClose={toggleDrawer('left', false)}
        >
          <div
            className={clsx(classes.list)}
            role="presentation"
            onClick={toggleDrawer('left', false)}
            onKeyDown={toggleDrawer('left', false)}
          >
            <List>
              <ListItem
                button
                onClick={() => {
                  handleMenuLoadStyle()
                  setSnackBarMessage('スタイルを前回保存時に戻しました')
                  setSnackBarOpen(true)
                }}
              >
                <ListItemText primary="スタイルを前回保存時に戻す" />
              </ListItem>

              <ListItem
                button
                onClick={() => {
                  handleMenuSaveStyle()
                  setSnackBarMessage('スタイルを保存しました')
                  setSnackBarOpen(true)
                }}
              >
                <ListItemText primary="スタイルの保存" />
              </ListItem>

              <ListItem
                button
                onClick={() => {
                  handleMenuInitStyle()
                  setSnackBarMessage('スタイルを初期化しました')
                  setSnackBarOpen(true)
                }}
              >
                <ListItemText primary="スタイルの初期化" />
              </ListItem>
              <Divider />
              <ListItem
                button
                onClick={() => {
                  handleMenuSaveTL()
                  setSnackBarMessage(
                    'TLを保存し、URLをクリップボードにコピーしました'
                  )
                  setSnackBarOpen(true)
                }}
              >
                <ListItemText primary="TLの保存/URL出力" />
              </ListItem>
            </List>
          </div>
        </Drawer>
      </div>

      <div className="flex-initial font-mono text-2xl font-bold">
        TL
        <span className="ml-1 text-lg italic tracking-tight text-turquoise-500">
          FORMATTER
        </span>
      </div>

      {url && (
        <div className="flex-initial">
          <button
            className="flex items-center flex-auto min-w-0 ml-5 text-sm font-medium text-gray-500 group space-x-1.5 leading-5 hover:text-gray-900"
            title={process.env.siteUrl + url}
            onClick={() => {
              navigator.clipboard.writeText(process.env.siteUrl + url)
              setSnackBarOpen(true)
              setSnackBarMessage('URLをクリップボードにコピーしました')
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
        onClose={() => setSnackBarOpen(false)}
        open={snackBarOpen}
        autoHideDuration={1500}
        message={snackBarMessage}
      />
    </header>
  )
}
export default Header
