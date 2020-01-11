import log from '@magic/log'

import { getFiles, fileHash } from './lib/index.mjs'

export const generate = async state => {
  const startTime = log.hrtime()

  const files = await getFiles(state)

  state.files = files.map(file => fileHash.create(file))

  log.timeTaken(startTime, '@webboot/core generate took:')

  return state
}
