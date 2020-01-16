import fs from '@magic/fs'
import error from '@magic/error'
import is from '@magic/types'

const libName = '@weboot/core.tasks.clean'

export const clean = async state => {
  if (is.empty(state)) {
    throw error(`${libName} expects argument to be an object`, 'E_ARG_EMPTY')
  }

  if (is.empty(state.sri)) {
    throw error(`${libName} expects state.sri to be non-empty`, 'E_ARG_EMPTY')
  }

  if (!is.string(state.sri)) {
    throw error(`${libName} expects state.sri to be a string`, 'E_ARG_TYPE')
  }

  return await fs.rmrf(state.sri)
}
