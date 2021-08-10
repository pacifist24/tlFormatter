import React from 'react'
import Head from 'next/head'
import 'tailwindcss/tailwind.css'
import '../css/main.css'
import { createTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'

const theme = createTheme({
  typography: {
    fontSize: 12,
  },
})

export default function App({ Component, pageProps }): JSX.Element {
  return (
    <>
      <Head>
        <title>hello</title>
      </Head>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
