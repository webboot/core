import path from 'path'

import { fs, is, tryCatch } from '@magic/test'

import { generate } from '../../src/tasks/generate.mjs'

const testFiles = [{ content: 'testing_1' }, { content: 'testing_2' }]

const expectedHashes = [
  'EQTzjL8WjrwwI/O5qT8KGAPNdbzDJPv6Ip5nlvO12pF5Hx+CyrdScRUbwMr9cFb6',
  'cPJvccnz99s+Ve07OQj4wGsQDwQV0xBKJhuVwaGBWkWaqaBcx11jcrL6iklEIEJB',
]

const testDir = path.join(process.cwd(), '.__test__')

const before = async id => {
  await fs.mkdirp(testDir + id)

  await Promise.all(
    testFiles.map(async (f, i) => await fs.writeFile(path.join(testDir + id, 'file_' + (i + 1)), f)),
  )

  return async () => {
    await fs.rmrf(testDir + id)
  }
}

export default [
  {
    fn: tryCatch(generate),
    expect: t => t.name === 'E_ARG_EMPTY',
    info: 'calling generate without an argument throws E_ARG_EMPTY',
  },
  {
    fn: tryCatch(generate, ''),
    expect: t => t.name === 'E_ARG_EMPTY',
    info: 'calling generate with empty argument throws E_ARG_EMPTY',
  },
  {
    fn: generate({ files: testFiles }),
    expect: t => is.array(t.files) && is.len.eq(t.files, 2),
    info: 'calling generate with empty argument throws E_ARG_EMPTY',
  },
  {
    fn: generate({ files: testFiles }),
    expect: t =>
      is.deep.eq(
        expectedHashes,
        t.files.map(f => f.hash),
      ),
    info: 'calling generate with state.files set returns a list of those files',
  },
  {
    fn: tryCatch(generate, { unused: true }),
    expect: t => t.code === 'E_ARG_MISSING',
    info: 'generate without .dir and .files returns E_ARG_MISSING'
  },
  {
    fn: async () => await generate({ dir: testDir + 1 }),
    expect: t => t.dir === testDir + 1,
    before: before(1),
    info: 'generate can work with a dir and without files, returns same dir as .dir'
  },
  {
    fn: async () => await generate({ dir: testDir + 2 }),
    expect: t => is.length.eq(t.files, 2),
    before: before(2),
    info: 'generate can work with a dir and without files, returns correct number of files'
  },
]
