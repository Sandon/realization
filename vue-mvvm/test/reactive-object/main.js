/**
 * Created by Sandon on 2017/3/12.
 */
// import Vm from '../../src/vm'
var Vm =  require('../../dist/vm').default
console.log(Vm)
const vm = new Vm({
  data: {
    a: 1,
    b: 2
  }
})
vm.$watch('a', () => {
  console.log('watch success')
})

setTimeout(() => {
  vm.a = 5
  console.log(vm)
}, 1000)
