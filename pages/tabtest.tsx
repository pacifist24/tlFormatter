import { useState } from 'react'
import { VFC } from 'react'
import TabBar from '../components/Tab'
import SplitPane from 'react-split-pane'
import Header from '../components/Header'
import TLInput from '../components/TLInput'
import CharacterNameConverter from '../components/CharacterNameConverter'

const TabTest: VFC = () => {
  const [activeTab, setActiveTab] = useState<
    'tl' | 'format' | 'nameConv' | 'usage'
  >('tl')
  const [tl, setTl] = useState('')

  const [nameFromNameConv, setNameFromNameConv] = useState('')

  const [nameToNameConv, setNameToNameConv] = useState('')

  const [characterNameConvs, setCharacterNameConvs] = useState<{
    [key: string]: string
  }>({
    'サレン(サマー)': '水サレ',
    'ニャル(ニューイヤー)': 'ニャル',
    'キャル(サマー)': '水キャル',
  })

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
            <TLInput
              tl={tl}
              onChange={(event) => {
                setTl(event.target.value)
              }}
            />
          )}
          {activeTab === 'nameConv' && (
            <CharacterNameConverter
              characterNameConvs={characterNameConvs}
              handleDelete={handleDeleteNameConv}
              handleAdd={handleAddNameConv}
              nameFrom={nameFromNameConv}
              setNameFrom={setNameFromNameConv}
              nameTo={nameToNameConv}
              setNameTo={setNameToNameConv}
            />
          )}
        </main>
        <main className="flex flex-col h-full border-t border-l border-gray-200">
          a
        </main>
      </SplitPane>
    </>
  )
}
export default TabTest
