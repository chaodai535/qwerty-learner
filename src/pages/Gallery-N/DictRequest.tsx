import InfoPanel from '@/components/InfoPanel'
import { useCallback, useState } from 'react'
import IconBook2 from '~icons/tabler/book-2'

export default function DictRequest() {
  const [showPanel, setShowPanel] = useState(false)

  const onOpenPanel = useCallback(() => {
    setShowPanel(true)
  }, [])

  const onClosePanel = useCallback(() => {
    setShowPanel(false)
  }, [])

  return (
    <>
      {showPanel && (
        <InfoPanel
          openState={showPanel}
          title="Contribute Dictionary"
          icon={IconBook2}
          buttonClassName="bg-sky-400 hover:bg-sky-300"
          iconClassName="text-sky-400 bg-sky-100 dark:text-indigo-300 dark:bg-sky-400"
          onClose={onClosePanel}
        >
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Coming soon...
            <br />
            Teams or email contact <strong>Steven.Zhang</strong> or <strong>Chao.Dai</strong>{' '}
          </p>
          <br />
        </InfoPanel>
      )}
      <button className="cursor-pointer pr-6 text-sm text-sky-400" onClick={onOpenPanel}>
        Want to contribute more？
      </button>
    </>
  )
}
