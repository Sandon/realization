/**
 * Created by Sandon on 2017/3/5.
 */
import Watcher from './reactive-object/watcher'
import { convert } from './reactive-object'
import { compile } from './compiler/index'
import VNode from './vdom/vnode'
import { createElement } from './vdom/create-element'

class Vm {
  constructor (options = {}) {
    this.$options = options
    this._data = this.$options.data
    this._proxy()
    convert(this._data, this) // convert this._data to reactive
  }
  _proxy () {
    let  self = this
    Object.keys(this._data).forEach(key => {
      Object.defineProperty(self, key, {
        enumerable: true,
        configurable: true,
        get: function proxyGetter() {
          return self._data[key]
        },
        set: function proxySetter (newVal) {
          self._data[key] = newVal
        }
      })
    })
  }
  $watch (expOrFn, cb) {
    new Watcher(this, expOrFn, cb)
  }
  $mount (el) {
    el = document.querySelector(el)
    this.$el = el

    // convert template to render function
    // const { render } = compile(this.$options.template)
    // this.$options.render = render

    // render to vnode tree, patch and add watcher
    const updateComponent = () => {
      this._update(this._render())
    }
    this._watcher = new Watcher(this, updateComponent, null)

    if (this.$vnode == null) {
      this._isMounted = true
    }
  }
  $createElement (tag, data, children) {
    return createElement(this, tag, data, children)
  }
  _render () {
    const vm = this
    const { render, _parentVnode } = vm.$options

    vm.$vnode = _parentVnode
    const vnode = render.call(vm, vm.$createElement)
    vnode.parent = _parentVnode
    return vnode
  }
  _update (vnode) {
    const vm = this
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    vm._vnode = vnode
    if (!prevVnode) {
      // first render
      vm.$el = vm.__patch__(vm.$el, vnode)
    } else {
      // update
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
  }
  __patch__ (oldVnode, vnode) {
    const insertedVnodeQueue = []
    const isRealElement = oldVnode.nodeType !== undefined
    if (isRealElement) {
      oldVnode = new VNode(oldVnode.tagName.toLowerCase(), {}, [], undefined, oldVnode)
    }
    const oldElm = oldVnode.elm
    const parentElm = oldElm.parentElement

    // create whole dom tree recursively
    createElm(vnode, insertedVnodeQueue, parentElm, oldElm.nextSibling)

    // remove old dom
    parentElm && parentElm.removeChild(oldVnode.elm)

    return vnode.elm
  }
}
function createElm (vnode, insertedVnodeQueue, parentElm, refElm) {
  const data = vnode.data
  const children = vnode.children
  const tag = vnode.tag

  if (tag) {
    vnode.elm = document.createElement(tag)
    createChildren(vnode, children, insertedVnodeQueue)
    parentElm.insertBefore(vnode.elm, refElm)
  } else {
    vnode.elm = document.createTextNode(vnode.text)
    parentElm.insertBefore(vnode.elm, refElm)
  }
}

function createChildren (vnode, children, insertedVnodeQueue) {
  const type = typeof vnode.text
  if (Array.isArray(children)) {
    children.forEach((child, index) => {
      createElm(child, insertedVnodeQueue, vnode.elm, null)
    })
  } else if (type === 'string' || type === 'number' || type === 'boolean') {
    vnode.elm.appendChild(document.createTextNode(String(vnode.text)))
  }
}

export default Vm

if (typeof window !== 'undefined') {
  window['Vm'] = Vm
} else {
  console.log('server')
}
