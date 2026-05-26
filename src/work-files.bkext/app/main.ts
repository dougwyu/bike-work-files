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

    const paths = bike.defaults.get(DEFAULTS_KEY) as string[]
    handle.postMessage({ type: 'init', paths })

    handle.onmessage = (message) => {
      const current = bike.defaults.get(DEFAULTS_KEY) as string[]

      switch (message.type) {
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
          new URL(`file://${message.path}`).open({})
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
