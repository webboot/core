import path from 'path'

import log from '@magic/log'
import fs from '@magic/fs'
import error from '@magic/error'
import is from '@magic/types'

import crypto from '@webboot/crypto'

import { errorMessages } from '../errorMessages.mjs'

const cwd = process.cwd()

const libName = '@webboot/core.tasks.sign'

export const errors = errorMessages(libName)

export const sign = async state => {
  const startTime = log.hrtime()

  if (is.empty(state)) {
    throw error(...errors.E_STATE_EMPTY)
  }

  if (!is.objectNative(state)) {
    throw error(errors.E_STATE_TYPE)
  }

  const { pass } = state
  const pubKeyFile = {
    path: state.publicKey,
  }

  if (is.empty(pubKeyFile.path)) {
    throw error(errors.E_STATE_PUB_KEY_EMPTY)
  }

  if (!is.string(pubKeyFile.path)) {
    throw error(errors.E_STATE_PUB_KEY_TYPE)
  }

  if (!path.isAbsolute(pubKeyFile.path)) {
    pubKeyFile.path = path.join(cwd, pubKeyFile.path)
  }

  if (is.empty(pass)) {
    throw error(errors.E_STATE_PASSPHRASE_EMPTY)
  }

  if (!is.string(pass)) {
    throw error(errors.E_STATE_PASSPHRASE_TYPE)
  }

  if (!pubKeyFile.path.endsWith('.pub')) {
    const pubExists = await fs.exists(`${pubKeyFile.path}.pub`)
    if (pubExists) {
      log.warn('W_PRIV_KEY', [
        '${libName}: ${pubKeyFile.path} seems to point to a private key file.',
        'To make sure @webboot never reads a private key file by accident,',
        'we will instead read ${pubKeyFile.path}.pub',
        'If this results in an error, please file an issue with your use case.',
        'https://github.com/webboot/core/',
      ])

      pubKeyFile.path = `${pubKeyFile.path}.pub`
    }
  }

  const content = await fs.readFile(pubKeyFile.path, 'utf8')

  if (content.includes('PRIVATE KEY')) {
    // clean content variable to remove private key. at least try to, it's node.
    content = ''

    return error('--key was passed a private key file path. please do not do that.', 'E_PRIV_KEY')
  }

  const hashed = crypto.hash.create(content)

  const secret = `${pass} ${content.trim()} ${hashed.algorithm}-${hashed.hash}`

  const keys = crypto.ecdh(secret)
  console.log({ keys })

  log.timeTaken(startTime, '@webboot/core sign took:')

  return state
}
