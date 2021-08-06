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

  return (
    <>
      <Header />
      <SplitPane split="vertical" minSize={50} defaultSize="50%">
        <main className="flex-auto relative border-t border-gray-200">
          <TabBar
            activeTab={activeTab}
            onChange={(tabName: 'tl' | 'format' | 'nameConv' | 'usage') => {
              setActiveTab(tabName)
            }}
          ></TabBar>
          {activeTab === 'tl' && (
            <TLInput
              tl={tl}
              onChange={(event) => {
                setTl(event.target.value)
              }}
            />
          )}
          {activeTab === 'nameConv' && <CharacterNameConverter />}
        </main>
        <div className="border-t border-l border-b h-screen">{tl}</div>
      </SplitPane>
    </>
  )
}
export default TabTest
