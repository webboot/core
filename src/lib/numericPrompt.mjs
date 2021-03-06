import cli from '@magic/cli'
import is from '@magic/types'
import log from '@magic/log'

import error from '@magic/error'
import { errorMessages } from '../errorMessages.mjs'
const libName = '@webboot/core.lib.numericPrompt'
export const errors = errorMessages(libName)

const defaultItemLoop = (item, i) => {
  log.warn(i + 1, ' - ', item)
}

export const numericPrompt = async (args = {}) => {
  if (is.empty(args.items)) {
    throw error(errors.NUMERIC_PROMPT_NO_ITEMS)
  }

  const max = args.items.length

  const {
    firstRun = true,
    msg = '',
    itemLoop = defaultItemLoop,
    items = [],
    question = `Please enter a number between 1 and ${max}:`,
  } = args

  if (firstRun) {
    if (msg) {
      log(msg)
    }

    items.forEach(itemLoop)
  }

  const keyIdAnswer = await cli.prompt(question)

  const keyId = parseInt(keyIdAnswer)

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
