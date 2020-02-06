import error from '@magic/error'
import is from '@magic/types'

import { errorMessages } from '../errorMessages.mjs'

const libName = '@webboot/cli.lib.json'

export const errors = errorMessages(libName)

export const parse = (thing, ...rest) => {
  try {
    return JSON.parse(thing, ...rest)
  } catch (e) {
    if (e.name === 'SyntaxError') {
      e = errors.JSON_PARSE(e.message)
    }

    throw error(e)
  }
}

export const stringify = (...args) => JSON.stringify(...args)
