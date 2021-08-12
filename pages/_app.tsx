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
        <title>TLFormatter</title>
        <meta property="og:url" content="https://tl-formatter.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="TLFormatter" />
        <meta
          property="og:description"
          content="アプリから出力したTLを整形します。整形のスタイルはカスタマイズできます。カスタマイズしたスタイルはURLで共有することができます(PC版のみ)。"
        />
        <meta property="og:site_name" content="TLFormatter" />
        <meta
          property="og:image"
          content="https://firebasestorage.googleapis.com/v0/b/tlformatter.appspot.com/o/favicon.png?alt=media&token=61faefec-64fd-4438-ad7b-5e7ada7354f3"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
