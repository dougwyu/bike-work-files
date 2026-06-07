import { AppExtensionContext, DOMScriptHandle, URL } from 'bike/app'
import { WorkFilesProtocol, DEFAULTS_KEY } from '../dom/protocols'
import { reorderList } from './util'

export async function activate(context: AppExtensionContext) {
  bike.defaults.registerDefaults({ [DEFAULTS_KEY]: [] })

  const handles: DOMScriptHandle<WorkFilesProtocol>[] = []

  bike.observeWindows(async (window) => {
    const handle = await window.inspector.addItem<WorkFilesProtocol>({
      label: 'Work Files',
      script: 'WorkFiles.js',
    })

    handles.push(handle)
    const originalDispose = handle.dispose.bind(handle)
    handle.dispose = () => {
      handles.splice(handles.indexOf(handle), 1)
      originalDispose()
    }

    handle.onmessage = (message) => {
      const current = bike.defaults.get(DEFAULTS_KEY) as string[]

      switch (message.type) {
        case 'ready': {
          handle.postMessage({ type: 'init', paths: current })
          break
        }
        case 'add': {
          const updated = [...current, message.path]
          bike.defaults.set(DEFAULTS_KEY, updated)
          broadcast(handles, { type: 'update', paths: updated })
          break
        }
        case 'remove': {
          const updated = current.filter((_, i) => i !== message.index)
          bike.defaults.set(DEFAULTS_KEY, updated)
          broadcast(handles, { type: 'update', paths: updated })
          break
        }
        case 'reorder': {
          const updated = reorderList(current, message.fromIndex, message.toIndex)
          bike.defaults.set(DEFAULTS_KEY, updated)
          broadcast(handles, { type: 'update', paths: updated })
          break
        }
        case 'open': {
          const existing = bike.documents.find(d => d.fileURL?.path === message.path)
          if (existing) {
            existing.activate()
          } else {
            new URL(`file://${message.path}`).open({})
          }
          break
        }
      }
    }
  })
}

function broadcast(
  handles: DOMScriptHandle<WorkFilesProtocol>[],
  message: WorkFilesProtocol['toDOM']
): void {
  for (const handle of handles) {
    handle.postMessage(message)
  }
}
