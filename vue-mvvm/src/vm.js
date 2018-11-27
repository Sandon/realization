/**
 * Created by Sandon on 2017/3/5.
 */
import Watcher from './reactive-object/watcher'
import { convert } from './reactive-object'
import { compile } from './compiler/index'
import VNode from './vdom/vnode'

export default class Vm {
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
    const { render } = compile(this.$options.template)
    this.$options.render = render

    // render to vnode tree, patch and add watcher
    const updateComponent = () => {
      this._update(this._render())
    }
    this._watcher = new Watcher(this, updateComponent, null)

    if (this.$vnode == null) {
      this._isMounted = true
    }
  }
  $createElement (context, tag, data, children) {
    let vnode
    if (typeof tag === 'string') {
      vnode = new VNode(tag, data, children, undefined, undefined, context)
    }

    return vnode
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
      vm.$el = vm.__patch__(vm.$el, vnode)
    } else {
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
  }
  __patch__ (oldVnode, vnode) {
    const isRealElement = oldVnode.nodeType
  }
}
