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
    throw error(errors.STATE_EMPTY)
  }

  if (!is.objectNative(state)) {
    throw error(errors.STATE_TYPE)
  }

  if (is.empty(state.dir)) {
    throw error(errors.STATE_DIR_EMPTY)
  }

  if (!is.string(state.dir)) {
    throw error(errors.STATE_DIR_TYPE)
  }

  const startTime = log.hrtime()

  state.files = await getFiles(state)

  log.timeTaken(startTime, `${libName} took:`)

  return state
}
