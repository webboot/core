import log from '@magic/log'
import fs from '@magic/fs'

import { getFiles, fileHash } from './lib/index.mjs'

export const verify = async state => {
  const startTime = log.hrtime()

  state.files = await getFiles(state)

  const sriHashString = await fs.readFile(state.sri, 'utf8')
  const sriHashes = JSON.parse(sriHashString)

  state.files.map(fileHash.check(sriHashes))

  log.timeTaken(startTime, '@webboot/core verify took:')

  return state
}
