import log from '@magic/log'
import is from '@magic/types'
import error from '@magic/error'

import crypto from '@webboot/crypto'

import { errorMessages } from '../errorMessages.mjs'

import { getFiles } from '../lib/index.mjs'

const libName = '@webboot/core.tasks.generate'

export const errors = errorMessages(libName)

export const generate = async state => {
  if (is.empty(state)) {
    throw error(...errors.E_STATE_EMPTY)
  }

  if (is.empty(state.dir)) {
    throw error(...errors.E_STATE_DIR_MISSING)
  }

  const startTime = log.hrtime()

  state.files = await getFiles(state)

  log.timeTaken(startTime, `${libName} took:`)

  return state
}
