import log from '@magic/log'
import fs from '@magic/fs'

import crypto from '@webboot/crypto'

import { getFiles } from './lib/index.mjs'

export const verify = async state => {
  const startTime = log.hrtime()

  state.files = await getFiles(state)

  const sriHashString = await fs.readFile(state.sri, 'utf8')
  const sriHashes = JSON.parse(sriHashString)

  const mismatches = state.files
    .filter(file => {
      const invalid = !crypto.hash.check(file.content, file.hash)

      const sri = sriHashes[file.url]
      const algoHash = `${file.algorithm}-${file.hash}`

      const mismatch = sri !== algoHash

      return invalid || mismatch
    })
    .map(f => f.file)

  if (mismatches.length) {
    return error(`file hash mismatches: \n${mismatches.join('\n')}`, 'E_HASH_MISMATCH')
  }

  log.timeTaken(startTime, '@webboot/core verify took:')

  return state
}
