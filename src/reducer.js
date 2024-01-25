import { clueTypes } from "./constants"
import fullDictionary from "./fullDictionary"

export const reducerActions = {
  setCursor: 'setCursor',
  keyPressed: 'keyPressed',
  backspacePressed: 'backspacePressed',
  clueTypeSelected: 'clueTypeSelected',
}

export const initReducer = {
  wordClues: [...Array(6)].map(_dummy =>
    [...Array(5)].map(_dummy2 => ({
      letter: '', clueType: clueTypes.none
    }))
  ),
  cursor: [0, 0],
  validWords: fullDictionary,
}

function toRegexPortion({ letter, clueType }) {
  if (letter)
    return clueType === clueTypes.match ? letter : `[^${letter}]`
  return '.'
}

function toLetterCounts(letterCounts, { letter, clueType }) {
  if (letter) {
    if (!letterCounts[letter]) {
      letterCounts[letter] = { count: 0, exact: false }
    }
    if (clueType === clueTypes.none) {
      letterCounts[letter].exact = true
    }
    else {
      letterCounts[letter].count++
    }
  }
  return letterCounts
}

function toCountFiltered(dictionary, [letter, { count, exact }]) {
  const countRegex = new RegExp((count === 0)
    ? `^[^${letter}]*$`
    : `^(?:[^${letter}]*${letter}[^${letter}]*){${count}${exact ? '' : ','}}`
  )
  return dictionary.filter(word => countRegex.test(word))
}

function toListOfValidWords(dictionary, wordClue) {
  const positionRegex = new RegExp(wordClue.map(toRegexPortion).join(''))
  const filteredByPosition = dictionary.filter(word => positionRegex.test(word))

  const letterCounts = wordClue.reduce(toLetterCounts, {})

  return Object.entries(letterCounts).reduce(toCountFiltered, filteredByPosition)
}

function whereSomeLetterClueFilled(wordClue) {
  return wordClue.some(({ letter }) => letter)
}

function getValidWords(wordClues) {
  return wordClues
    .filter(whereSomeLetterClueFilled)
    .reduce(toListOfValidWords, fullDictionary)
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
      return {
        ...state,
        cursor: [action.wordClueIndex, action.letterClueIndex]
      }
    }
    
    case reducerActions.keyPressed: {
      const [wordClueIndex, letterClueIndex] = state.cursor

      function getNewCursor() {
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
      newWordClues[wordClueIndex][letterClueIndex].letter = action.letter

      return {
        ...state,
        cursor: getNewCursor(),
        wordClues: newWordClues,
        validWords: getValidWords(newWordClues),
      }
    }

    case reducerActions.backspacePressed: {
      const [wordClueIndex, letterClueIndex] = state.cursor

      function getBackspacedCursor() {
        // If not at the beginning of the word, go to the previous letter.
        if (letterClueIndex) {
          return [wordClueIndex, letterClueIndex - 1]
        }

        // If first letter but not the first word, go to last letter of the previous word.
        if (wordClueIndex) {
          return [wordClueIndex - 1, 4]
        }

        // Last letter of last word. Just stay here.
        return state.cursor
      }

      const newState = { wordClues: copyWordClues() }

      // If currently on a letter, just delete it. Otherwise,
      // delete the one to the left and move the cursor.
      if (state.wordClues[wordClueIndex][letterClueIndex].letter) {
        newState.wordClues[wordClueIndex][letterClueIndex] = {
          letter: '',
          clueType: clueTypes.none,
        }
      }
      else {
        newState.cursor = getBackspacedCursor()
        newState.wordClues[newState.cursor[0]][newState.cursor[1]] = {
          letter: '',
          clueType: clueTypes.none,
        }
      }

      return {
        ...state,
        ...newState,
        validWords: getValidWords(newState.wordClues),
      }
    }

    case reducerActions.clueTypeSelected: {
      const newWordClues = copyWordClues()
      newWordClues[action.wordClueIndex][action.letterClueIndex].clueType = action.clueType

      return {
        ...state,
        wordClues: newWordClues,
        validWords: getValidWords(newWordClues),
      }
    }

    default:
      return state
  }
}
