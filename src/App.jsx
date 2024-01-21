import React from 'react'
import { evalTypes } from './constants'
import './App.css'

export default function App() {
  const [wordTries, setWordTries] = React.useState(
    [...Array(6)].map(_dummy =>
      [...Array(5)].map(_dummy2 => ({
        letter: '', evalType: evalTypes.none
      }))
    )
  )

  return (
    <>
    </>
  )
}
