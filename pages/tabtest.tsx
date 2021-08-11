import { useState, useEffect } from 'react'
import { VFC } from 'react'
import TabBar from '../components/Tab'
import SplitPane from 'react-split-pane'
import Header from '../components/Header'
import TLInputTab from '../components/TLInputTab'
import CharacterNameConverterTab from '../components/CharacterNameConverterTab'
import FormatTab from '../components/FormatTab'
import ConfigTab from '../components/Config'
import { formatTL } from '../lib/tlFormatter'
import { DEFAULT_FORMAT } from '../lib/format'
import { isMobile } from 'react-device-detect'
import Snackbar from '@material-ui/core/Snackbar'
// import {
//   genIdForHash,
//   storeFormatStyle,
//   fetchFormatStyle,
// } from '../lib/fireStoreForShare'

const TabTest: VFC = () => {
  const [activeTab, setActiveTab] = useState<
    'tl' | 'format' | 'name' | 'config' | 'output'
  >('tl')
  const [tl, setTl] = useState('')

  const [nameFromNameConv, setNameFromNameConv] = useState('')
  const [nameToNameConv, setNameToNameConv] = useState('')
  const [characterNameConvs, setCharacterNameConvs] = useState<{
    [key: string]: string
  }>()

  const handleDeleteNameConv = (nameFrom: string) => () => {
    const clone = { ...characterNameConvs }
    delete clone[nameFrom]
    setCharacterNameConvs(clone)
  }

  const handleAddNameConv = (nameFrom: string, nameTo: string) => () => {
    const clone = { ...characterNameConvs }
    clone[nameFrom] = nameTo
    setCharacterNameConvs(clone)
    setNameFromNameConv('')
    setNameToNameConv('')
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

  // const handleStoreFormatStyle = async () => {
  //   storeFormatStyle({
  //     characterNameConvs,
  //     headerFormat,
  //     selfUbFormat,
  //     bossUbFormat,
  //     footerFormat,
  //     minConfig,
  //     secConfig,
  //   })
  // }

  // const handleFetchFormatStyle = async () => {
  //   const id = await genIdForHash({
  //     characterNameConvs,
  //     headerFormat,
  //     selfUbFormat,
  //     bossUbFormat,
  //     footerFormat,
  //     minConfig,
  //     secConfig,
  //   })
  //   const result = await fetchFormatStyle(id)
  //   setCharacterNameConvs(result.characterNameConvs)
  //   setHeaderFormat(result.headerFormat)
  //   setSelfUbFormat(result.selfUbFormat)
  //   setBossUbFormat(result.bossUbFormat)
  //   setFooterFormat(result.footerFormat)
  //   setMinConfig(result.minConfig)
  //   setSecConfig(result.secConfig)
  // }

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
        setFormattedTL('TL解析失敗しました')
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

  // マウント時に各種設定を初期化する
  useEffect(() => {
    setHeaderFormat(DEFAULT_FORMAT.headerFormat)
    setSelfUbFormat(DEFAULT_FORMAT.selfUbFormat)
    setBossUbFormat(DEFAULT_FORMAT.bossUbFormat)
    setFooterFormat(DEFAULT_FORMAT.footerFormat)
    setCharacterNameConvs(DEFAULT_FORMAT.characterNameConvs)
  }, [])

  const commonTabs = (
    <>
      {/* <button onClick={handleStoreFormatStyle}>aaa</button>
      <button onClick={handleFetchFormatStyle}>bbb</button> */}
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
          nameFrom={nameFromNameConv}
          setNameFrom={setNameFromNameConv}
          nameTo={nameToNameConv}
          setNameTo={setNameToNameConv}
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
        />
      )}
    </>
  )

  const [copyOutputTLSnackBarOpen, setCopyOutputTLSnackBarOpen] =
    useState(false)

  const handleCopyOutputTL = () => {
    navigator.clipboard.writeText(formattedTL)
    setCopyOutputTLSnackBarOpen(true)
  }

  const output = (
    <main className="flex flex-col h-full border-t border-l border-gray-200">
      <button
        className="h-screen"
        onClick={handleCopyOutputTL}
        title="出力TLをコピー"
      >
        <textarea
          className="cursor-pointer resize-none h-full w-full focus:outline-none p-2"
          value={formattedTL}
          readOnly
        />
      </button>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={() => setCopyOutputTLSnackBarOpen(false)}
        open={copyOutputTLSnackBarOpen}
        autoHideDuration={1500}
        message="出力TLをコピーしました"
      />
    </main>
  )

  return (
    <>
      <Header />
      {isMobile && (
        <main className="flex flex-col h-full border-t border-gray-200">
          {commonTabs}
          {activeTab === 'output' && (
            <main className="flex flex-col h-full border-t border-l border-gray-200">
              <textarea
                className="resize-none h-screen w-full focus:outline-none p-2"
                value={formattedTL}
                readOnly
              />
            </main>
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
          {output}
        </SplitPane>
      )}
    </>
  )
}
export default TabTest
