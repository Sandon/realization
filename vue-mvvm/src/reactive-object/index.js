/**
 * Created by Sandon on 2017/3/4.
 */
import Dep from './dep'
export default class ReactiveObject {
  constructor (val) {
    this.value = val
    this.walk(val)
  }
  walk (obj) {
    Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]))
  }
}

// add getter/setter for every key/value pair in object
// in getter: collect the dependency relationships for data (watchers depend on data)
// in setter: notify watchers to update when data changes
export function defineReactive(obj, key, val) {
  let childObj = convert(val)
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      if (Dep.target)
        dep.addSub(Dep.target)
      return val
    },
    set: function reactiveSetter (newVal) {
      if (val === newVal)
        return
      val = newVal
      childObj = convert(val)
      dep.notify()
    }
  })
}

export function convert(val, vm) {
  if (!val || 'object' !== typeof val)
    return
  
  return new ReactiveObject(val)
}
