import fs from '@magic/fs'
import error from '@magic/error'
import is from '@magic/types'

import { errorMessages } from '../errorMessages.mjs'

const libName = '@webboot/core.tasks.clean'

export const errors = errorMessages(libName)

export const clean = async state => {
  if (is.empty(state)) {
    throw error(...errors.E_STATE_EMPTY)
  }

  if (!is.objectNative(state)) {
    throw error(errors.E_STATE_TYPE)
  }

  if (is.empty(state.sri)) {
    throw error(...errors.E_STATE_SRI_EMPTY)
  }

  if (!is.string(state.sri)) {
    throw error(...errors.E_STATE_SRI_TYPE)
  }

  return await fs.rmrf(state.sri)
}
