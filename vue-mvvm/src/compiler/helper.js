/**
 * Created by Sandon on 2017/5/16.
 */
export function getAndRemoveAttr (el, name) {
  let val
  const attrsList = el.attrsList
  for (let i = 0, len = attrsList.length; i !== len; i++) {
    if (attrsList[i].name === name) {
      val = attrsList[i].value
      attrsList.splice(i, 1)
      break
    }
  }
  return val
}
