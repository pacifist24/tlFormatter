import clsx from 'clsx'
import { FC, VFC } from 'react'

const TabBar: VFC<{
  activeTab: 'tl' | 'format' | 'nameConv' | 'usage'
  onChange: (param: string) => void
}> = ({ activeTab, onChange }) => (
  <div className="flex space-x-5 pl-5 pr-4 border-b">
    <TabButton isActive={activeTab === 'tl'} onClick={() => onChange('tl')}>
      TL
    </TabButton>
    <TabButton
      isActive={activeTab === 'format'}
      onClick={() => onChange('format')}
    >
      Format
    </TabButton>
    <TabButton
      isActive={activeTab === 'nameConv'}
      onClick={() => onChange('nameConv')}
    >
      NameConv
    </TabButton>
    <TabButton
      isActive={activeTab === 'usage'}
      onClick={() => onChange('usage')}
    >
      Usage
    </TabButton>
  </div>
)
export default TabBar

const TabButton: FC<{ isActive: boolean; onClick: () => void }> = ({
  isActive,
  onClick,
  children,
}) => (
  <button
    type="button"
    className={clsx(
      'h-10 text-xs font-medium px-0.5 border-t-2 focus:outline-none transition-colors duration-150',
      {
        'border-turquoise-500 text-gray-900': isActive,
        'border-transparent text-gray-500 hover:text-gray-900 focus:text-gray-900':
          !isActive,
      }
    )}
    onClick={onClick}
  >
    <span className="border-b-2 border-transparent py-2.5">{children}</span>
  </button>
)
