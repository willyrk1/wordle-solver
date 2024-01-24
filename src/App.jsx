import React from 'react'
import './App.scss'
import reducer, { initReducer, reducerActions } from './reducer'
import { clueTypes } from './constants'

const clueTypesList = [clueTypes.none, clueTypes.match, clueTypes.partial]

export default function App() {
  const [state, dispatch] = React.useReducer(reducer, initReducer)

  function handleLetterClick(wordClueIndex, letterClueIndex) {
    dispatch({ type: reducerActions.setCursor, wordClueIndex, letterClueIndex })
  }

  function handleClueTypeClick(wordClueIndex, letterClueIndex, clueType) {
    dispatch({ type: reducerActions.clueTypeSelected, wordClueIndex, letterClueIndex, clueType })
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
      <div className="header">W<span className="o">o</span>rd<span className="l">l</span>e Sol<span className="v">v</span>e<span className="r">r</span></div>
      <div className='content'>
        <div className='word-list'>
          {state.wordClues.map((wordClue, wordClueIndex) => (
            <div className='word-clue'>
              {wordClue.map((letterClue, letterClueIndex) => {
                const isCursor = wordClueIndex === state.cursor[0] && letterClueIndex === state.cursor[1]
                const cursorClass = isCursor ? ' cursor' : ''
                const clueTypeClass = letterClue.letter ? letterClue.clueType : ''
                return (
                  <div
                    className={`letter-clue ${clueTypeClass}${cursorClass}`}
                    onClick={() => handleLetterClick(wordClueIndex, letterClueIndex)}
                  >
                    <div className='exact-letter'>{letterClue.letter}</div>

                    <div className='clue-type-chooser'>
                      {clueTypesList.map(clueType => {
                        const selectedClass = (clueType === state.selectedClueType) ? ' selected' : ''
                        return (
                          <div
                            className={`clue-type ${clueType}${selectedClass}`}
                            onClick={() => handleClueTypeClick(wordClueIndex, letterClueIndex, clueType)}
                            key={clueType}
                          />
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <div className='valid-words'>
          <ul>
            {state.validWords.map(word => <li>{word}</li>)}
          </ul>
        </div>
      </div>
    </>
  )
}
