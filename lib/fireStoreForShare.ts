import firebase from 'firebase'
import { TLData } from './tlFormatter'
import { FavsInfo } from '../components/FavsTab'
const COLLECTION_NAME = 'formatStyles'
const FAVS_COLLECTION_NAME = 'favs'
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

// TLオブジェクトのハッシュ化
export const genIdForHash: (formatStyleObj: TLData) => Promise<string> = async (
  formatStyleObj
) => {
  // オブジェクトの文字列化(JSON.stringfyではオブジェクト内の順番が壊れるため失敗する)
  const sortedCharactersStr = formatStyleObj.characters
    .map(
      (character) =>
        character.lv +
        ',' +
        character.name +
        ',' +
        character.rank +
        ',' +
        character.remark +
        ',' +
        character.specialLv +
        ',' +
        character.star
    )
    .join(',')
  const sortedTimelineStr = formatStyleObj.timeline
    .map((line) => line.time + ',' + line.name + ',' + line.remark)
    .join(',')

  const stringfiedObj =
    formatStyleObj.mode +
    '}{' +
    formatStyleObj.phase +
    '}{' +
    formatStyleObj.bossName +
    '}{' +
    formatStyleObj.damage +
    '}{' +
    formatStyleObj.battleDate +
    '}{' +
    formatStyleObj.startTime +
    '}{' +
    formatStyleObj.endTime +
    '}{' +
    sortedCharactersStr +
    '}{' +
    sortedTimelineStr
  const uint8 = new TextEncoder().encode(stringfiedObj)
  const digest = await crypto.subtle.digest('SHA-1', uint8)
  return Array.from(new Uint8Array(digest))
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('')
    .substr(0, 10)
}

// TLをfirestoreに保存する
export const storeFormatStyle: (formatStyleObj: TLData) => void = async (
  formatStyleObj
) => {
  const db = firebase.firestore()
  const hash = await genIdForHash(formatStyleObj)
  db.collection(COLLECTION_NAME).doc(hash).set(formatStyleObj)
}

// TLをfirestoreから取り出す
export const fetchFormatStyle: (id: string) => Promise<TLData> = async (
  id: string
) => {
  const db = firebase.firestore()
  const doc = await db.collection(COLLECTION_NAME).doc(id).get()
  return doc.data() as TLData
}

// FavsInfoオブジェクトのハッシュ化
export const genIdForFavsInfo: (favsInfosObj: {
  [key: string]: FavsInfo
}) => Promise<string> = async (favsInfosObj) => {
  const stringifiedObj = Object.keys(favsInfosObj)
    .map((key) => {
      const favsInfoObj = favsInfosObj[key]

      // オブジェクトの文字列化(JSON.stringfyではオブジェクト内の順番が壊れるため失敗する)
      const sortedCharactersStr = favsInfoObj.characters
        .map(
          (character) =>
            character.lv +
            ',' +
            character.name +
            ',' +
            character.rank +
            ',' +
            character.remark +
            ',' +
            character.specialLv +
            ',' +
            character.star
        )
        .join(',')

      const stringfiedObj =
        favsInfoObj.phase +
        '}{' +
        favsInfoObj.bossName +
        '}{' +
        favsInfoObj.damage +
        '}{' +
        favsInfoObj.duration +
        '}{' +
        sortedCharactersStr

      return stringfiedObj
    })
    .sort()
    .join()

  const uint8 = new TextEncoder().encode(stringifiedObj)
  const digest = await crypto.subtle.digest('SHA-1', uint8)
  return Array.from(new Uint8Array(digest))
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('')
    .substr(0, 10)
    .toUpperCase()
}

// favsをfirestoreに保存する
export const storeFavs: (favsInfosObj: { [key: string]: FavsInfo }) => void =
  async (favsInfoObj) => {
    const db = firebase.firestore()
    const hash = await genIdForFavsInfo(favsInfoObj)
    db.collection(FAVS_COLLECTION_NAME).doc(hash).set(favsInfoObj)
  }

// TLをfirestoreから取り出す
export const fetchFavs: (id: string) => Promise<{ [key: string]: FavsInfo }> =
  async (id: string) => {
    const db = firebase.firestore()
    const doc = await db.collection(FAVS_COLLECTION_NAME).doc(id).get()
    return doc.data() as {
      [key: string]: FavsInfo
    }
  }
