import cli from '@magic/cli'
import is from '@magic/types'

import error from '@magic/error'
import { errorMessages } from '../errorMessages.mjs'
const libName = '@webboot/core.lib.numericPrompt'
export const errors = errorMessages(libName)

export const numericPrompt = async (args = {}) => {
  const { items = [], msg = '', firstRun = true } = args
  const max = items.length

  if (!max) {
    throw error(errors.NUMERIC_PROMPT_NO_ITEMS)
  }

  if (firstRun) {
    if (msg) {
      log(msg)
    }

    items.forEach((item, i) => {
      log.warn(i + 1, ' - ', item)
    })
  }

  const question = `Please enter a number between 1 and ${max}:`
  const keyId = await cli.prompt(question)

  keyId = parseInt(keyId)

  const notANum = !is.number(keyId)
  const tooSmall = keyId < 1
  const tooBig = keyId > max

  if (notANum || tooSmall || tooBig) {
    if (notAnum) {
      log.warn('Not a number', keyId, msg)
    } else if (tooSmall) {
      log.warn('Number too small', keyId, msg)
    } else if (tooBig) {
      log.warn('Number too big', keyId, msg)
    }

    return await numericPrompt({ items, msg, firstRun: false })
  }

  return items[keyId - 1]
}
