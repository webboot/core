import path from 'path'

import { fs, is, tryCatch } from '@magic/test'

import { errorMessages } from '../../src/errorMessages.mjs'

import { clean, libName } from '../../src/tasks/clean.mjs'

const testDir = path.join(process.cwd(), '.__test__clean__')

const sriFileName = 'sri-hashes.json'

const sriFullPath = path.join(testDir, sriFileName)

const errors = errorMessages(libName)

const before = id => async () => {
  let dir = testDir + id

  await fs.mkdirp(dir)

  const sri = path.join(dir, sriFileName)
  const w = await fs.writeFile(sri, 'ohai')

  return async () => {
    await fs.rmrf(dir)
  }
}

const tryDelete = async p => {
  const existsBefore = await fs.exists(p)

  const deleted = await clean({ sri: p })

  const existsAfter = await fs.exists(p)

  return existsBefore && deleted && !existsAfter
}

export default [
  {
    fn: async () => await tryDelete(path.join(testDir + 1, sriFileName)),
    before: before(1),
    expect: true,
    info: 'clean successfully deletes file with absolute path',
  },
  {
    fn: tryCatch(tryDelete, path.join(testDir + 2, sriFileName)),
    before: before(2),
    expect: true,
    info: 'clean errors on file with relative path',
  },
  {
    fn: tryCatch(clean, { sri: '../../../../tsgksgeosgosk.gsogeks' }),
    expect: is.error,
    info: 'setting the sri hash to somewhere outside of process.cwd throws',
  },
  {
    fn: tryCatch(clean, { sri: '../../../../tsgksgeosgosk.gsogeks' }),
    expect: t => t.name === 'ENOENT',
    info: 'setting the sri hash file name to somewhere outside of process.cwd throws ENOENT',
  },
  {
    fn: tryCatch(clean, { sri: './ts/gks/geo/sgosk/gsogeks' }),
    expect: t => t.name === 'ENOENT',
    info: 'setting the sri hash to somewhere outside of process.',
  },
  {
    fn: tryCatch(clean, { sri: './ts/gks/geo/sgosk/gsogeks' }),
    expect: t => t.name === 'ENOENT',
    info: 'setting the sri hash to somewhere outside of process.',
  },
  {
    fn: tryCatch(clean),
    expect: t => is.deep.eq([t.message, t.name], errors.E_STATE_EMPTY),
    info: 'empty arguments throw E_STATE_EMPTY',
  },
  {
    fn: tryCatch(clean, { sri: '' }),
    expect: t => is.deep.eq([t.message, t.name], errors.E_STATE_SRI_EMPTY),
    info: 'empty sri errors with E_STATE_SRI_EMPTY.',
  },
  {
    fn: tryCatch(clean, { sri: 23 }),
    expect: t => is.deep.eq([t.message, t.name], errors.E_STATE_SRI_TYPE),
    info: 'empty sri errors with E_STATE_SRI_TYPE.',
  },
]
