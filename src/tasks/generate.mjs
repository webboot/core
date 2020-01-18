import log from '@magic/log'
import is from '@magic/types'
import error from '@magic/error'

import crypto from '@webboot/crypto'

import { getFiles } from './lib/index.mjs'

const libName = '@webboot/core.tasks.generate'

export const generate = async state => {
  if (is.empty(state)) {
    throw error(`${libName} state can not be empty.`, 'E_ARG_EMPTY')
  }

  if (is.empty(state.files) && is.empty(state.dir)) {
    throw error(`${libName} state.dir OR state.files has to be set.`, 'E_ARG_MISSING')
  }

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

  log.timeTaken(startTime, `${libName} took:`)

  return state
}
