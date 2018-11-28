/**
 * Created by lipeng on 2018/11/28.
 */
export function isPrimitive (value) {
  const type = typeof value
  return (
    type === 'string' ||
    type === 'number' ||
    type === 'symbol' ||
    type === 'boolean'
  )
}