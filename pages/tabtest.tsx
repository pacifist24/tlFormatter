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
      <div className="mt-16">
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
            {activeTab === 'nameConv' && <CharacterNameConverter />}
          </main>
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
            {activeTab === 'nameConv' && <CharacterNameConverter />}
          </main>
        </SplitPane>
      </div>
    </>
  )
}
export default TabTest
