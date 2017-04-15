/**
 * Created by Sandon on 2017/3/12.
 */
// import Vm from '../../src/vm'
var Vm =  require('../../dist/vm').default
console.log(Vm)
const vm = new Vm({
  data: {
    a: 1,
    b: [
      {x: 'x'},
      {y: 'y'},
      [
        {
          z: 'z1',
          w: 'w'
        },
        'string'
      ]
    ]
  }
})
vm.$watch('a', () => {
  console.log('watch a success')
  console.log(vm.a)
})
vm.$watch('b[2][0].z', () => {
  console.log('watch b[2][0].z success')
  console.log(vm.b[2][0].z)
})
vm.$watch('b[2]', () => {
  console.log('watch b[2] success, using push on it')
  console.log(vm.b[2])
})

setTimeout(() => {
  vm.a = 2
  vm.b[2][0].z = 'z2'
  vm.b[2].push('push')
}, 1000)
