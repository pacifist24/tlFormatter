import { VFC } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

const CustomizedSnackbars: VFC<{
  alertState: {
    open: boolean
    anchorOrigin: {
      vertical: 'bottom' | 'top'
      horizontal: 'center' | 'left' | 'right'
    }
    severity: 'error' | 'info' | 'success' | 'warning'
    autoHideDuration: number
    message: string
  }
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
}> = ({ alertState, setAlertState }) => {
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setAlertState({ ...alertState, open: false })
  }

  return (
    <>
      <Snackbar
        open={alertState.open}
        autoHideDuration={alertState.autoHideDuration}
        onClose={handleClose}
        anchorOrigin={alertState.anchorOrigin}
      >
        <Alert onClose={handleClose} severity={alertState.severity}>
          {alertState.message}
        </Alert>
      </Snackbar>
    </>
  )
}
export default CustomizedSnackbars
