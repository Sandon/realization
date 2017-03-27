/**
 * Created by Sandon on 2017/3/4.
 */
import Dep from './dep'
import {parsePath} from '../util'

export default class Watcher {
  constructor (vm, expOrFn, cb) {
    this.cb = cb
    this.vm = vm
    this.expOrFn = expOrFn
    // trigger getter function to be executed to collect dependency
    this.value = this.get()
  }
  get () {
    Dep.pushTarget(this)
    const val = parsePath(this.expOrFn)(this.vm._data)
    Dep.popTarget()
    return val
  }
  update (imperative) {
    this.run(imperative)
  }
  run (imperative) {
    const newVal = this.get()
    if (imperative || this.value !== newVal) {
      this.value = newVal
      this.cb.call(this.vm)
    }
  }
}
