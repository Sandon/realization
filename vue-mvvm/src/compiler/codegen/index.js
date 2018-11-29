/**
 * Created by Sandon on 2017/5/9.
 */
export function generate (ast) {
  let code = ast ? genElement(ast) : '_c("div")'
  code = `with(this){return ${code}}`
  return {
    render: new Function(code)
  }
}

function genElement (el) {
  if (el.for && !el.forProcessed) {
    return genFor(el)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el)
  } else {
    // component or element
    if (el.component) {
      // component
    } else {
      // element
      const data = genData(el) || null
      const children = genChildren(el) || null
      return `_c('${el.tag}',${data}, ${children})`
    }
  }
}

function genFor (el) {
  const iterator1 = el.iterator1 ? `,${el.iterator1}` : ''
  const iterator2 = el.iterator2 ? `,${el.iterator2}` : ''

  el.forProcessed = true
  return `..._l((${el.for}),function(${el.alias}${iterator1}${iterator2}){` +
    `return ${genElement(el)}` +
    `})`
}

function genIf (el) {
  el.ifProcessed = true
  return genIfConditions(el.ifConditions.slice())
}
function genIfConditions (conditions) {
  if (!conditions.length) {
    return '_e()'
  }
  const condition = conditions.shift()
  if (condition.exp) {
    // if or else-if
    return `(${condition.exp})?${genElement(condition.block)}:${genIfConditions(conditions)}`
  } else {
    // else
    return genElement(condition.block)
  }
}

function genChildren (el) {
  const children = el.children
  if (children.length) {
    return `[${children.map(c => genNode(c)).join(',')}]`
  }
}
function genNode (el) {
  if (el.type === 1) {
    return genElement(el)
  } else if (el.type === 2) {
    // literal expression, remember literal expression is like '_s(name)' format
    return `_v(${el.expression})`
  } else {
    // normal text
    return `_v(${JSON.stringify(el.text)})`
  }
}

function genData (el) {

}
