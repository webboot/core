import is from '@magic/types'

import cli from '@magic/cli'

export const numericPrompt = async (max = 10) => {
  const msg = `Please enter a number between 1 and ${max}:`
  const keyId = await cli.prompt(msg)

  keyId = parseInt(keyId)

  const notANum = !is.number(keyId)
  const tooSmall = keyId < 1
  const tooBig = keyId > max

  if (notANum || tooSmall || tooBig) {
    if (notAnum) {
      log.warn('Not a number', msg)
    } else if (tooSmall) {
      log.warn('Number too small', msg)
    } else if (tooBig) {
      log.warn('Number too big', msg)
    }

    return await numericPrompt(k)
  }

  return keyId - 1
}
