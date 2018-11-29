/**
 * Created by Sandon on 2017/5/2.
 */

// Regular Expressions for parsing tags and attributes
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/

const ncname = '[a-zA-Z_][\\w\\-\\.]*'
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)

export default function parseHTML (html, options) {
  const stack = []
  let index = 0 // relative to original html string
  let last, lastTag
  while (html) {
    last = html

    let textEnd = html.indexOf('<') // relative to html string in this while loop
    if (textEnd === 0) {
      // End tag:
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        const curIndex = index
        advance(endTagMatch[0].length)
        parseEndTag(endTagMatch[1], curIndex, index)
        continue
      }

      // Start tag:
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        handleStartTag(startTagMatch)
        continue
      }
    }

    let rest, next
    if (textEnd >= 0) {
      // rest = html.slice(textEnd)
      // while (
      //   !endTag.test(rest) &&
      //   !startTagOpen.test(rest)
      //   ) {
      //   // < in plain text, be forgiving and treat it as text
      //   next = rest.indexOf('<', 1) // relative to 'rest'
      //   if (next < 0) {
      //     textEnd = html.length
      //     break
      //   }
      //   textEnd += next
      //   rest = html.slice(textEnd)
      // }
      options.chars(html.substring(0, textEnd))
      advance(textEnd)
    }

    if (textEnd < 0) {
      options.chars(html)
      html = ''
    }
  }

  // Clean up any remaining tags
  parseEndTag()

  function advance (n) {
    index += n
    html = html.substring(n)
  }

  function parseStartTag () {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
        start: index
      }
      advance(start[0].length)
      let end, attr
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length)
        match.attrs.push(attr)
      }
      if (end) {
        match.unarySlash = end[1]
        advance(end[0].length)
        match.end = index
        return match
      }
    }
  }

  function handleStartTag (match) {
    const tagName = match.tagName
    const unary = !!match.unarySlash

    const attrs = match.attrs.map((args) => {
      return {
        name: args[1],
        value: args[3] || args[4] || args[5] || ''
      }
    })

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs })
      lastTag = tagName
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end)
    }
  }

  function parseEndTag (tagName, start, end) {
    let pos, lowerCasedTagName
    if (start == null) start = index
    if (end == null) end = index

    // Find the closest opened tag of the same type
    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase()
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (let i = stack.length - 1; i >= pos; i--) {
        if (options.end) {
          options.end(stack[i].tag, start, end)
        }
      }

      // Remove the open elements from the stack
      stack.length = pos
      lastTag = pos && stack[pos - 1].tag
    }
  }
}
