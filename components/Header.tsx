import { VFC } from 'react'
import { useState } from 'react'
import Button from '@material-ui/core/Button'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
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

import { outputRouteTextFile } from '../lib/searchRoute'
import { FavsInfo } from './FavsTab'

import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

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
  favs: {
    [key: string]: FavsInfo
  }
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      width: 250,
    },
    fullList: {
      width: 'auto',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      margin: 'auto',
      width: 'fit-content',
    },
    formControl: {
      marginTop: theme.spacing(3),
    },
  })
)
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
  favs,
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

  const [routeSearchDialogOpen, setRouteSearcDialogOpen] = useState(false)
  const [mustIncludeBoss, setMustIncludeBoss] = useState('')
  const [maxSearchNum, setMaxSearchNum] = useState(10)

  return (
    <header className="relative top-0 left-0 z-10 flex items-center flex-none h-16 py-3 pl-5 space-x-4">
      <div>
        <Dialog
          open={routeSearchDialogOpen}
          onClose={() => {
            setImportCode('')
            setRouteSearcDialogOpen(false)
          }}
          aria-labelledby="form-dialog-title2"
        >
          <DialogTitle id="form-dialog-title2">
            Favsから凸ルートを検索
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Favsの数によってはブラウザがフリーズする非常に重い処理となります（特に持ち越し編成の登録が多い場合）、本当に実行してもよろしいですか？
            </DialogContentText>
            <div className={classes.form}>
              <FormControl
                variant="outlined"
                margin="dense"
                className={classes.formControl}
              >
                <InputLabel id="label2">凸ルートに含めたいボス</InputLabel>
                <Select
                  id="label2"
                  label="凸ルートに含めたいボス"
                  inputProps={{ 'aria-label': 'Without label' }}
                  value={mustIncludeBoss}
                  onChange={(e) => setMustIncludeBoss(e.target.value as string)}
                >
                  <MenuItem value="">(空欄)</MenuItem>
                  {Array.from(
                    new Set(Object.keys(favs).map((key) => favs[key].bossName))
                  ).map((val, index) => (
                    <MenuItem value={val} key={index}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                className={classes.formControl}
                margin="dense"
                label="最大出力件数"
                variant="outlined"
                type="number"
                value={maxSearchNum}
                onChange={(e) => {
                  const setNum = parseInt(e.target.value)
                  if (
                    !Number.isNaN(setNum) &&
                    0 < setNum &&
                    Number.isInteger(setNum)
                  ) {
                    setMaxSearchNum(parseInt(e.target.value))
                  }
                }}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setRouteSearcDialogOpen(false)
              }}
              color="primary"
            >
              キャンセル
            </Button>
            <Button
              onClick={() => {
                outputRouteTextFile(favs, maxSearchNum, mustIncludeBoss)
                setRouteSearcDialogOpen(false)
                setAlertState({
                  open: true,
                  anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                  },
                  severity: 'success',
                  autoHideDuration: 2000,
                  message: '凸ルートの出力に成功しました',
                })
              }}
              color="primary"
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>

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

              <ListItem
                button
                onClick={() => {
                  if (Object.keys(favs).length < 3) {
                    setAlertState({
                      open: true,
                      anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center',
                      },
                      severity: 'error',
                      autoHideDuration: 10000,
                      message:
                        '凸ルートを出力するのに十分なFavsの数がありません',
                    })
                  } else {
                    setRouteSearcDialogOpen(true)
                  }
                }}
              >
                <ListItemText primary="Favsから凸ルートを出力" />
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
