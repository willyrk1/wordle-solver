import React from 'react'
import './App.scss'
import reducer, { initReducer, reducerActions } from './reducer'

export default function App() {
  const [state, dispatch] = React.useReducer(reducer, initReducer)

  function handleLetterClick(wordIndex, letterIndex) {
    dispatch({ type: reducerActions.setCursor, cursor: [wordIndex, letterIndex] })
  }

  React.useEffect(() => {
    function handleKeyDown(e) {
      if (e.key.length === 1 && /[a-z]/.test(e.key)) {
        dispatch({ type: reducerActions.keyPressed, letter: e.key })
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    // Don't forget to clean up
    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [])

  return (
    <>
      {state.words.map((word, wordIndex) => (
        <div className='word'>
          {word.map((letterObj, letterIndex) => {
            const isCursor = wordIndex === state.cursor[0] && letterIndex === state.cursor[1]
            const classString = isCursor ? 'letter cursor' : 'letter'
            return (
              <span className={classString} onClick={() => handleLetterClick(wordIndex, letterIndex)}>
                {letterObj.letter}
              </span>
            )
          })}
        </div>
      ))}
    </>
  )
}
