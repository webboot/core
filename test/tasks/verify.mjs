import path from 'path'

import crypto from '@webboot/crypto'

import { fs, is, tryCatch } from '@magic/test'

import { verify, errors } from '../../src/tasks/verify.mjs'

const fixturePath = path.join(process.cwd(), 'test', 'tasks', '.fixtures')

const sriHashPath = path.join(fixturePath, 'sri-hashes.json')
const sriBrokenPath = path.join(fixturePath, 'sri-broken.json')
const sriInvalidPath = path.join(fixturePath, 'sri-invalid-hash.json')

const cwd = process.cwd()

const localSriHashPath = sriHashPath.replace(cwd, '')

const relativePathOptions = {
  dir: path.join('test', 'tasks', '.fixtures'),
  sri: path.join('test', 'tasks', '.fixtures', 'sri-hashes.json'),
  cwd: process.cwd(),
}

export default [
  { fn: tryCatch(verify), expect: is.error, info: 'errors without a state' },
  {
    fn: tryCatch(verify),
    expect: t => is.deep.eq([t.message, t.name], errors.STATE_EMPTY),
    info: 'errors without a state, code: E_STATE_EMPTY',
  },
  {
    fn: tryCatch(verify, ['']),
    expect: t => is.deep.eq([t.message, t.name], errors.STATE_TYPE),
    info: 'state must be an object, code: E_STATE_TYPE',
  },
  {
    fn: tryCatch(verify, { unused: true }),
    expect: is.error,
    info: 'errors if state.sri is empty',
  },
  {
    fn: tryCatch(verify, { unused: true }),
    expect: t => is.deep.eq([t.message, t.name], errors.STATE_SRI_EMPTY),
    info: 'error if state.sri is empty: E_STATE_SRI_EMPTY',
  },
  {
    fn: tryCatch(verify, { sri: 23 }),
    expect: t => is.deep.eq([t.message, t.name], errors.STATE_SRI_TYPE),
    info: 'error if state.sri is empty: E_STATE_SRI_TYPE',
  },
  {
    fn: tryCatch(verify, { sri: '/not/a/path/at/all.json' }),
    expect: is.error,
    info: 'errors if state.sri is not a valid path',
  },
  {
    fn: tryCatch(verify, { sri: sriHashPath, dir: '' }),
    expect: t => is.deep.eq([t.message, t.name], errors.STATE_DIR_EMPTY),
    info: 'errors if state.dir is empty, code: E_STATE_DIR_EMPTY',
  },
  {
    fn: tryCatch(verify, { sri: sriHashPath, dir: 23 }),
    expect: t => is.deep.eq([t.message, t.name], errors.STATE_DIR_TYPE),
    info: 'errors if state.dir is not a string, code: E_STATE_DIR_TYPE',
  },
  {
    fn: verify({ dir: fixturePath, sri: sriHashPath }),
    expect: t => !is.error(t),
    info: 'valid sri-hashes.json does not error.',
  },
  {
    fn: tryCatch(verify, { dir: fixturePath, sri: sriBrokenPath }),
    expect: t => t.code === 'E_JSON_PARSE',
    info: 'valid sri-broken.json does error with E_JSON_PARSE.',
  },
  {
    fn: tryCatch(verify, { dir: fixturePath, sri: sriBrokenPath }),
    expect: t => t.code === 'E_JSON_PARSE',
    info: 'sri-broken.json does error with E_JSON_PARSE.',
  },
  {
    fn: tryCatch(verify, { dir: fixturePath, sri: sriInvalidPath }),
    expect: t => t.code === 'E_HASH_MISMATCH' && t.name === 'HASH_MISMATCH',
    info: 'sri-invalid-hash.json does error with E_HASH_MISMATCH.',
  },

  {
    fn: verify(relativePathOptions),
    expect: t => !is.error(t),
    info: 'state.sri and state.dir can be relative to process.cwd().',
  },
]
