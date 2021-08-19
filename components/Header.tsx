import { VFC } from 'react'
import { useState } from 'react'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

type Props = {
  handleMenuLoadStyle: () => void
  handleMenuSaveStyle: () => void
  handleMenuInitStyle: () => void
  handleMenuSaveTL: () => Promise<void>
  handleStoreFavs: () => void
  handleFetchFavs: (id: string) => void
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
  handleStoreFavs,
  handleFetchFavs,
  setAlertState,
  url,
}) => {
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

  const [importFavsDialogOpen, setImportFavsDialogOpen] = useState(false)
  const [importCode, setImportCode] = useState('')

  return (
    <header className="relative top-0 left-0 z-10 flex items-center flex-none h-16 py-3 pl-5 space-x-4">
      <div>
        <Dialog
          open={importFavsDialogOpen}
          onClose={() => {
            setImportCode('')
            setImportFavsDialogOpen(false)
          }}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Favsのエクスポート</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Favsのエクスポートで出力された共有コードを入力してください
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="共有コード"
              value={importCode}
              onChange={(e) => setImportCode(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setImportCode('')
                setImportFavsDialogOpen(false)
              }}
              color="primary"
            >
              キャンセル
            </Button>
            <Button
              onClick={() => {
                handleFetchFavs(importCode)
                setImportCode('')
                setImportFavsDialogOpen(false)
              }}
              color="primary"
            >
              インポート
            </Button>
          </DialogActions>
        </Dialog>
      </div>
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
                  setAlertState({
                    open: true,
                    anchorOrigin: {
                      vertical: 'top',
                      horizontal: 'center',
                    },
                    severity: 'success',
                    autoHideDuration: 2000,
                    message: 'スタイルを前回保存時に戻しました',
                  })
                }}
              >
                <ListItemText primary="スタイルを前回保存時に戻す" />
              </ListItem>

              <ListItem
                button
                onClick={() => {
                  handleMenuSaveStyle()
                  setAlertState({
                    open: true,
                    anchorOrigin: {
                      vertical: 'top',
                      horizontal: 'center',
                    },
                    severity: 'success',
                    autoHideDuration: 2000,
                    message: 'ローカルにスタイルを保存しました',
                  })
                }}
              >
                <ListItemText primary="スタイルの保存(ローカル)" />
              </ListItem>

              {/* <ListItem
                button
                onClick={() => {
                  handleMenuSaveStyle()
                  setAlertState({
                    open: true,
                    anchorOrigin: {
                      vertical: 'top',
                      horizontal: 'center',
                    },
                    severity: 'success',
                    autoHideDuration: 3000,
                    message:
                      'スタイルをエクスポートし、インポート用のコードをクリップボードにコピーしました',
                  })
                }}
              >
                <ListItemText primary="スタイルのエクスポート" />
              </ListItem>

              <ListItem
                button
                onClick={() => {
                  handleMenuInitStyle()
                  setAlertState({
                    open: true,
                    anchorOrigin: {
                      vertical: 'top',
                      horizontal: 'center',
                    },
                    severity: 'success',
                    autoHideDuration: 2000,
                    message: 'スタイルをインポートしました',
                  })
                }}
              >
                <ListItemText primary="スタイルのインポート" />
              </ListItem> */}

              <ListItem
                button
                onClick={() => {
                  handleMenuInitStyle()
                  setAlertState({
                    open: true,
                    anchorOrigin: {
                      vertical: 'top',
                      horizontal: 'center',
                    },
                    severity: 'success',
                    autoHideDuration: 2000,
                    message: 'スタイルを初期化しました',
                  })
                }}
              >
                <ListItemText primary="スタイルの初期化" />
              </ListItem>

              <Divider />

              <ListItem
                button
                onClick={() => {
                  handleMenuSaveTL()
                  setAlertState({
                    open: true,
                    anchorOrigin: {
                      vertical: 'top',
                      horizontal: 'center',
                    },
                    severity: 'success',
                    autoHideDuration: 2000,
                    message: 'TLを保存し、URLをクリップボードにコピーしました',
                  })
                }}
              >
                <ListItemText primary="TLの保存/URL出力" />
              </ListItem>

              <Divider />

              <ListItem
                button
                onClick={() => {
                  handleStoreFavs()
                }}
              >
                <ListItemText primary="Favsのエクスポート" />
              </ListItem>

              <ListItem
                button
                onClick={() => {
                  setImportFavsDialogOpen(true)
                }}
              >
                <ListItemText primary="Favsのインポート" />
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
              setAlertState({
                open: true,
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'center',
                },
                severity: 'success',
                autoHideDuration: 2000,
                message: 'URLをクリップボードにコピーしました',
              })
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
    </header>
  )
}
export default Header
