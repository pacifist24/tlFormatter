import { VFC, useState, useEffect } from 'react'
import TabBar from '../components/Tab'
import SplitPane from 'react-split-pane'
import Header from '../components/Header'
import TLInputTab from '../components/TLInputTab'
import CharacterNameConverterTab from '../components/CharacterNameConverterTab'
import FormatTab from '../components/FormatTab'
import ConfigTab from '../components/Config'
import { formatTL } from '../lib/tlFormatter'
import { DEFAULT_FORMAT } from '../lib/formatConstants'
import { isMobile } from 'react-device-detect'
import TLOutputTab from '../components/TLOutputTab'
import {
  FormatStyle,
  genIdForHash,
  storeFormatStyle,
  fetchFormatStyle,
} from '../lib/fireStoreForShare'

const Home: VFC<{ stringfiedFormatStyleObj: string; paramId: string }> = ({
  stringfiedFormatStyleObj,
  paramId,
}) => {
  const [activeTab, setActiveTab] = useState<
    'tl' | 'format' | 'name' | 'config' | 'output'
  >('tl')
  const [tl, setTl] = useState('')

  const [characterNameConvs, setCharacterNameConvs] = useState<{
    [key: string]: string
  }>()

  const handleDeleteNameConv = (nameFrom: string) => () => {
    const clone = { ...characterNameConvs }
    delete clone[nameFrom]
    setCharacterNameConvs(clone)
  }

  const handleAddNameConv =
    (nameFrom: string, nameTo: string, postProc: () => void) => () => {
      const clone = { ...characterNameConvs }
      delete clone[nameFrom]
      const addedNameConv = { [nameFrom]: nameTo }
      setCharacterNameConvs({ ...addedNameConv, ...clone })
      postProc()
    }

  const [headerFormat, setHeaderFormat] = useState('')
  const [selfUbFormat, setSelfUbFormat] = useState('')
  const [bossUbFormat, setBossUbFormat] = useState('')
  const [footerFormat, setFooterFormat] = useState('')

  const [minConfig, setMinConfig] = useState(1)
  const [secConfig, setSecConfig] = useState(30)

  const [namePadding, setNamePadding] = useState('none')

  const handleChangeMin = (val: number) => {
    setMinConfig(val)
    setSecConfig(30)
  }

  const [shareURL, setShareURL] = useState('')

  const [formattedTL, setFormattedTL] = useState('')
  useEffect(() => {
    if (tl !== '') {
      try {
        setFormattedTL(
          formatTL(
            tl,
            headerFormat,
            selfUbFormat,
            bossUbFormat,
            footerFormat,
            characterNameConvs,
            minConfig * 60 + secConfig,
            namePadding
          )
        )
        localStorage.setItem(
          'stringfiedFormatStyleObj' + process.env.version,
          JSON.stringify({
            tl,
            headerFormat,
            selfUbFormat,
            bossUbFormat,
            footerFormat,
            characterNameConvs,
            minConfig,
            secConfig,
            namePadding,
          })
        )
      } catch (e) {
        setFormattedTL(
          'TL解析に失敗しました。プリコネアプリから出力されたTLを直接貼りつけてください。'
        )
      }
    }
  }, [
    tl,
    headerFormat,
    selfUbFormat,
    bossUbFormat,
    footerFormat,
    characterNameConvs,
    minConfig,
    secConfig,
    namePadding,
  ])

  // デフォルト値にTL,Format,Name,Config全ての設定をデフォルトに戻す
  const setDefault = () => {
    setTl(DEFAULT_FORMAT.tl)
    setHeaderFormat(DEFAULT_FORMAT.headerFormat)
    setSelfUbFormat(DEFAULT_FORMAT.selfUbFormat)
    setBossUbFormat(DEFAULT_FORMAT.bossUbFormat)
    setFooterFormat(DEFAULT_FORMAT.footerFormat)
    setCharacterNameConvs(DEFAULT_FORMAT.characterNameConvs)
    setMinConfig(1)
    setSecConfig(30)
    setNamePadding('none')
  }

  // マウント時に各種設定を初期化する
  useEffect(() => {
    if (stringfiedFormatStyleObj !== '') {
      // URLからDBを探してヒットしていたらそれを設定
      const formatStyleObj = JSON.parse(stringfiedFormatStyleObj) as FormatStyle
      setTl(formatStyleObj.tl)
      setHeaderFormat(formatStyleObj.headerFormat)
      setSelfUbFormat(formatStyleObj.selfUbFormat)
      setBossUbFormat(formatStyleObj.bossUbFormat)
      setFooterFormat(formatStyleObj.footerFormat)
      setCharacterNameConvs(formatStyleObj.characterNameConvs)
      setMinConfig(formatStyleObj.minConfig)
      setSecConfig(formatStyleObj.secConfig)
      setNamePadding(formatStyleObj.namePadding)
      setShareURL(paramId)
    } else if (
      localStorage.getItem('stringfiedFormatStyleObj' + process.env.version)
    ) {
      // ローカルストレージに設定があればそれを設定
      const localFormatStyle = JSON.parse(
        localStorage.getItem('stringfiedFormatStyleObj' + process.env.version)
      ) as FormatStyle
      setTl(localFormatStyle.tl)
      setHeaderFormat(localFormatStyle.headerFormat)
      setSelfUbFormat(localFormatStyle.selfUbFormat)
      setBossUbFormat(localFormatStyle.bossUbFormat)
      setFooterFormat(localFormatStyle.footerFormat)
      setCharacterNameConvs(localFormatStyle.characterNameConvs)
      setMinConfig(localFormatStyle.minConfig)
      setSecConfig(localFormatStyle.secConfig)
      setNamePadding(localFormatStyle.namePadding)
    } else {
      // 初回来場者にはdefault値を設定
      setDefault()
    }
  }, [])

  const commonTabs = (
    <>
      <TabBar
        activeTab={activeTab}
        onChange={(tabName: 'tl' | 'format' | 'name' | 'config' | 'output') => {
          setActiveTab(tabName)
        }}
      />
      {activeTab === 'tl' && <TLInputTab tl={tl} onChange={setTl} />}
      {activeTab === 'name' && (
        <CharacterNameConverterTab
          characterNameConvs={characterNameConvs}
          handleDelete={handleDeleteNameConv}
          handleAdd={handleAddNameConv}
        />
      )}
      {activeTab === 'format' && (
        <FormatTab
          headerFormat={headerFormat}
          handleHeaderFormatChange={setHeaderFormat}
          selfUbFormat={selfUbFormat}
          handleSelfUbFormatChange={setSelfUbFormat}
          bossUbFormat={bossUbFormat}
          handleBossUbFormatChange={setBossUbFormat}
          footerFormat={footerFormat}
          handleFooterFormatChange={setFooterFormat}
        />
      )}
      {activeTab === 'config' && (
        <ConfigTab
          minutes={minConfig}
          seconds={secConfig}
          handleChangeMin={handleChangeMin}
          handleChangeSec={setSecConfig}
          namePadding={namePadding}
          handleChangeNamePadding={setNamePadding}
          handleResetAll={setDefault}
        />
      )}
    </>
  )

  const handleClickShare = async () => {
    const id = await genIdForHash({
      tl,
      characterNameConvs,
      headerFormat,
      selfUbFormat,
      bossUbFormat,
      footerFormat,
      minConfig,
      secConfig,
      namePadding,
    })
    if (id !== shareURL) {
      storeFormatStyle({
        tl,
        characterNameConvs,
        headerFormat,
        selfUbFormat,
        bossUbFormat,
        footerFormat,
        minConfig,
        secConfig,
        namePadding,
      })
      setShareURL(id)
    }
  }

  return (
    <>
      <Header handleClickShare={handleClickShare} url={shareURL} />
      {isMobile && (
        <main className="flex flex-col h-full border-t border-gray-200">
          {commonTabs}
          {activeTab === 'output' && <TLOutputTab tl={formattedTL} />}
        </main>
      )}
      {!isMobile && (
        <SplitPane
          split="vertical"
          defaultSize="65%"
          style={{ height: 'calc(100% - 4rem)' }}
        >
          <main className="flex flex-col h-full border-t border-gray-200">
            {commonTabs}
          </main>
          <TLOutputTab tl={formattedTL} />
        </SplitPane>
      )}
    </>
  )
}
export default Home

export const getServerSideProps: ({
  params,
}: {
  params: { slug: string[] }
}) => Promise<{
  props: { stringfiedFormatStyleObj: string; paramId: string }
}> = async ({ params }) => {
  if (params.slug && params.slug.length === 1) {
    // URLに引数が1つだけあるならDBから初期値を引きに行く
    const result = await fetchFormatStyle(params.slug[0])
    if (result) {
      return {
        props: {
          stringfiedFormatStyleObj: JSON.stringify(result),
          paramId: params.slug[0],
        },
      }
    }
  }
  return { props: { stringfiedFormatStyleObj: '', paramId: '' } }
}
