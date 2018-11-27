/**
 * Created by Sandon on 2017/5/2.
 */
import { parse } from './parser'
import  { generate } from './codegen'

export function compile (template) {
  const ast = parse(template.trim())
  const code = generate(ast)

  return {
    ast,
    render: code.render,
  }
}
