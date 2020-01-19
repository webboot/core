import path from 'path'

import { fs, is, tryCatch } from '@magic/test'

import { errorMessages } from '../../src/errorMessages.mjs'

import { sign, errors } from '../../src/tasks/sign.mjs'

const testDir = path.join(process.cwd(), '.__test__clean__')

export default [
  {
    fn: tryCatch(sign),
    expect: t => is.deep.eq([t.msg, t.name], errors.E_STATE_EMPTY),
    info: 'omitted state errors with E_STATE_EMPTY',
  },
  {
    fn: tryCatch(sign, {}),
    expect: t => is.deep.eq([t.msg, t.name], errors.E_STATE_EMPTY),
    info: 'empty state errors with E_STATE_EMPTY',
  },
  {
    fn: tryCatch(sign, ['']),
    expect: t => is.deep.eq([t.msg, t.name], errors.E_STATE_TYPE),
    info: 'empty state errors with E_STATE_TYPE',
  },

  {
    fn: tryCatch(sign, { test: true }),
    expect: t => is.deep.eq([t.msg, t.name], errors.E_STATE_PUB_KEY_EMPTY),
    info: 'missing state.publicKey errors with STATE_PUB_KEY_EMPTY',
  },
  {
    fn: tryCatch(sign, { publicKey: 23 }),
    expect: t => is.deep.eq([t.msg, t.name], errors.E_STATE_PUB_KEY_TYPE),
    info: 'non-string state.publicKey errors with STATE_PUB_KEY_TYPE',
  },
]
