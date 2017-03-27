/**
 * Created by Sandon on 2017/3/4.
 */
/**
 * A dep is an observable that can have multiple
 * watchers(directives in template or watchers bound manually) subscribing to it.
 */
export default class Dep {
  // the current target watcher being evaluated.
  // this is globally unique because there could be only one
  // watcher being evaluated at any time.
  static target = null
  static _targetStack = []
  static pushTarget = function (targetWatcher) {
    Dep._targetStack.push(Dep.target)
    Dep.target = targetWatcher
  }
  static popTarget = function () {
    Dep.target = Dep._targetStack.pop()
  }
  
  subs = []
  constructor () {
  }
  addSub (sub) {
    this.subs.push(sub)
  }
  notify (imperative) {
    // stablize the subscriber list first
    const subs = this.subs.slice()
    subs.forEach(sub => sub.update(imperative))
  }
}
