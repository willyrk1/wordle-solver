import { evalTypes } from "./constants"

export const reducerActions = {
  setCursor: 'setCursor',
  keyPressed: 'keyPressed',
}

export const initReducer = {
  words: [...Array(6)].map(_dummy =>
    [...Array(5)].map(_dummy2 => ({
      letter: '', evalType: evalTypes.none
    }))
  ),
  cursor: [0, 0]
}

export default function reducer(state, action) {
  switch (action.type) {
    case reducerActions.setCursor: {
      return {
        ...state,
        cursor: action.cursor,
      }
    }
    
    case reducerActions.keyPressed: {
      const { words, cursor } = state

      const [wordIndex, letterIndex] = cursor

      function getNewWordList() {
        // COOL WAY....
        // const newWords = [
        //   ...words.slice(0, wordIndex),
        //   [
        //     ...words[wordIndex].slice(0, letterIndex),
        //     {letter: "P", evalType: evalTypes.none},
        //     ...words[wordIndex].slice(letterIndex + 1),
        //   ],
        //   ...words.slice(wordIndex + 1)
        // ]

        // BEGINNER WAY  ;)
        const newWords = []
        words.forEach(word => {
          const newWord = []
          word.forEach(letter => {
            newWord.push({ letter: letter.letter, evalType: letter.evalType })
          })
          newWords.push(newWord)
        })
        newWords[wordIndex][letterIndex].letter = action.letter

        return newWords
      }

      function getNewCursor() {
        // If not at the end of the word, go to the next letter.
        if (letterIndex < 4) {
          return [wordIndex, letterIndex + 1]
        }

        // If last letter but not the last word, go to first letter of the next word.
        if (wordIndex < 5) {
          return [wordIndex + 1, 0]
        }

        // Last letter of last word. Just stay here.
        return cursor
      }

      return {
        ...state,
        cursor: getNewCursor(),
        words: getNewWordList(),
      }
    }
    default:
      return state
  }
}
