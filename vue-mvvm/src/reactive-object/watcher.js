/**
 * Created by Sandon on 2017/3/4.
 */
export default class Watcher {
  constructor (vm, expOrFn, cb) {
    this.cb = cb
    this.vm = vm
    this.expOrFn = expOrFn
    this.value = this.get()
  }
  get () {
    return this.vm._data[this.expOrFn]
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
