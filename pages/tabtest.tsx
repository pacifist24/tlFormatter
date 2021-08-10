import { useState, useEffect } from 'react'
import { VFC } from 'react'
import TabBar from '../components/Tab'
import SplitPane from 'react-split-pane'
import Header from '../components/Header'
import TLInputTab from '../components/TLInputTab'
import CharacterNameConverterTab from '../components/CharacterNameConverterTab'
import FormatTab from '../components/FormatTab'
import { formatTL } from '../lib/tlFormatter'
import { DEFAULT_FORMAT } from '../lib/format'

const TabTest: VFC = () => {
  const [activeTab, setActiveTab] = useState<
    'tl' | 'format' | 'nameConv' | 'usage'
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
            characterNameConvs
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
      <SplitPane
        split="vertical"
        defaultSize="50%"
        style={{ height: 'calc(100% - 4rem)' }}
      >
        <main className="flex flex-col h-full border-t border-gray-200">
          <TabBar
            activeTab={activeTab}
            onChange={(tabName: 'tl' | 'format' | 'nameConv' | 'usage') => {
              setActiveTab(tabName)
            }}
          />
          {activeTab === 'tl' && (
            <TLInputTab
              tl={tl}
              onChange={(e) => {
                setTl(e.target.value)
              }}
            />
          )}
          {activeTab === 'nameConv' && (
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
