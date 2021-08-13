import React from 'react'
import Head from 'next/head'
import 'tailwindcss/tailwind.css'
import '../css/main.css'
import { createTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { VFC } from 'react'

const theme = createTheme({
  typography: {
    fontSize: 12,
  },
})

const App: VFC<{ Component: any; pageProps: any }> = ({
  Component,
  pageProps,
}) => (
  <>
    <Head>
      <title>TLFormatter</title>
      <meta property="og:url" content={process.env.siteUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="TLFormatter" />
      <meta
        property="og:description"
        content="アプリから出力したTLを整形します。整形のスタイルはカスタマイズできます。カスタマイズしたスタイルはURLで共有することができます(PC版のみ)。"
      />
      <meta property="og:site_name" content="TLFormatter" />
      <meta property="og:image" content={process.env.ogpImageUrl} />
    </Head>
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  </>
)

export default App
