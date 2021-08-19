import { VFC } from 'react'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  webButton: {
    textTransform: 'none',
  },
})

export type FavsInfo = {
  phase: number
  bossName: string
  damage: number
  duration: number
  characters: {
    lv: number
    name: string
    star: number
    rank: number
    specialLv: number
    remark: string
  }[]
}

const FavsCard: VFC<{
  favsInfo: FavsInfo
  nameConvs: { [key: string]: string }
  handleDeleteFavInfo: () => void
  handleFetchTL: () => void
  id: string
}> = ({ favsInfo, nameConvs, handleDeleteFavInfo, handleFetchTL, id }) => {
  return (
    <div className="flex-col m-2 group">
      <div className="flex justify-end">
        <button
          className="text-white rounded-full group-hover:text-gray-600 hover:bg-gray-300 transition-colors duration-150"
          onClick={(e) => {
            handleDeleteFavInfo()
            e.currentTarget.blur()
          }}
          title="Favsから削除"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div
        className="flex-col w-auto h-32 max-w-lg p-3 border-2 cursor-pointer border-turquoise-500 hover:bg-turquoise-100 bg-turquoise-50 rounded-md"
        onClick={handleFetchTL}
      >
        <div className="font-medium mt-0.5">
          {favsInfo.phase}段階目{favsInfo.bossName}
        </div>
        <div className="font-medium text-gray-800">
          {Math.floor(favsInfo.damage / 10000)}万ダメージ
          {favsInfo.duration !== 90 && <span>({favsInfo.duration}秒)</span>}
        </div>
        <div className="mt-2 text-gray-600">
          {favsInfo.characters
            .map((character) => nameConvs[character.name] ?? character.name)
            .join(' ')}
        </div>
        <div className="flex justify-end mr-1 text-xs text-gray-600 mt-0.5">
          (id={id})
        </div>
      </div>
    </div>
  )
}

const FavsTab: VFC<{
  favsInfos: { [key: string]: FavsInfo }
  nameConvs: { [key: string]: string }
  shareURL: string
  handleDeleteFavInfo: (id: string) => () => void
  handleFetchTL: (id: string) => () => void
  handleAddFavs: () => void
}> = ({
  favsInfos,
  nameConvs,
  shareURL,
  handleDeleteFavInfo,
  handleFetchTL,
  handleAddFavs,
}) => {
  const classes = useStyles()
  return (
    <main className="flex-col h-full border-t border-l">
      {shareURL && (
        <div className="flex self-center justify-center mt-8">
          <Button
            variant="contained"
            color="primary"
            className={classes.webButton}
            onClick={handleAddFavs}
          >
            {shareURL}をFavsに追加
          </Button>
        </div>
      )}
      <div className="flex flex-wrap justify-around mt-8">
        {Object.keys(favsInfos).map((key) => (
          <FavsCard
            key={key}
            nameConvs={nameConvs}
            favsInfo={favsInfos[key]}
            handleDeleteFavInfo={handleDeleteFavInfo(key)}
            id={key}
            handleFetchTL={handleFetchTL(key)}
          />
        ))}
      </div>
    </main>
  )
}
export default FavsTab
