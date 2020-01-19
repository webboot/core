import path from 'path'

import { fs, is, tryCatch } from '@magic/test'

import { generate, errors } from '../../src/tasks/generate.mjs'

const testFiles = [{ content: 'testing_1' }, { content: 'testing_2' }]

const expectedHashes = [
  'EQTzjL8WjrwwI/O5qT8KGAPNdbzDJPv6Ip5nlvO12pF5Hx+CyrdScRUbwMr9cFb6',
  'cPJvccnz99s+Ve07OQj4wGsQDwQV0xBKJhuVwaGBWkWaqaBcx11jcrL6iklEIEJB',
]

const testDir = path.join(process.cwd(), '.__test__generate__')

const before = id => async () => {
  const dir = testDir + id
  await fs.mkdirp(dir)

  await Promise.all(
    testFiles.map(async (f, i) => await fs.writeFile(path.join(dir, 'file_' + (i + 1)), f)),
  )

  return async () => {
    await fs.rmrf(dir)
  }
}

export default [
  {
    fn: tryCatch(generate),
    expect: t => is.deep.eq([t.message, t.name], errors.E_STATE_EMPTY),
    info: 'calling generate without an argument throws E_STATE_EMPTY',
  },
  {
    fn: tryCatch(generate, ''),
    expect: t => is.deep.eq([t.message, t.name], errors.E_STATE_EMPTY),
    info: 'calling generate with empty argument throws E_STATE_EMPTY',
  },
  {
    fn: tryCatch(generate, { unused: true }),
    expect: t => is.deep.eq([t.message, t.code], errors.E_STATE_DIR_MISSING),
    info: 'generate without .dir returns E_STATE_DIR_MISSING',
  },
  {
    fn: async () => await generate({ dir: testDir + 1 }),
    expect: t => t.dir === testDir + 1,
    before: before(1),
    info: 'generate can work with a dir and without files, returns same dir as .dir',
  },
  {
    fn: async () => await generate({ dir: testDir + 2 }),
    expect: t => is.length.eq(t.files, 2),
    before: before(2),
    info: 'generate can work with a dir and without files, returns correct number of files',
  },
]
