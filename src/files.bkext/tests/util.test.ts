import { reorderList } from '../app/util'

describe('reorderList', () => {
  it('moves an item forward in the list', () => {
    const result = reorderList(['a', 'b', 'c'], 0, 2)
    assert(JSON.stringify(result) === JSON.stringify(['b', 'c', 'a']), `Expected ["b","c","a"] but got ${JSON.stringify(result)}`)
  })
  it('moves an item backward in the list', () => {
    const result = reorderList(['a', 'b', 'c'], 2, 0)
    assert(JSON.stringify(result) === JSON.stringify(['c', 'a', 'b']), `Expected ["c","a","b"] but got ${JSON.stringify(result)}`)
  })
  it('does not mutate the original list', () => {
    const original = ['a', 'b', 'c']
    reorderList(original, 0, 1)
    assert(JSON.stringify(original) === JSON.stringify(['a', 'b', 'c']), `Expected original to be unmutated but got ${JSON.stringify(original)}`)
  })
  it('handles adjacent items', () => {
    const result = reorderList(['a', 'b', 'c'], 0, 1)
    assert(JSON.stringify(result) === JSON.stringify(['b', 'a', 'c']), `Expected ["b","a","c"] but got ${JSON.stringify(result)}`)
  })
})
