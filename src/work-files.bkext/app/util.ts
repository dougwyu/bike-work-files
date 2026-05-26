export function reorderList<T>(list: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...list]
  const [item] = result.splice(fromIndex, 1)
  result.splice(toIndex, 0, item)
  return result
}
