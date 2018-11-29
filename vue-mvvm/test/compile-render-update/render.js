/**
 * Created by Sandon on 2017/5/11.
 */
function render() {
  with (this) {
    return _c('div', null, [
      (list.length) ?
        _c('ul', null, [
          _l((list), function (item, index) {
            return _c('li', null, [_v(_s(index) + ": abc" + _s(item.name) + "xyz")])
          })
        ])
        : _c('span', null, [_v("列表为空")])]
    )
  }
}

function targetRender() {
  with (this) {
    return _c('div', null, [
      list.length ?
        _c('ul', null, [
          ..._l((list), function (item, index) {
            return _c('li', null, [_v(_s(index) + ": abc" + _s(item.name) + "xyz")])
          })
        ]):
        _c('span')
    ])
  }
}
