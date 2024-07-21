Function.prototype.myBind = function (context, ...outArgs) {
  context = context === null || context === undefined ? window : Object(context)
  const fnSymbol = Symbol('fn')
  const originFn = this
  
  const boundFn = function (...innerArgs) {
    const isNew = this instanceof boundFn
    const realThis = isNew ? this : context
    
    realThis[fnSymbol] = originFn
    const result = realThis[fnSymbol](outArgs.concat(innerArgs))
    delete realThis[fnSymbol]
    
    return result
  }
  
  if (originFn.prototype) {
    boundFn.prototype = Object.create(originFn.prototype)
  }
  
  return boundFn
}
