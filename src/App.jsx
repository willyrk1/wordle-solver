import React from 'react'
import { evalTypes } from './constants'
import './App.scss'

export default function App() {
  const [wordTries, setWordTries] = React.useState(
    [...Array(6)].map(_dummy =>
      [...Array(5)].map(_dummy2 => ({
        letter: '', evalType: evalTypes.none
      }))
    )
  )
  const [cursor, setCursor] = React.useState([3, 2])

  React.useEffect(() => {
    function handleKeyDown(e) {
      console.log(e.keyCode);
    }

    document.addEventListener('keydown', handleKeyDown);

    // Don't forget to clean up
    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [])

  return (
    <>
      {wordTries.map((word, wordIndex) => (
        <div className='word'>
          {word.map((letterObj, letterIndex) => {
            const isCursor = wordIndex == cursor[0] && letterIndex == cursor[1]
            const classString = isCursor ? 'letter cursor' : 'letter'
            return (
              <span className={classString}>{letterObj.letter}</span>
            )
          })}
        </div>
      ))}
    </>
  )
}
