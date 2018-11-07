/**
 * Created by Sandon on 2017/5/2.
 */
import { parseHtml } from './html-parser'
import parseText from './text-parser'
export function parse(template) {
  let root
  let currentParent
  parseHtml(template, {
    start () {

    },
    end () {},
    chars (text) {
      if (!currentParent) {return}
      if (text) {
        let res
        if (res = parseText(text)) {

        } else {

        }
      }
    }
  })
}


