/**
 * Created by Sandon on 2017/3/4.
 */
import Dep from './dep'
export default class ReactiveObject {
  value
  dep
  constructor (val) {
    this.value = val
    // a Dep for the object self
    this.dep = new Dep()
    Object.defineProperty(val, '__reactiveObject__', {
      value: this,
      enumerable: false,
      writable: true,
      configurable: true
    })
    /*
    // array is handled different from normal object
    if (Array.isArray(val)) {
      this.observeArray(val)
    } else {
      this.walk(val)
    }
    */
    this.walk(val)
  }
  walk (obj) {
    Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]))
  }
  observeArray (arr) {
    arr.forEach(item => convert(item))
  }
}

// add getter/setter for every key/value pair in object
// in getter: collect the dependency relationships for data (watchers depend on data)
// in setter: notify watchers to update when data changes
export function defineReactive(obj, key, val) {
  let childObj = convert(val)
  const dep = new Dep() // a Dep for the key-value pair of object
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      if (Dep.target) {
        // watcher depends on the key-value pair of the object
        dep.addSub(Dep.target)
        
        // watcher depends on the value responding to the key.
        // this will be used when manipulate a array (push,pop etc) or add/delete a property on object(array)
        childObj && childObj.dep.addSub(Dep.target)
  
        // if the value responding to the key is a Array,
        // dive into it to collect dependencies.
        // but why? because when converting to ReactiveObject
        // array is treated different from common object?
        // Array.isArray(val) && dependArray(val)
      }
        
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

// convert a normal object to ReactiveObject
export function convert(val, vm) {
  if (!val || 'object' !== typeof val)
    return
  
  if (val.__reactiveObject__)
    return val.__reactiveObject__
  
  return new ReactiveObject(val)
}

function dependArray(arr) {
  arr.forEach(ele => {
    ele && ele.__reactiveObject__ && ele.__reactiveObject__.dep.addSub(Dep.target)
    Array.isArray(ele) && dependArray(ele)
  })
}
