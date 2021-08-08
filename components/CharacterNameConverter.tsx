import { VFC } from 'react'
import Chip from '@material-ui/core/Chip'
import TextField from '@material-ui/core/TextField'

type Props = {
  characterNameConvs: { [key: string]: string }
  handleDelete: (nameFrom: string) => () => void
}

const CharacterNameConverter: VFC<Props> = ({
  characterNameConvs,
  handleDelete,
}) => {
  return (
    <>
      <div className="flex justify-center items-center mt-3">
        <TextField
          className="w-5/12"
          size="small"
          id="outlined-basic"
          label="変換前キャラ名"
          variant="outlined"
        />
        <span className="mx-1">⇒</span>
        <TextField
          className=" w-1/3"
          size="small"
          id="outlined-basic"
          label="変換後キャラ名"
          variant="outlined"
        />
        <button className="text-gray-500 ml-2 hover:text-turquoise-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-wrap mt-3">
        {Object.keys(characterNameConvs).map((val) => (
          <Chip
            className="mx-0.5 my-0.5"
            variant="outlined"
            onDelete={handleDelete}
            key={val}
            label={`${val} ⇒ ${characterNameConvs[val]}`}
          />
        ))}
      </div>
    </>
  )
}

export default CharacterNameConverter
