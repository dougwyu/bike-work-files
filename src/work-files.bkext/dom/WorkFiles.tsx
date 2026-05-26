import { DOMExtensionContext } from 'bike/dom'
import { createRoot } from 'react-dom/client'
import { useState, useRef, useEffect } from 'react'
import { WorkFilesProtocol } from './protocols'

function WorkFilesPanel({ context }: { context: DOMExtensionContext<WorkFilesProtocol> }) {
  const [paths, setPaths] = useState<string[]>([])
  const [adding, setAdding] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const dragIndex = useRef<number | null>(null)

  useEffect(() => {
    context.onmessage = (message) => {
      if (message.type === 'init' || message.type === 'update') {
        setPaths(message.paths)
      }
    }
    return () => {
      context.onmessage = undefined
    }
  }, [])

  useEffect(() => {
    if (adding) {
      inputRef.current?.focus()
    }
  }, [adding])

  function submitPath() {
    const path = inputValue.trim()
    if (path) {
      context.postMessage({ type: 'add', path })
    }
    setInputValue('')
    setAdding(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') submitPath()
    if (e.key === 'Escape') { setInputValue(''); setAdding(false) }
  }

  return (
    <div style={{ padding: '4px 0' }}>
      {paths.length === 0 && !adding && (
        <div
          style={{
            color: 'var(--secondary-label)',
            fontSize: '11px',
            padding: '8px 16px',
            textAlign: 'center',
          }}
        >
          No files. Click + to add.
        </div>
      )}
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {paths.map((p, index) => {
          const name = p.split('/').pop() || p
          return (
            <li
              key={`${p}-${index}`}
              draggable
              onDragStart={() => { dragIndex.current = index }}
              onDragOver={(e) => e.preventDefault()}
              onDragEnd={() => { dragIndex.current = null }}
              onDrop={() => {
                if (dragIndex.current !== null && dragIndex.current !== index) {
                  context.postMessage({ type: 'reorder', fromIndex: dragIndex.current, toIndex: index })
                  dragIndex.current = null
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '3px 8px',
                gap: '6px',
              }}
            >
              <span
                style={{
                  color: 'var(--secondary-label)',
                  cursor: 'grab',
                  userSelect: 'none',
                  flexShrink: 0,
                }}
              >
                ≡
              </span>
              <span
                onClick={() => context.postMessage({ type: 'open', path: p })}
                style={{
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  color: 'var(--label)',
                  fontSize: '13px',
                }}
              >
                {name}
              </span>
              <button
                onClick={() => context.postMessage({ type: 'remove', index })}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--secondary-label)',
                  cursor: 'pointer',
                  padding: '0 2px',
                  fontSize: '13px',
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            </li>
          )
        })}
      </ul>

      {adding ? (
        <div style={{ display: 'flex', alignItems: 'center', padding: '4px 8px', gap: '4px' }}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="/path/to/file.bike"
            style={{
              flex: 1,
              fontSize: '12px',
              padding: '2px 4px',
              border: '1px solid var(--separator)',
              borderRadius: '3px',
              background: 'var(--text-background)',
              color: 'var(--label)',
              outline: 'none',
              minWidth: 0,
            }}
          />
          <button
            onClick={submitPath}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--control-accent)',
              cursor: 'pointer',
              fontSize: '13px',
              padding: '0 2px',
              flexShrink: 0,
            }}
          >
            Add
          </button>
          <button
            onClick={() => { setInputValue(''); setAdding(false) }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--secondary-label)',
              cursor: 'pointer',
              fontSize: '13px',
              padding: '0 2px',
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
          <button
            onClick={() => setAdding(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--control-accent)',
              cursor: 'pointer',
              fontSize: '20px',
              lineHeight: 1,
              padding: '2px 8px',
            }}
          >
            +
          </button>
        </div>
      )}
    </div>
  )
}

export function activate(context: DOMExtensionContext<WorkFilesProtocol>) {
  createRoot(context.element).render(<WorkFilesPanel context={context} />)
}
