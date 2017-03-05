/**
 * Created by Sandon on 2017/3/4.
 */
export default class Dep {
  static target
  subs
  constructor () {
    this.subs = []
  }
  addSub (sub) {
    this.subs.push(sub)
  }
  notify () {
    // stablize the subscriber list first
    const subs = this.subs.slice()
    subs.forEach(sub => sub.notify())
  }
}
