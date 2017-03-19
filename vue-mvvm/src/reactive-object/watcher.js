/**
 * Created by Sandon on 2017/3/4.
 */
import Dep from './dep'
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
    const val = this.vm._data[this.expOrFn]
    Dep.popTarget()
    return val
  }
  update () {
    this.run()
  }
  run () {
    const newVal = this.get()
    if (this.value !== newVal) {
      this.value = newVal
      this.cb.call(this.vm)
    }
  }
}
