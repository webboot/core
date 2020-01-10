import log from '@magic/log'
import fs from '@magic/fs'

import { getFiles, createFileHash } from '../lib/index.mjs'

export const verify = async state => {
  const startTime = log.hrtime()

  state.files = await getFiles(state)

  const sriHashFile = path.join(state.dir, 'sri-hashes.json')
  const sriHashString = await fs.readFile(sriHashFile, 'utf8');
  const sriHashes = JSON.parse(sriHashString)

  const valid = state.files.map(file => {
    const hash = createFileHash(file)

    //const fileHash = sriHashes.first(a => )

    return hash === file.hash
  })

  log.timeTaken(startTime, '@webboot/core verify took:')

  return state
}
