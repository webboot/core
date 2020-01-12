import log from '@magic/log'

import crypto from '@webboot/crypto'

import { getFiles } from './lib/index.mjs'

export const generate = async state => {
  const startTime = log.hrtime()

  const files = await getFiles(state)

  state.files = files.map(file => {
    const { hash, algorithm } = crypto.hash.create(file.content)

    return {
      ...file,
      hash,
      algorithm,
    }
  })

  log.timeTaken(startTime, '@webboot/core generate took:')

  return state
}
