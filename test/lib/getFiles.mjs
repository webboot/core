import path from 'path'

import { is, tryCatch } from '@magic/test'

import { getFiles, errors } from '../../src/lib/getFiles.mjs'

const dir = path.join(process.cwd(), 'test', 'lib', '.testlib')
const nonExistDir = path.join(process.cwd(), '.nonexist')
const notADir = path.join(process.cwd(), 'test', 'lib', '.testlib', 'index.html')

const urls = ['/index.css', '/', '/index.js', '/sub/', '/sub/test/']
const files = [
  path.join(dir, 'index.css'),
  path.join(dir, 'index.html'),
  path.join(dir, 'index.js'),
  path.join(dir, 'sub', 'index.html'),
  path.join(dir, 'sub', 'test.html'),
]

export default [
  {
    fn: tryCatch(getFiles),
    expect: t => is.deep.eq([t.message, t.name], errors.STATE_EMPTY),
    info: 'getFiles without state errors with E_STATE_EMPTY',
  },
  {
    fn: tryCatch(getFiles, { files: [1, 2, 3] }),
    expect: is.deep.equal([1, 2, 3]),
    info: 'getFiles returns state.files if it got passed',
  },
  { fn: getFiles({ dir }), expect: is.array, info: 'getFiles returns an array' },
  {
    fn: getFiles({ dir, sri: 'sri' }),
    expect: f => is.len.eq(f, 5),
    info: 'getFiles returns array with expected length',
  },
  {
    fn: getFiles({ dir, sri: 'sri' }),
    expect: f =>
      is.deep.equal(
        f.map(f => f.url),
        urls,
      ),
    info: 'getFiles returns array with expected urls',
  },
  {
    fn: getFiles({ dir, sri: 'sri' }),
    expect: f =>
      is.deep.equal(
        f.map(f => f.file),
        files,
      ),
    info: 'getFiles returns array with expected urls',
  },
  {
    fn: tryCatch(getFiles, { dir: nonExistDir, sri: 'sri' }),
    expect: t => t.name === 'Error' && t.code === 'ENOENT',
    info: 'non existant dir errors with Error: ENOENT',
  },
  {
    fn: tryCatch(getFiles, { dir: notADir, sri: 'sri' }),
    expect: t => is.deep.eq([t.message, t.name], errors.NOT_A_DIR),
    info: 'file instead of directory errors with E_NOT_A_DIR',
  },
]
