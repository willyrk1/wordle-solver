import { clueTypes } from "./constants"
import fullDictionary from "./fullDictionary"

export const reducerActions = {
  setCursor: 'setCursor',
  keyPressed: 'keyPressed',
  clueTypeSelected: 'clueTypeSelected',
}

export const initReducer = {
  wordClues: [...Array(6)].map(_dummy =>
    [...Array(5)].map(_dummy2 => ({
      letter: '', clueType: clueTypes.none
    }))
  ),
  cursor: [0, 0],
  selectedClueType: clueTypes.none,
  validWords: fullDictionary,
}

function toListOfValidWords(dictionary, wordClue) {
  return dictionary
}

function getValidWords(wordClues) {
  return wordClues.reduce(toListOfValidWords, fullDictionary)
}

export default function reducer(state, action) {
  function copyWordClues() {
    const newWordClues = []
    
    state.wordClues.forEach(clue => {
      const newWordClue = []
      clue.forEach(letterClue => {
        newWordClue.push({ letter: letterClue.letter, clueType: letterClue.clueType })
      })
      newWordClues.push(newWordClue)
    })

    return newWordClues
  }

  switch (action.type) {
    case reducerActions.setCursor: {
      const newWordClues = copyWordClues()
      newWordClues[action.cursor[0]][action.cursor[1]].clueType = state.selectedClueType

      return {
        ...state,
        cursor: action.cursor,
        wordClues: newWordClues,
        validWords: getValidWords(newWordClues),
      }
    }
    
    case reducerActions.keyPressed: {
      function getNewCursor() {
        const [wordClueIndex, letterClueIndex] = state.cursor

        // If not at the end of the word, go to the next letter.
        if (letterClueIndex < 4) {
          return [wordClueIndex, letterClueIndex + 1]
        }

        // If last letter but not the last word, go to first letter of the next word.
        if (wordClueIndex < 5) {
          return [wordClueIndex + 1, 0]
        }

        // Last letter of last word. Just stay here.
        return state.cursor
      }

      const newWordClues = copyWordClues()
      newWordClues[state.cursor[0]][state.cursor[1]].letter = action.letter

      return {
        ...state,
        cursor: getNewCursor(),
        wordClues: newWordClues,
        validWords: getValidWords(newWordClues),
      }
    }

    case reducerActions.clueTypeSelected: {
      return {
        ...state,
        selectedClueType: action.clueType,
      }
    }

    default:
      return state
  }
}
