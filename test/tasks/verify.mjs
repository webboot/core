import path from 'path'

import crypto from '@webboot/crypto'

import { fs, is, tryCatch } from '@magic/test'

import { verify } from '../../src/tasks/verify.mjs'

const fixturePath = path.join(process.cwd(), 'test', 'tasks', '.fixtures')

const sriHashPath = path.join(fixturePath, 'sri-hashes.json')
const sriBrokenPath = path.join(fixturePath, 'sri-broken.json')
const sriInvalidPath = path.join(fixturePath, 'sri-invalid-hash.json')

const cwd = process.cwd()

const localSriHashPath = sriHashPath.replace(cwd, '')

const relativePathOptions = {
  dir: fixturePath,
  sri: 'sri-hashes.json',
  cwd: fixturePath,
}

export default [
  { fn: tryCatch(verify), expect: is.error, info: 'errors without a state' },
  {
    fn: tryCatch(verify),
    expect: t => t.code === 'E_STATE_EMPTY',
    info: 'errors without a state, code: E_STATE_EMPTY',
  },
  {
    fn: tryCatch(verify, { unused: true }),
    expect: is.error,
    info: 'errors if state.sri is empty',
  },
  {
    fn: tryCatch(verify, { unused: true }),
    expect: t => t.code === 'E_STATE_KEY_MISSING',
    info: 'errors if state.sri is empty, code: E_STATE_KEY_MISSING',
  },
  {
    fn: tryCatch(verify, { sri: '/not/a/path/at/all.json' }),
    expect: is.error,
    info: 'errors if state.sri is not a valid path',
  },
  {
    fn: tryCatch(verify, { sri: '/not/a/path/at/all.json' }),
    expect: t => t.code === 'ERR_INVALID_ARG_TYPE',
    info: 'errors if state.sri is not a valid path, code: ERR_INVALID_ARG_TYPE',
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
    expect: t => t.code === 'E_HASH_MISMATCH',
    info: 'sri-invalid-hash.json does error with E_HASH_MISMATCH.',
  },

  {
    fn: verify(relativePathOptions),
    expect: t => !is.error(t),
    info: 'state.sri can be relative to process.cwd().',
  },
]
