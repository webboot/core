import { fs, is, tryCatch } from '@magic/test'

import { errorMessages } from '../../src/errorMessages.mjs'

import { sign, errors } from '../../src/tasks/sign.mjs'

export default [
  {
    fn: tryCatch(sign),
    expect: t => is.deep.eq([t.msg, t.name], errors.STATE_EMPTY),
    info: 'no state arg errors with errors.STATE_EMPTY',
  },
  {
    fn: tryCatch(sign, []),
    expect: t => is.deep.eq([t.msg, t.name], errors.STATE_EMPTY),
    info: 'empty array state errors with errors.STATE_EMPTY',
  },
  {
    fn: tryCatch(sign, {}),
    expect: t => is.deep.eq([t.msg, t.name], errors.STATE_EMPTY),
    info: 'empty object state errors with errors.STATE_EMPTY',
  },

  {
    fn: tryCatch(sign, ['']),
    expect: t => is.deep.eq([t.msg, t.name], errors.STATE_TYPE),
    info: 'non-empty array state errors with errors.STATE_TYPE',
  },
  {
    fn: tryCatch(sign, new Date()),
    expect: t => is.deep.eq([t.msg, t.name], errors.STATE_TYPE),
    info: 'date as state errors with errors.STATE_TYPE',
  },
  {
    fn: tryCatch(sign, function() {}),
    expect: t => is.deep.eq([t.msg, t.name], errors.STATE_TYPE),
    info: 'function as state errors with errors.STATE_TYPE',
  },

  {
    fn: tryCatch(sign, { username: '' }),
    expect: t => is.deep.eq([t.msg, t.name], errors.STATE_USERNAME_EMPTY),
    info: 'empty state.username errors with STATE_USERNAME_EMPTY',
  },
  {
    fn: tryCatch(sign, { username: 23 }),
    expect: t => is.deep.eq([t.msg, t.name], errors.STATE_USERNAME_TYPE),
    info: 'non string state.username errors with STATE_USERNAME_TYPE',
  },
]
