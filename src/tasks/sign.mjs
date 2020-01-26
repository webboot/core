import path from 'path'

import log from '@magic/log'
import error from '@magic/error'
import fs from '@magic/fs'
import is from '@magic/types'

import crypto from '@webboot/crypto'

import { exec, getDomain, getEmail, getPgpKey } from '../lib/index.mjs'

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

  if (is.empty(state.sri)) {
    throw error(errors.STATE_SRI_EMPTY)
  }

  if (!is.string(state.sri)) {
    throw error(errors.STATE_SRI_TYPE)
  }

  state.email = await getEmail(state)

  state.key = await getPgpKey(state)

  state.domain = await getDomain(state)

  const sriHashString = await fs.readFile(state.sri, 'utf8')
  const sriHashes = JSON.parse(sriHashString)

  const signed = {
    username: state.username,
    key: state.key.key,
    domain: state.domain,
  }

  const webbootAsc = path.join(process.cwd(), 'node_modules', '@webboot', 'keys', 'src', 'webboot.asc')

  const sig = await crypto.gpg(`--clear-sign --armor -o- ${webbootAsc}`)
  signed.sig = sig

  console.log('signed', signed)

  const keys = crypto.ecdh(sig)

  console.log({ keys })

  log.timeTaken(startTime, '@webboot/core sign took:')

  return state
}
