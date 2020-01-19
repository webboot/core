import error from '@magic/error'
import is from '@magic/types'

const libName = '@webboot/core.lib.json'

export const parse = (thing, ...rest) => {
  try {
    return JSON.parse(thing, ...rest)
  } catch (e) {
    if (e.name === 'SyntaxError') {
      throw error(e.message, 'JSON_PARSE')
    }

    throw error(e)
  }
}

export const stringify = (...args) => JSON.stringify(...args)
