import { is, tryCatch } from '@magic/test'

import { parse, stringify } from '../../src/lib/json.mjs'

const validJson = '{ "tested": true }'

const validJsonNullTwo = `{
  "tested": true
}`

export default [
  { fn: parse(validJson).tested, expect: true, info: 'can parse valid json' },

  {
    fn: parse(stringify(parse('{"tested": true}'))).tested,
    expect: true,
    info: 'can parse stringify parse json',
  },

  {
    fn: stringify({ tested: true }),
    expect: validJson.replace(/ /g, ''),
    info: 'can parse stringify parse json',
  },

  {
    fn: tryCatch(parse, '{ "invalid": true, }'),
    expect: t => t.code === 'E_JSON_PARSE',
    info: 'broken json throws E_JSON_PARSE',
  },
  {
    fn: tryCatch(parse, []),
    expect: t => t.code === 'E_JSON_PARSE',
    info: 'function throws E_JSON_PARSE',
  },
]
