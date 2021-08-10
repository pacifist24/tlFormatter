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

const TabTest: VFC = () => {
  const [activeTab, setActiveTab] = useState<
    'tl' | 'format' | 'name' | 'config' | 'usage'
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
    const clone = { [nameFrom]: nameTo, ...characterNameConvs }
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

  const handleChangeMin = (val: number) => {
    setMinConfig(val)
    setSecConfig(30)
  }

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
            minConfig * 60 + secConfig
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
  ])

  // マウント時に各種設定を初期化する
  useEffect(() => {
    setHeaderFormat(DEFAULT_FORMAT.headerFormat)
    setSelfUbFormat(DEFAULT_FORMAT.selfUbFormat)
    setBossUbFormat(DEFAULT_FORMAT.bossUbFormat)
    setFooterFormat(DEFAULT_FORMAT.footerFormat)
    setCharacterNameConvs(DEFAULT_FORMAT.characterNameConvs)
  }, [])

  return (
    <>
      <Header />
      {isMobile && <span>aaa</span>}
      <SplitPane
        split="vertical"
        defaultSize="65%"
        style={{ height: 'calc(100% - 4rem)' }}
      >
        <main className="flex flex-col h-full border-t border-gray-200">
          <TabBar
            activeTab={activeTab}
            onChange={(
              tabName: 'tl' | 'format' | 'name' | 'config' | 'usage'
            ) => {
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
            />
          )}
        </main>
        <main className="flex flex-col h-full border-t border-l border-gray-200">
          <textarea
            className="resize-none h-screen w-full focus:outline-none p-2"
            value={formattedTL}
            readOnly
          />
        </main>
      </SplitPane>
    </>
  )
}
export default TabTest
