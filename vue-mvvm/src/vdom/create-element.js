/**
 * Created by lipeng on 2018/11/28.
 */
import VNode from "./vnode"
import { isPrimitive } from '../util/common'

export function createElement (context, tag, data, children) {
  // normalize children
  if (children) {
    children = normalizeChildren(children)
  }

  // create VNode
  let vnode
  if (typeof tag === 'string') {
    vnode = new VNode(tag, data, children, undefined, undefined, context)
  }

  return vnode
}

function normalizeChildren (children) {
  if (isPrimitive(children)) {
    return [new VNode(undefined, undefined, undefined, String(children))]
  } else if (Array.isArray(children)) {
    return children.map((child) => {
      if (isPrimitive(child)) {
        return new VNode(undefined, undefined, undefined, String(child))
      }
      return child
    })
  }
}

function normalizeArrayChildren (children) {
  return children.map((child) => {
    if (isPrimitive(child)) {
      return new VNode(undefined, undefined, undefined, String(child))
    }
    return child
  })
}
