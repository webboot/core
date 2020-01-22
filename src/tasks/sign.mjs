import log from '@magic/log'
import error from '@magic/error'
import is from '@magic/types'

import crypto from '@webboot/crypto'

import { exec, getEmail, getPgpKey } from '../lib/index.mjs'

import { errorMessages } from '../errorMessages.mjs'

const cwd = process.cwd()

const libName = '@webboot/core.tasks.sign'

export const errors = errorMessages(libName)

export const sign = async state => {
  const startTime = log.hrtime()

  if (is.empty(state)) {
    throw error(errors.STATE_EMPTY)
  }

  if (!is.objectNative(state)) {
    throw error(errors.STATE_TYPE)
  }

  if (is.empty(state.username)) {
    throw error(errors.STATE_USERNAME_EMPTY)
  }

  if (!is.string(state.username)) {
    throw error(errors.STATE_USERNAME_TYPE)
  }

  state.email = await getEmail(state)

  state.key = await getPgpKey(state)

  // nice to have:
  // get user passphrase interactively, launch a worker process for that.
  // only send the hash back to this process.
  if (is.empty(state.passphrase)) {
    throw error(error.STATE_PASSPHRASE_EMPTY)
  }

  if (!is.string(state.passphrase)) {
    throw error(error.STATE_PASSPHRASE_EMPTY)
  }

  // const hashed = crypto.hash.create(content)

  // const secret = `${passphrase} ${pubKeyContent.trim()} ${hashed.algorithm}-${hashed.hash}`

  // const keys = crypto.ecdh(secret)

  log.timeTaken(startTime, '@webboot/core sign took:')

  return state
}
