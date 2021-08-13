import { FC } from 'react'

type Props = {
  onDelete: () => void
}
const Chip: FC<Props> = ({ onDelete, children }) => (
  <>
    <span className="inline-flex items-center bg-white border border-gray-300 rounded-full cursor-default p-0.5 mx-0.5 my-0.5">
      <span className="pl-3 pr-1 text-sm">{children}</span>
      <button
        type="button"
        className="inline-flex items-center justify-center w-5 h-5 p-1 text-white bg-gray-400 rounded-full mx-0.5 hover:bg-gray-500 active:bg-gray-600 focus:outline-none transition-colors duration-300"
        onClick={onDelete}
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
            strokeWidth={4}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </span>
  </>
)
export default Chip
