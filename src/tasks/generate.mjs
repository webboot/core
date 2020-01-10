import log from '@magic/log'

import { getFiles, createFileHash } from './lib/index.mjs'

export const generate = async state => {
  const startTime = log.hrtime()

  const files = await getFiles(state)

  state.files = files.map(file => createFileHash(file))

  log.timeTaken(startTime, '@webboot/core generate took:')

  return state
}
