import { VFC, useState, useEffect } from 'react'
import TabBar from './Tab'
import SplitPane from 'react-split-pane'
import Header from './Header'
import CharacterNameConverterTab from './CharacterNameConverterTab'
import FormatTab from './FormatTab'
import ConfigTab from './ConfigTab'
import { formatTL } from '../lib/tlFormatter'
import { DEFAULT_FORMAT } from '../lib/formatConstants'
import { isMobile } from 'react-device-detect'
import TLOutputTab from './TLOutputTab'
import { parseTlData, TLData, FormatStyle } from '../lib/tlFormatter'
import TLInputTab from './TLInputTab'
import { genIdForHash, storeFormatStyle } from '../lib/fireStoreForShare'
import FavsTab from './FavsTab'
import { FavsInfo } from './FavsTab'
import {
  fetchFormatStyle,
  genIdForFavsInfo,
  storeFavs,
  fetchFavs,
} from '../lib/fireStoreForShare'
import CustomizedSnackbars from './CustomizedSnackbars'

const Main: VFC<{ stringfiedFormatStyleObj: string; paramId: string }> = ({
  stringfiedFormatStyleObj,
  paramId,
}) => {
  const [activeTab, setActiveTab] = useState<
    'tl' | 'format' | 'name' | 'config' | 'output' | 'favs'
  >('tl')

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
  const [arrangeConfig, setArrangeConfig] = useState('same')

  const [currentPageTLData, setCurrentPageTLData] = useState<TLData>()
  const [favsInfos, setFavsInfos] = useState<{ [key: string]: FavsInfo }>({})
  const handleAddFavsInfo = () => {
    if (
      currentPageTLData.bossName &&
      currentPageTLData.characters &&
      currentPageTLData.damage &&
      currentPageTLData.phase
    ) {
      if (favsInfos[shareURL]) {
        // すでにお気に入りに登録されている場合
        setAlertState({
          open: true,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          severity: 'warning',
          autoHideDuration: 3000,
          message: shareURL + 'は既にFavsに登録されています',
        })
      } else {
        const clone = { ...favsInfos }
        const addedfavsInfo: { [key: string]: FavsInfo } = {
          [shareURL]: {
            bossName: currentPageTLData.bossName,
            characters: currentPageTLData.characters,
            damage: currentPageTLData.damage,
            phase: currentPageTLData.phase,
            duration: currentPageTLData.startTime - currentPageTLData.endTime,
          },
        }
        setFavsInfos({ ...addedfavsInfo, ...clone })
        localStorage.setItem(
          'stringfiedFavsInfosObj' + process.env.version,
          JSON.stringify({ ...addedfavsInfo, ...clone })
        )
        setAlertState({
          open: true,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          severity: 'success',
          autoHideDuration: 2000,
          message: 'Favsへの登録に成功しました',
        })
      }
    }
  }

  const handleDeleteFavInfo = (id: string) => () => {
    const clone = { ...favsInfos }
    delete clone[id]
    setFavsInfos(clone)
    localStorage.setItem(
      'stringfiedFavsInfosObj' + process.env.version,
      JSON.stringify(clone)
    )
  }

  const handleSaveLocal = () => {
    const saveStyleObj: FormatStyle = {
      headerFormat,
      selfUbFormat,
      bossUbFormat,
      footerFormat,
      nameConvs: characterNameConvs,
      startTime: startTimeConfig,
      paddingName: namePadding,
      arrange: arrangeConfig,
    }
    localStorage.setItem(
      'stringfiedFormatStyleObj' + process.env.version,
      JSON.stringify(saveStyleObj)
    )
  }
  const handleFetchTL = (id: string) => async () => {
    if (shareURL !== id) {
      const tlData = await fetchFormatStyle(id)
      if (tlData) {
        setMode(tlData.mode)
        setPhase(tlData.phase)
        setBossName(tlData.bossName)
        setDamage(tlData.damage)
        setBattleDate(tlData.battleDate)
        setStartTime(tlData.startTime)
        setEndTime(tlData.endTime)
        setCharacters(tlData.characters)
        setTimeline(tlData.timeline)
        setShareURL(id)
        setCurrentPageTLData(tlData)
      }
    }
  }

  const loadStyle = () => {
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
      setArrangeConfig(localFormatStyle.arrange)
    }
  }
  // firebaseにFavsを保存しにいく処理
  const handleStoreFavs = () => {
    if (Object.keys(favsInfos).length === 0) {
      // そもそもFavsに何も登録されていない
      setAlertState({
        open: true,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
        severity: 'warning',
        autoHideDuration: 2000,
        message: 'Favsに何も登録されていません',
      })
    } else {
      storeFavs(favsInfos)
      genIdForFavsInfo(favsInfos).then((id: string) => {
        navigator.clipboard.writeText(id)
        setAlertState({
          open: true,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          severity: 'success',
          autoHideDuration: 2000,
          message:
            'Favsをエクスポートし、共有コードをクリップボードにコピーしました',
        })
      })
    }
  }

  const handleFetchFavs = (id: string) => {
    if (id) {
      fetchFavs(id).then((result) => {
        if (result) {
          setFavsInfos({ ...favsInfos, ...result })
          localStorage.setItem(
            JSON.stringify({ ...favsInfos, ...result }),
            'stringfiedFavsInfosObj' + process.env.version
          )
          setAlertState({
            open: true,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
            severity: 'success',
            autoHideDuration: 2000,
            message: 'Favsのインポートに成功しました',
          })
        } else {
          setAlertState({
            open: true,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
            severity: 'error',
            autoHideDuration: 10000,
            message: 'この共有コードは存在しません',
          })
        }
      })
    } else {
      setAlertState({
        open: true,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
        severity: 'error',
        autoHideDuration: 10000,
        message: 'この共有コードは存在しません',
      })
    }
  }

  const [shareURL, setShareURL] = useState('')

  const [formattedTL, setFormattedTL] = useState('')

  const [alertState, setAlertState] = useState<{
    open: boolean
    anchorOrigin: {
      vertical: 'bottom' | 'top'
      horizontal: 'center' | 'left' | 'right'
    }
    severity: 'error' | 'info' | 'success' | 'warning'
    autoHideDuration: number
    message: string
  }>({
    open: false,
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'center',
    },
    severity: 'success',
    autoHideDuration: 1000,
    message: '',
  })

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
    const formatStyle: FormatStyle = {
      headerFormat,
      selfUbFormat,
      bossUbFormat,
      footerFormat,
      nameConvs: characterNameConvs,
      startTime: startTimeConfig,
      paddingName: namePadding,
      arrange: arrangeConfig,
    }
    if (mode !== '') {
      try {
        setFormattedTL(formatTL(tlData, formatStyle))
      } catch (e) {
        setFormattedTL(
          'TL解析に失敗しました、プリコネアプリから出力されたTL、もしくはそれにコメントを付けたものが読み込み可能です'
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
    arrangeConfig,
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
    setArrangeConfig(DEFAULT_FORMAT.arrange)

    const saveStyleObj: FormatStyle = {
      headerFormat: DEFAULT_FORMAT.headerFormat,
      selfUbFormat: DEFAULT_FORMAT.selfUbFormat,
      bossUbFormat: DEFAULT_FORMAT.bossUbFormat,
      footerFormat: DEFAULT_FORMAT.footerFormat,
      nameConvs: DEFAULT_FORMAT.nameConvs,
      startTime: DEFAULT_FORMAT.startTime,
      paddingName: DEFAULT_FORMAT.paddingName,
      arrange: DEFAULT_FORMAT.arrange,
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
      setCurrentPageTLData(tlDataObj)
    }

    if (localStorage.getItem('stringfiedFavsInfosObj' + process.env.version)) {
      const favsInfosObj = JSON.parse(
        localStorage.getItem('stringfiedFavsInfosObj' + process.env.version)
      ) as { [key: string]: FavsInfo }
      setFavsInfos(favsInfosObj)
    } else {
      // デモ用
      const favsInfosObj = JSON.parse(
        '{"881c352130":{"bossName":"オルレオン","characters":[{"lv":202,"name":"コッコロ（プリンセス）","star":3,"rank":20,"specialLv":0,"remark":"裸"},{"lv":202,"name":"ネネカ","star":3,"rank":21,"specialLv":0,"remark":"鎧無し"},{"lv":202,"name":"キャル（ニューイヤー）","star":3,"rank":21,"specialLv":210,"remark":"フル装備"},{"lv":202,"name":"カスミ","star":3,"rank":20,"specialLv":30,"remark":"フル装備"},{"lv":202,"name":"マホ","star":6,"rank":20,"specialLv":1,"remark":"裸"}],"damage":22000000,"phase":3,"duration":64},"e43a2a365c":{"bossName":"ワイルドグリフォン","characters":[{"rank":20,"specialLv":1,"name":"アカリ","lv":205,"remark":"裸","star":6},{"specialLv":1,"star":5,"remark":"裸","name":"サレン（サマー）","lv":205,"rank":21},{"specialLv":0,"remark":"","rank":21,"lv":205,"star":5,"name":"ネネカ"},{"remark":"フル装備","lv":205,"star":4,"specialLv":210,"name":"キャル（ニューイヤー）","rank":21},{"lv":205,"rank":21,"remark":"フル装備","name":"ルナ","specialLv":210,"star":3}],"damage":29400200,"phase":5,"duration":90},"54fec13a97":{"bossName":"カルキノス","characters":[{"name":"コッコロ（プリンセス）","specialLv":0,"remark":"腕輪のみ","rank":14,"lv":202,"star":5},{"remark":"鎧無し","lv":202,"name":"ネネカ","rank":20,"specialLv":0,"star":5},{"name":"キャル（ニューイヤー）","star":5,"rank":21,"specialLv":210,"remark":"最強","lv":202},{"name":"マホ","star":6,"remark":"最脆","rank":12,"lv":202,"specialLv":1},{"name":"キョウカ","lv":202,"rank":21,"specialLv":210,"star":6,"remark":"最強"}],"damage":24676190,"phase":5,"duration":90}}'
      ) as { [key: string]: FavsInfo }
      localStorage.setItem(
        JSON.stringify(favsInfosObj),
        'stringfiedFavsInfosObj' + process.env.version
      )
      setFavsInfos(favsInfosObj)
    }

    if (
      // ローカルストレージにスタイルの設定があれば設定
      localStorage.getItem('stringfiedFormatStyleObj' + process.env.version)
    ) {
      loadStyle()
    } else {
      // 初回来場者にはdefault値を設定
      setDefault()
    }
  }, [])

  const commonTabs = (
    <>
      <TabBar
        activeTab={activeTab}
        onChange={(
          tabName: 'tl' | 'format' | 'name' | 'config' | 'output' | 'favs'
        ) => {
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
            setAlertState({
              open: true,
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
              },
              severity: 'error',
              autoHideDuration: 10000,
              message:
                'TL解析に失敗しました。プリコネアプリから出力されたTLを編集せず読み込んでください。',
            })
          }}
          nameConvs={characterNameConvs}
          setAlertState={setAlertState}
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
          arrange={arrangeConfig}
          handleChangeArrange={setArrangeConfig}
        />
      )}
      {activeTab === 'favs' && (
        <FavsTab
          shareURL={shareURL}
          handleAddFavs={handleAddFavsInfo}
          favsInfos={favsInfos}
          nameConvs={characterNameConvs}
          handleDeleteFavInfo={handleDeleteFavInfo}
          handleFetchTL={handleFetchTL}
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
      const tlDataObj: TLData = {
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
      storeFormatStyle(tlDataObj)
      setShareURL(id)
      setCurrentPageTLData(tlDataObj)
    }
    navigator.clipboard.writeText(process.env.siteUrl + id)
  }

  return (
    <>
      <Header
        handleMenuLoadStyle={loadStyle}
        handleMenuSaveStyle={handleSaveLocal}
        handleMenuInitStyle={setDefault}
        handleMenuSaveTL={handleMenuSaveTL}
        setAlertState={setAlertState}
        handleStoreFavs={handleStoreFavs}
        handleFetchFavs={handleFetchFavs}
        url={shareURL}
      />
      {isMobile && (
        <main className="flex flex-col h-full border-t border-gray-200">
          {commonTabs}
          {activeTab === 'output' && (
            <TLOutputTab tl={formattedTL} setAlertState={setAlertState} />
          )}
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
          <TLOutputTab tl={formattedTL} setAlertState={setAlertState} />
        </SplitPane>
      )}
      <CustomizedSnackbars
        alertState={alertState}
        setAlertState={setAlertState}
      />
    </>
  )
}

export default Main
