/**
 * Created by Sandon on 2017/3/18.
 */
const originArrayProto = Array.prototype
export const reactiveArrayProto = Object.create(originArrayProto)
  
;['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(method => {
  // console.log('method:' + method)
  const originMethod = originArrayProto[method]
  Object.defineProperty(reactiveArrayProto, method, {
    value: function () {
      const result = originMethod.apply(this, arguments)
      this.__reactiveObject__.dep.notify()
      return result
    },
    enumerable: false,
    writable: true,
    configurable: true
  })
})
