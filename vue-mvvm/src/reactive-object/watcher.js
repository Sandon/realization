/**
 * Created by Sandon on 2017/3/4.
 */
import Dep from './dep'
import {parsePath} from '../util'

export default class Watcher {
  constructor (vm, expOrFn, cb) {
    this.cb = cb
    this.vm = vm
    this.getter = typeof expOrFn === 'function' ? expOrFn : parsePath(expOrFn)
    // trigger getter function to be executed to collect dependency
    this.value = this.get()
  }
  get () {
    Dep.pushTarget(this)
    const val = this.getter.call(this.vm, this.vm) // parsePath(this.expOrFn)(this.vm._data)
    Dep.popTarget()
    return val
  }
  update () {
    this.run()
  }
  run () {
    const newVal = this.get()
    if (this.value !== newVal) {
      const oldValue = this.value
      this.value = newVal
      this.cb && this.cb.call(this.vm, newVal, oldValue)
    }
  }
}
