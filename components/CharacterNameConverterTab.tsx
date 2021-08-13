import { VFC } from 'react'
import Chip from './Chip'
import TextField from '@material-ui/core/TextField'
import clsx from 'clsx'

type Props = {
  characterNameConvs: { [key: string]: string }
  handleDelete: (nameFrom: string) => () => void
  handleAdd: (nameFrom: string, nameTo: string) => () => void
  nameFrom: string
  setNameFrom: (val: string) => void
  nameTo: string
  setNameTo: (val: string) => void
}

const CharacterNameConverter: VFC<Props> = ({
  characterNameConvs,
  handleDelete,
  handleAdd,
  nameFrom,
  setNameFrom,
  nameTo,
  setNameTo,
}) => {
  return (
    <>
      <div className="flex items-center justify-center mt-8">
        <TextField
          className="w-5/12"
          size="small"
          label="変換前キャラ名"
          variant="outlined"
          value={nameFrom}
          onChange={(e) => setNameFrom(e.target.value)}
        />
        <span className="mx-1 text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </span>
        <TextField
          className=" w-1/3"
          size="small"
          label="変換後キャラ名"
          variant="outlined"
          value={nameTo}
          onChange={(e) => setNameTo(e.target.value)}
        />
        <button
          className={clsx(
            'rounded-full p-1 ml-1 transition-colors duration-300 text-gray-500',
            {
              'opacity-50 cursor-default': nameFrom === '' || nameTo === '',
              'hover:bg-gray-200 active:bg-gray-400': !(
                nameFrom === '' || nameTo === ''
              ),
            }
          )}
          onClick={handleAdd(nameFrom, nameTo)}
          disabled={nameFrom === '' || nameTo === ''}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
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
      <div className="flex flex-wrap mt-8 overflow-scroll">
        {Object.keys(characterNameConvs).map((val) => (
          <Chip onDelete={handleDelete(val)} key={val}>
            {val} <br />⇒ {characterNameConvs[val]}
          </Chip>
        ))}
      </div>
    </>
  )
}

export default CharacterNameConverter
