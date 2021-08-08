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

  const [characterNameConvs, setCharacterNameConvs] = useState<{
    [key: string]: string
  }>({
    'サレン(サマー)': '水サレ',
    'ニャル(ニューイヤー)': 'ニャル',
    'キャル(サマー)': '水キャル',
  })

  const handleDelete = (nameFrom: string) => {
    return () => {
      const clone = { ...characterNameConvs }
      delete clone[nameFrom]
      setCharacterNameConvs(clone)
    }
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
              handleDelete={handleDelete}
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
