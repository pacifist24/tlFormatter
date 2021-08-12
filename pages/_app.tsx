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
        <meta property="og:url" content="https://tl-formatter.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="TLFormatter" />
        <meta
          property="og:description"
          content="アプリから出力したTLに整形します、整形のスタイルはカスタマイズ可能です。"
        />
        <meta property="og:site_name" content="TLFormatter" />
        <meta
          property="og:image"
          content="https://tl-formatter.vercel.app/public/favicon.ico"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
