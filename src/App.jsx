import React from 'react'
import './App.scss'
import reducer, { initReducer, reducerActions } from './reducer'
import { evalTypes } from './constants'

const evalTypesList = [evalTypes.none, evalTypes.match, evalTypes.partial]

export default function App() {
  const [state, dispatch] = React.useReducer(reducer, initReducer)

  function handleLetterClick(wordIndex, letterIndex) {
    dispatch({ type: reducerActions.setCursor, cursor: [wordIndex, letterIndex] })
  }

  function handleEvalTypeClick(evalType) {
    dispatch({ type: reducerActions.evalTypeSelected, evalType })
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
        {state.words.map((word, wordIndex) => (
          <div className='word'>
            {word.map((letterObj, letterIndex) => {
              const isCursor = wordIndex === state.cursor[0] && letterIndex === state.cursor[1]
              const cursorClass = isCursor ? ' cursor' : ''
              const evalType = letterObj.letter ? letterObj.evalType : ''
              return (
                <span
                  className={`letter ${evalType}${cursorClass}`}
                  onClick={() => handleLetterClick(wordIndex, letterIndex)}
                >
                  {letterObj.letter}
                </span>
              )
            })}
          </div>
        ))}
      </div>
      <div className='eval-type-chooser'>
        {evalTypesList.map(evalType => {
          const selectedClass = (evalType === state.selectedEvalType) ? ' selected' : ''
          return (
            <div
              className={`eval-type ${evalType}${selectedClass}`}
              onClick={() => handleEvalTypeClick(evalType)}
              key={evalType}
            />
          )
        })}
      </div>
    </div>
  )
}
