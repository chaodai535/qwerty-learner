import { TypingContext } from '../../store'
import InfoBox from './InfoBox'
import { useContext } from 'react'

export default function Speed() {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state } = useContext(TypingContext)!
  const seconds = state.timerData.time % 60
  const minutes = Math.floor(state.timerData.time / 60)
  const secondsString = seconds < 10 ? '0' + seconds : seconds + ''
  const minutesString = minutes < 10 ? '0' + minutes : minutes + ''
  const wordCount = state.chapterData.wordRecordIds.length

  return (
    <div className="my-card flex w-3/5 rounded-xl bg-white p-4 py-10 opacity-50 transition-colors duration-300 dark:bg-gray-800">
      <InfoBox info={`${minutesString}:${secondsString}`} description="Time Spent" />
      <InfoBox info={wordCount + ''} description="Word Learnt" />
      {/* <InfoBox info={state.timerData.wpm + ''} description="WPM" /> */}
      <InfoBox info={state.chapterData.correctCount + ''} description="Correct Count" />
      <InfoBox info={state.chapterData.wrongCount + ''} description="Wrong Count" />
      <InfoBox info={Math.round((state.chapterData.correctCount / wordCount) * 100) + ''} description="Correct Rate" />
    </div>
  )
}
