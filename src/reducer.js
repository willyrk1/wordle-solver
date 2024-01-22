import { evalTypes } from "./constants"

export const reducerActions = {
  setCursor: 'setCursor',
  keyPressed: 'keyPressed',
  evalTypeSelected: 'evalTypeSelected',
}

export const initReducer = {
  words: [...Array(6)].map(_dummy =>
    [...Array(5)].map(_dummy2 => ({
      letter: '', evalType: evalTypes.none
    }))
  ),
  cursor: [0, 0],
  selectedEvalType: evalTypes.none,
}

export default function reducer(state, action) {
  function copyWordList(cursor, newLetter) {
    const newWords = []
    
    state.words.forEach(word => {
      const newWord = []
      word.forEach(letter => {
        newWord.push({ letter: letter.letter, evalType: letter.evalType })
      })
      newWords.push(newWord)
    })

    return newWords
  }

  switch (action.type) {
    case reducerActions.setCursor: {
      const newWords = copyWordList()
      newWords[action.cursor[0]][action.cursor[1]].evalType = state.selectedEvalType

      return {
        ...state,
        cursor: action.cursor,
        words: newWords,
      }
    }
    
    case reducerActions.keyPressed: {
      function getNewCursor() {
        const [wordIndex, letterIndex] = state.cursor

        // If not at the end of the word, go to the next letter.
        if (letterIndex < 4) {
          return [wordIndex, letterIndex + 1]
        }

        // If last letter but not the last word, go to first letter of the next word.
        if (wordIndex < 5) {
          return [wordIndex + 1, 0]
        }

        // Last letter of last word. Just stay here.
        return state.cursor
      }

      const newWords = copyWordList()
      newWords[state.cursor[0]][state.cursor[1]].letter = action.letter

      return {
        ...state,
        cursor: getNewCursor(),
        words: newWords,
      }
    }

    case reducerActions.evalTypeSelected: {
      return {
        ...state,
        selectedEvalType: action.evalType,
      }
    }

    default:
      return state
  }
}
