import { VFC, useState, useEffect } from 'react'
import TabBar from './Tab'
import SplitPane from 'react-split-pane'
import Header from './Header'
import dynamic from 'next/dynamic'
import CharacterNameConverterTab from './CharacterNameConverterTab'
import FormatTab from './FormatTab'
import ConfigTab from './Config'
import { formatTL } from '../lib/tlFormatter'
import { DEFAULT_FORMAT } from '../lib/formatConstants'
import { isMobile } from 'react-device-detect'
import TLOutputTab from './TLOutputTab'
import {
  FormatStyle,
  genIdForHash,
  storeFormatStyle,
} from '../lib/fireStoreForShare'
// Material-UIが壊れるのでSSRできない
const TLInputTab = dynamic(() => import('./TLInputTab'), { ssr: false })
const Main: VFC<{ stringfiedFormatStyleObj: string; paramId: string }> = ({
  stringfiedFormatStyleObj,
  paramId,
}) => {
  const [activeTab, setActiveTab] = useState<
    'tl' | 'format' | 'name' | 'config' | 'output'
  >('tl')
  const [tl, setTl] = useState('')

  const [mode, setMode] = useState('クラン')
  const [phase, setPhase] = useState(5)
  const [damage, setDamage] = useState(0)
  const [bossName, setBossName] = useState('')
  const [battleDate, setBattleDate] = useState('')
  const [characters, setCharacters] = useState([
    { lv: 1, name: '', star: 1, rank: 1, specialLv: 0, remark: '' },
    { lv: 1, name: '', star: 1, rank: 1, specialLv: 0, remark: '' },
    { lv: 1, name: '', star: 1, rank: 1, specialLv: 0, remark: '' },
    { lv: 1, name: '', star: 1, rank: 1, specialLv: 0, remark: '' },
    { lv: 1, name: '', star: 1, rank: 1, specialLv: 0, remark: '' },
  ])
  const [startTime, setStartTime] = useState(90)
  const [endTime, setEndTime] = useState(0)
  const [timeline, setTimeline] = useState<
    { time: number; name: string; remark: string }[]
  >([
    { time: 90, name: '', remark: '' },
    { time: 90, name: '', remark: '' },
    { time: 90, name: '', remark: '' },
  ])

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

  const handleSaveLocal = () => {
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

    localStorage.setItem(
      'stringfiedFormatStyleObj' + process.env.version,
      JSON.stringify({
        tl: DEFAULT_FORMAT.tl,
        headerFormat: DEFAULT_FORMAT.headerFormat,
        selfUbFormat: DEFAULT_FORMAT.selfUbFormat,
        bossUbFormat: DEFAULT_FORMAT.bossUbFormat,
        footerFormat: DEFAULT_FORMAT.footerFormat,
        characterNameConvs: DEFAULT_FORMAT.characterNameConvs,
        minConfig: 1,
        secConfig: 30,
        namePadding: 'none',
      })
    )
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
      {activeTab === 'tl' && (
        <TLInputTab
          mode={mode}
          setMode={setMode}
          phase={phase}
          setPhase={setPhase}
          damage={damage}
          setDamage={setDamage}
          battleDate={battleDate}
          setBattleDate={setBattleDate}
          bossName={bossName}
          setBossName={setBossName}
          characters={characters}
          setCharacters={setCharacters}
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          timeline={timeline}
          setTimeline={setTimeline}
        />
      )}
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
          handleSaveLocal={handleSaveLocal}
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

export default Main
