/**
 * Created by Sandon on 2017/5/2.
 */
import { parseHtml } from './html-parser'
import {getAndRemoveAttr} from '../helper'
export function parse(template) {
  let root
  let currentParent
  parseHtml(template, {
    start (tag, attrs, unary) {
      let element = {
        type: 1,
        tag,
        attrsList: attrs,
        parent: currentParent,
        children: []
      }

      processFor(element)
      processIf(element, currentParent)

      if (!root) {
        root = element
      }

      if (currentParent) {
        currentParent.children.push(element)
      }

      if (!unary) {
        currentParent = element
      }
    },
    end () {
      currentParent = currentParent.parent
    },
    chars (text) {
      if (!currentParent) {return}
      if (text) {
        let exp = parseText(text)
        if (exp) {
          currentParent.children.push({
            type: 2, // literal expression
            expression: exp
          })
        } else {
          currentParent.children.push({
            type: 3, // normal text
            text
          })
        }
      }
    }
  })
  return root
}

/**
 *  (item, key, index) in itemList
 *  el.for = 'itemList'
 *  el.alias = 'item'
 *  el.iterator1 = 'key'
 *  el.iterator2 = 'index'
 */
function processFor (el) {
  let exp
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    const res = parseFor(exp)
    if (res) {
      Object.assign(el, res)
    }
  }
}
function parseFor (exp) {
  const forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/
  const stripParensRE = /^\(|\)$/g
  const forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/

  // (item, key, index) in itemList

  const inMatch = exp.match(forAliasRE)
  if (!inMatch) return
  const res = {}
  res.for = inMatch[2].trim() // 'itemList'
  const alias = inMatch[1].trim().replace(stripParensRE, '') // (item, key, index) => item, key, index
  const iteratorMatch = alias.match(forIteratorRE)
  if (iteratorMatch) {
    res.alias = alias.replace(forIteratorRE, '').trim() // 'item'
    res.iterator1 = iteratorMatch[1].trim() // 'key'
    if (iteratorMatch[2]) {
      res.iterator2 = iteratorMatch[2].trim() // 'index'
    }
  } else {
    res.alias = alias
  }
  return res
}

function processIf (el, parent) {
  let exp
  if (exp = getAndRemoveAttr(el, 'v-if')) {
    addIfCondition(el, {
      exp: exp,
      block: el
    })
  } else if (exp = getAndRemoveAttr(el, 'v-else-if')) {
    const prev = findPrevElement( parent.children)
    prev && addIfCondition(prev, {
      exp: exp,
      block: el
    })
  } else if (exp = getAndRemoveAttr(el, 'v-else')) {
    const prev = findPrevElement( parent.children)
    prev && addIfCondition(prev, {
      exp: exp,
      block: el
    })
  }
}
function addIfCondition (el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = []
  }
  el.ifConditions.push(condition)
}
function findPrevElement (children) {
  let i = children.length
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    } else {
      children.pop()
    }
  }
}

/**
 * text parser
 * 'abc{{name}}xyz' => '"abc"+_s(name)+"xyz"'
 */
function parseText (text) {
  const tagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
  if (!tagRE.test(text)) { return }

  let lastIndex = tagRE.lastIndex = 0
  let match
  let tokens = []
  while ((match = tagRE.exec(text))) {
    // there are normal text before {{
    if (match.index > lastIndex) {
      tokens.push(JSON.stringify(text.slice(lastIndex, match.index)))
    }

    // token in expression
    tokens.push(`_s(${match[1].trim()})`)

    lastIndex = tagRE.lastIndex
  }

  // there are normal text after }}
  if (lastIndex < text.length) {
    tokens.push(JSON.stringify(text.slice(lastIndex)))
  }

  return tokens.join('+')
}
// console.log(parseText('abc{{name}}xyz'))