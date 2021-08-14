import { VFC } from 'react'
// import Error from 'next/error'
// import { fetchFormatStyle } from '../lib/fireStoreForShare'
import { GetServerSideProps } from 'next'
// import Main from '../components/Main'

// const Home: VFC<{
//   stringfiedFormatStyleObj: string
//   paramId: string
//   errorCode?: number
// }> = ({ stringfiedFormatStyleObj, paramId, errorCode }) => {
//   // if (errorCode) {
//   //   return <Error statusCode={errorCode} />
//   // }
//   // return (
//   //   <Main
//   //     stringfiedFormatStyleObj={stringfiedFormatStyleObj}
//   //     paramId={paramId}
//   //   />
//   // )
// }
const Home: VFC = () => <>アプリ大幅改修のため長期間閉鎖します</>
export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  // export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // if (params.slug && params.slug.length === 1) {
  //   // URLに引数が1つだけあるならDBから初期値を引きに行く
  //   const result = await fetchFormatStyle(params.slug[0])
  //   if (result) {
  //     return {
  //       props: {
  //         stringfiedFormatStyleObj: JSON.stringify(result),
  //         paramId: params.slug[0],
  //       },
  //     }
  //   } else {
  //     return {
  //       props: { stringfiedFormatStyleObj: '', paramId: '', errorCode: 404 },
  //     }
  //   }
  // }
  return { props: { stringfiedFormatStyleObj: '', paramId: '' } }
}
