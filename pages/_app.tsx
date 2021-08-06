import React from 'react'
import Head from 'next/head'
import 'tailwindcss/tailwind.css'

export default function App({ Component, pageProps }): JSX.Element {
  return (
    <>
      <Head>
        <title>hello</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
