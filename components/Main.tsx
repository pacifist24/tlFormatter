import { VFC, useState, useEffect } from 'react'
import TabBar from './Tab'
import SplitPane from 'react-split-pane'
import Header from './Header'
import CharacterNameConverterTab from './CharacterNameConverterTab'
import FormatTab from './FormatTab'
import ConfigTab from './Config'
import { formatTL } from '../lib/tlFormatter'
import { DEFAULT_FORMAT } from '../lib/formatConstants'
import { isMobile } from 'react-device-detect'
import TLOutputTab from './TLOutputTab'
import { parseTlData, TLData, FormatStyle } from '../lib/tlFormatter'
import TLInputTab from './TLInputTab'
import { genIdForHash, storeFormatStyle } from '../lib/fireStoreForShare'
// Material-UIが壊れるのでSSRできない
// const TLInputTab = dynamic(() => import('./TLInputTab'), { ssr: false })
const Main: VFC<{ stringfiedFormatStyleObj: string; paramId: string }> = ({
  stringfiedFormatStyleObj,
  paramId,
}) => {
  const [activeTab, setActiveTab] = useState<
    'tl' | 'format' | 'name' | 'config' | 'output'
  >('tl')
  // const [tl, setTl] = useState('')

  const [mode, setMode] = useState('')
  const [phase, setPhase] = useState(1)
  const [damage, setDamage] = useState(0)
  const [bossName, setBossName] = useState('')
  const [battleDate, setBattleDate] = useState('')
  const [characters, setCharacters] = useState<
    {
      lv: number
      name: string
      star: number
      rank: number
      specialLv: number
      remark: string
    }[]
  >([])
  const [startTime, setStartTime] = useState(90)
  const [endTime, setEndTime] = useState(0)
  const [timeline, setTimeline] = useState<
    { time: number; name: string; remark: string }[]
  >([])

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

  const [startTimeConfig, setStartTimeConfig] = useState(90)

  const [namePadding, setNamePadding] = useState('none')

  const handleSaveLocal = () => {
    const saveStyleObj: FormatStyle = {
      headerFormat,
      selfUbFormat,
      bossUbFormat,
      footerFormat,
      nameConvs: characterNameConvs,
      startTime: startTimeConfig,
      paddingName: namePadding,
    }
    localStorage.setItem(
      'stringfiedFormatStyleObj' + process.env.version,
      JSON.stringify(saveStyleObj)
    )
  }

  const [shareURL, setShareURL] = useState('')

  const [formattedTL, setFormattedTL] = useState('')

  const handleReadTL = (tl: string) => {
    setMode('')
    setPhase(0)
    setBossName('')
    setDamage(0)
    setBattleDate('')
    setStartTime(90)
    setEndTime(0)
    setCharacters([])
    setTimeline([])
    const tlData: TLData = parseTlData(tl)
    setMode(tlData.mode)
    setPhase(tlData.phase)
    setBossName(tlData.bossName)
    setDamage(tlData.damage)
    setBattleDate(tlData.battleDate)
    setStartTime(tlData.startTime)
    setEndTime(tlData.endTime)
    setCharacters(tlData.characters)
    setTimeline(tlData.timeline)
    // try {
    // } catch (e) {
    //   setFormattedTL(
    //     'TLの読み込みに失敗しました、アプリから出力したTLを編集せずに貼りつけてください'
    //   )
    // }
  }
  useEffect(() => {
    const tlData: TLData = {
      mode,
      phase,
      damage,
      bossName,
      battleDate,
      characters,
      startTime,
      endTime,
      timeline,
    }
    if (mode !== '') {
      try {
        setFormattedTL(
          formatTL(
            tlData,
            headerFormat,
            selfUbFormat,
            bossUbFormat,
            footerFormat,
            characterNameConvs,
            startTimeConfig,
            namePadding
          )
        )
      } catch (e) {
        setFormattedTL(
          'TL解析に失敗しました。プリコネアプリから出力されたTLを編集せず読み込んでください。'
        )
      }
    }
  }, [
    mode,
    phase,
    damage,
    bossName,
    battleDate,
    characters,
    startTime,
    endTime,
    timeline,
    headerFormat,
    selfUbFormat,
    bossUbFormat,
    footerFormat,
    characterNameConvs,
    startTimeConfig,
    namePadding,
  ])

  // デフォルト値にTL,Format,Name,Config全ての設定をデフォルトに戻す
  const setDefault = () => {
    setHeaderFormat(DEFAULT_FORMAT.headerFormat)
    setSelfUbFormat(DEFAULT_FORMAT.selfUbFormat)
    setBossUbFormat(DEFAULT_FORMAT.bossUbFormat)
    setFooterFormat(DEFAULT_FORMAT.footerFormat)
    setCharacterNameConvs(DEFAULT_FORMAT.nameConvs)
    setStartTimeConfig(DEFAULT_FORMAT.startTime)
    setNamePadding(DEFAULT_FORMAT.paddingName)

    const saveStyleObj: FormatStyle = {
      headerFormat: DEFAULT_FORMAT.headerFormat,
      selfUbFormat: DEFAULT_FORMAT.selfUbFormat,
      bossUbFormat: DEFAULT_FORMAT.bossUbFormat,
      footerFormat: DEFAULT_FORMAT.footerFormat,
      nameConvs: DEFAULT_FORMAT.nameConvs,
      startTime: DEFAULT_FORMAT.startTime,
      paddingName: DEFAULT_FORMAT.paddingName,
    }
    localStorage.setItem(
      'stringfiedFormatStyleObj' + process.env.version,
      JSON.stringify(saveStyleObj)
    )
  }

  // マウント時に各種設定を初期化する
  useEffect(() => {
    if (stringfiedFormatStyleObj !== '') {
      // URLからDBを探してヒットしていたらそれを設定
      const tlDataObj = JSON.parse(stringfiedFormatStyleObj) as TLData
      setMode(tlDataObj.mode)
      setPhase(tlDataObj.phase)
      setDamage(tlDataObj.damage)
      setBossName(tlDataObj.bossName)
      setBattleDate(tlDataObj.battleDate)
      setCharacters(tlDataObj.characters)
      setStartTime(tlDataObj.startTime)
      setEndTime(tlDataObj.endTime)
      setTimeline(tlDataObj.timeline)
      setShareURL(paramId)
    }

    if (
      // ローカルストレージにスタイルの設定があれば設定
      localStorage.getItem('stringfiedFormatStyleObj' + process.env.version)
    ) {
      const localFormatStyle = JSON.parse(
        localStorage.getItem('stringfiedFormatStyleObj' + process.env.version)
      ) as FormatStyle
      setHeaderFormat(localFormatStyle.headerFormat)
      setSelfUbFormat(localFormatStyle.selfUbFormat)
      setBossUbFormat(localFormatStyle.bossUbFormat)
      setFooterFormat(localFormatStyle.footerFormat)
      setCharacterNameConvs(localFormatStyle.nameConvs)
      setStartTimeConfig(localFormatStyle.startTime)
      setNamePadding(localFormatStyle.paddingName)
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
          phase={phase}
          damage={damage}
          battleDate={battleDate}
          bossName={bossName}
          characters={characters}
          setCharacters={setCharacters}
          startTime={startTime}
          endTime={endTime}
          timeline={timeline}
          setTimeline={setTimeline}
          handleReadTL={handleReadTL}
          handleReadError={() => {
            setFormattedTL(
              'TL解析に失敗しました。プリコネアプリから出力されたTLを編集せず読み込んでください。'
            )
          }}
          nameConvs={characterNameConvs}
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
          startTime={startTimeConfig}
          handleChangeStartTime={setStartTimeConfig}
          namePadding={namePadding}
          handleChangeNamePadding={setNamePadding}
        />
      )}
    </>
  )

  const handleMenuSaveTL = async () => {
    const id = await genIdForHash({
      mode,
      phase,
      damage,
      bossName,
      battleDate,
      characters,
      startTime,
      endTime,
      timeline,
    })
    if (id !== shareURL) {
      storeFormatStyle({
        mode,
        phase,
        damage,
        bossName,
        battleDate,
        characters,
        startTime,
        endTime,
        timeline,
      })
      setShareURL(id)
    }
    navigator.clipboard.writeText(process.env.siteUrl + id)
  }

  return (
    <>
      <Header
        handleMenuSaveStyle={handleSaveLocal}
        handleMenuInitStyle={setDefault}
        handleMenuSaveTL={handleMenuSaveTL}
        url={shareURL}
      />
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
