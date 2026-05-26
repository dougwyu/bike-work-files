import { DOMProtocol } from 'bike/core'

export const DEFAULTS_KEY = 'workfiles.paths'

export interface WorkFilesProtocol extends DOMProtocol {
  toDOM:
    | { type: 'init'; paths: string[] }
    | { type: 'update'; paths: string[] }
  toApp:
    | { type: 'ready' }
    | { type: 'add'; path: string }
    | { type: 'remove'; index: number }
    | { type: 'reorder'; fromIndex: number; toIndex: number }
    | { type: 'open'; path: string }
}
