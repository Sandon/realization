/**
 * Created by lipeng on 2018/11/27.
 */
export default class VNode {
  constructor (tag, data, children, text, elm, context) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.context = context
  }
}
export function createTextVNode (text) {
  return new VNode(undefined, undefined, undefined, String(text))
}