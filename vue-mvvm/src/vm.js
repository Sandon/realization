/**
 * Created by Sandon on 2017/3/5.
 */
import Watcher from './reactive-object/watcher'
import {convert} from './reactive-object'
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
}
