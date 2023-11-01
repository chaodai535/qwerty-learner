import { TypingContext, TypingStateActionType } from '../../store'
import type { WordState } from '../WordPanel/components/Word/type'
import { initialWordState } from '../WordPanel/components/Word/type'
import Tooltip from '@/components/Tooltip'
import { wordDictationConfigAtom } from '@/store'
import { CTRL, useMixPanelWordLogUploader } from '@/utils'
import { useSaveWordRecord } from '@/utils/db'
import { useAtomValue } from 'jotai'
import { useCallback, useContext, useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer'

export default function RecognizeOrNotButton({ type, classname }: RecognizeOrNotButtonProps) {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state, dispatch } = useContext(TypingContext)!
  const [wordState, setWordState] = useImmer<WordState>(structuredClone(initialWordState))
  const saveWordRecord = useSaveWordRecord()
  const wordLogUploader = useMixPanelWordLogUploader(state)

  const wordDictationConfig = useAtomValue(wordDictationConfigAtom)
  const newIndex = useMemo(() => state.chapterData.index + 1, [state.chapterData.index])
  const word = state.chapterData.words[newIndex]
  const shortCutKey = useMemo(() => (type === 'recognize' ? `${CTRL} + Shift + ArrowUp` : `${CTRL} + Shift + ArrowDown`), [type])

  const onClickWord = useCallback(() => {
    if (!word) return

    saveWordRecord({
      word: word.name,
      wrongCount: wordState.wrongCount,
      letterTimeArray: wordState.letterTimeArray,
      letterMistake: wordState.letterMistake,
    })

    wordLogUploader({
      headword: word.name,
      timeStart: wordState.startTime,
      timeEnd: wordState.endTime,
      countInput: wordState.correctCount + wordState.wrongCount,
      countCorrect: wordState.correctCount,
      countTypo: wordState.wrongCount,
    })

    if (type === 'recognize') {
      dispatch({ type: TypingStateActionType.REPORT_CORRECT_WORD })
    }

    if (type === 'unrecognizable') {
      dispatch({ type: TypingStateActionType.REPORT_WRONG_WORD, payload: { letterMistake: wordState.letterMistake } })
    }

    dispatch({ type: TypingStateActionType.SKIP_2_WORD_INDEX, newIndex })
    //
    // dispatch({ type: TypingStateActionType.SET_IS_SAVING_RECORD, payload: true })
  }, [
    dispatch,
    newIndex,
    saveWordRecord,
    type,
    word,
    wordLogUploader,
    wordState.correctCount,
    wordState.endTime,
    wordState.letterMistake,
    wordState.letterTimeArray,
    wordState.startTime,
    wordState.wrongCount,
  ])

  // useEffect(() => {
  //   if (wordState.isFinished) {
  //     dispatch({ type: TypingStateActionType.SET_IS_SAVING_RECORD, payload: true })

  //     wordLogUploader({
  //       headword: word.name,
  //       timeStart: wordState.startTime,
  //       timeEnd: wordState.endTime,
  //       countInput: wordState.correctCount + wordState.wrongCount,
  //       countCorrect: wordState.correctCount,
  //       countTypo: wordState.wrongCount,
  //     })
  //     saveWordRecord({
  //       word: word.name,
  //       wrongCount: wordState.wrongCount,
  //       letterTimeArray: wordState.letterTimeArray,
  //       letterMistake: wordState.letterMistake,
  //     })
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [wordState.isFinished])

  return (
    <>
      {word && (
        <div className={classname}>
          <Tooltip content={`Shortcut key: ${shortCutKey}`}>
            <div
              onClick={onClickWord}
              className="flex max-w-xs cursor-pointer select-none items-center text-gray-700 opacity-60 duration-200 ease-in-out hover:opacity-100 dark:text-gray-400"
            >
              {type === 'recognize' && (
                <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 md:px-6 md:py-3">Recognize</button>
              )}
              {type === 'unrecognizable' && (
                <button className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700 md:px-6 md:py-3">
                  Unrecognizable
                </button>
              )}
            </div>
          </Tooltip>
        </div>
      )}
    </>
  )
}

export type RecognizeOrNotButtonProps = {
  type: 'recognize' | 'unrecognizable'
  classname: string
}
