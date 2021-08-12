import firebase from 'firebase'

const COLLECTION_NAME = 'formatStyles'

if (firebase.apps.length === 0) {
  const firebaseConfig = {
    apiKey: 'AIzaSyAkQU7p1YNFPq7K-DSWCzJCUsQe9O1rLxs',
    authDomain: 'tlformatter.firebaseapp.com',
    projectId: 'tlformatter',
    storageBucket: 'tlformatter.appspot.com',
    messagingSenderId: '718811297260',
    appId: '1:718811297260:web:ddb8ad68b51b9bbc293cc9',
    measurementId: 'G-4CP0QKZ23X',
  }
  firebase.initializeApp(firebaseConfig)
}

export type FormatStyle = {
  tl: string
  characterNameConvs: { [key: string]: string }
  headerFormat: string
  selfUbFormat: string
  bossUbFormat: string
  footerFormat: string
  minConfig: number
  secConfig: number
  namePadding: string
}

// オブジェクトのハッシュ化
export const genIdForHash: (formatStyleObj: FormatStyle) => Promise<string> =
  async (formatStyleObj) => {
    // オブジェクトの文字列化(JSON.stringfyではオブジェクト内の順番が壊れるため失敗する)
    const sortedCharacterNameConvs2Str = Object.entries(
      formatStyleObj.characterNameConvs
    )
      .sort()
      .join(',')

    const stringfiedObj =
      ',' +
      formatStyleObj.tl +
      '}{' +
      formatStyleObj.headerFormat +
      '}{' +
      formatStyleObj.selfUbFormat +
      '}{' +
      formatStyleObj.bossUbFormat +
      '}{' +
      formatStyleObj.footerFormat +
      '}{' +
      formatStyleObj.minConfig +
      '}{' +
      formatStyleObj.secConfig +
      '}{' +
      formatStyleObj.namePadding +
      '}{' +
      sortedCharacterNameConvs2Str

    const uint8 = new TextEncoder().encode(stringfiedObj)
    const digest = await crypto.subtle.digest('SHA-1', uint8)
    return Array.from(new Uint8Array(digest))
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')
      .substr(0, 10)
  }

export const storeFormatStyle: (formatStyleObj: FormatStyle) => void = async (
  formatStyleObj
) => {
  const db = firebase.firestore()
  const hash = await genIdForHash(formatStyleObj)
  db.collection(COLLECTION_NAME).doc(hash).set(formatStyleObj)
}

export const fetchFormatStyle: (id: string) => Promise<FormatStyle> = async (
  id: string
) => {
  const db = firebase.firestore()
  const doc = await db.collection(COLLECTION_NAME).doc(id).get()
  return doc.data() as FormatStyle
}
