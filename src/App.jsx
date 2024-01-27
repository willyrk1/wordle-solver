import React from 'react'
import './App.scss'
import reducer, { initReducer, reducerActions } from './reducer'
import { clueTypes } from './constants'

const clueTypesList = [clueTypes.none, clueTypes.match, clueTypes.partial]

export default function App() {
  const [state, dispatch] = React.useReducer(reducer, initReducer)

  function handleLetterClueClick(wordClueIndex, letterClueIndex) {
    dispatch({ type: reducerActions.letterClueClicked, wordClueIndex, letterClueIndex })
  }

  function handleClueTypeClick(clueType) {
    dispatch({ type: reducerActions.clueTypeSelected, clueType })
  }

  function handleLetterClueTypeClick(wordClueIndex, letterClueIndex, clueType) {
    dispatch({ type: reducerActions.letterClueTypeSelected, wordClueIndex, letterClueIndex, clueType })
  }

  function handleKeyPressed(key) {
    if (key.toUpperCase() === 'BACKSPACE' || key === '<') {
      dispatch({ type: reducerActions.backspacePressed })
    }
    else if (key.length === 1 && /[a-z]/.test(key)) {
      dispatch({ type: reducerActions.keyPressed, letter: key })
    }
  }

  React.useEffect(() => {
    function handleKeyDown(e) {
      handleKeyPressed(e.key)
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
        <div className='word-clue-list'>
          {state.wordClues.map((wordClue, wordClueIndex) => (
            <div className='word-clue'>
              {wordClue.map((letterClue, letterClueIndex) => {
                const isCursor = wordClueIndex === state.cursor[0] && letterClueIndex === state.cursor[1]
                const cursorClass = isCursor ? ' cursor' : ''
                const clueTypeClass = letterClue.letter ? letterClue.clueType : ''
                return (
                  <div
                    className={`letter-clue ${clueTypeClass}${cursorClass}`}
                    onClick={() => handleLetterClueClick(wordClueIndex, letterClueIndex)}
                  >
                    <div className='exact-letter'>{letterClue.letter}</div>

                    <div className='clue-type-chooser'>
                      {clueTypesList.map(clueType => {
                        const selectedClass = (clueType === state.selectedClueType) ? ' selected' : ''
                        return (
                          <div
                            className={`clue-type ${clueType}${selectedClass}`}
                            onClick={e => {
                              handleLetterClueTypeClick(wordClueIndex, letterClueIndex, clueType)
                              e.stopPropagation()
                            }}
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
          <div className='count'>{state.validWords.length.toLocaleString()}</div>
          <ul>
            {state.validWords.map(word => <li>{word}</li>)}
          </ul>
        </div>
      </div>
      <div className={`keyboard ${state.selectedClueType}`}>
        <p>Choose A Color...</p>
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
        <p>Choose A Letter...</p>
        {['QWERTYUIOP<', 'ASDFGHJKL', 'ZXCVBNM'].map(line => (
          <div key={line} className='keyboard-line'>
            {line.split('').map(letter => (
              <button
                key={letter}
                onClick={() => handleKeyPressed(letter.toLowerCase())}
                className='keyboard-key'
              >
                {letter}
              </button>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
