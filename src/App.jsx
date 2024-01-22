import React from 'react'
import './App.scss'
import reducer, { initReducer, reducerActions } from './reducer'
import { clueTypes } from './constants'

const clueTypesList = [clueTypes.none, clueTypes.match, clueTypes.partial]

export default function App() {
  const [state, dispatch] = React.useReducer(reducer, initReducer)

  function handleLetterClick(wordClueIndex, letterClueIndex) {
    dispatch({ type: reducerActions.setCursor, cursor: [wordClueIndex, letterClueIndex] })
  }

  function handleClueTypeClick(clueType) {
    dispatch({ type: reducerActions.clueTypeSelected, clueType })
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
    <div className='container'>
      <div className='word-list'>
        {state.wordClues.map((wordClue, wordClueIndex) => (
          <div className='word-clue'>
            {wordClue.map((letterClue, letterClueIndex) => {
              const isCursor = wordClueIndex === state.cursor[0] && letterClueIndex === state.cursor[1]
              const cursorClass = isCursor ? ' cursor' : ''
              const clueTypeClass = letterClue.letter ? letterClue.clueType : ''
              return (
                <span
                  className={`letter-clue ${clueTypeClass}${cursorClass}`}
                  onClick={() => handleLetterClick(wordClueIndex, letterClueIndex)}
                >
                  {letterClue.letter}
                </span>
              )
            })}
          </div>
        ))}
      </div>
      <div className='clue-type-chooser'>
        {clueTypesList.map(clueType => {
          const selectedClass = (clueType === state.selectedClueType) ? ' selected' : ''
          return (
            <div
              className={`clue-type ${clueType}${selectedClass}`}
              onClick={() => handleClueTypeClick(clueType)}
              key={clueType}
            />
          )
        })}
      </div>
    </div>
  )
}
