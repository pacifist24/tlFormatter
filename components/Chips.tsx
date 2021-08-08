import { FC } from 'react'

type Props = {
  onClose: () => void
}
const Chips: FC<Props> = ({ onClose, children }) => (
  <>
    <span className="inline-flex mx-0.5 my-0.5 items-center rounded-full bg-white border border-gray-200 p-px">
      <span className="pl-3 pr-1 text-sm">{children}</span>
      <button
        type="button"
        className="h-6 w-6 p-1 rounded-full bg-opacity-25 focus:outline-none"
        onClick={onClose}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </span>
  </>
)
export default Chips
