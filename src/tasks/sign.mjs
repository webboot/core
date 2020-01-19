import path from 'path'

import log from '@magic/log'
import fs from '@magic/fs'
import error from '@magic/error'

import crypto from '@webboot/crypto'

const cwd = process.cwd()

const libName = '@webboot/core.tasks.sign'

export const sign = async state => {
  const startTime = log.hrtime()

  const { pass } = state
  const pubKeyFile = {
    path: state.key,
  }

  if (!pubKeyFilepath) {
    return error('--key is required', 'EKEYREQ')
  }

  if (!pass) {
    return error('--passphrase is required', 'EPASSREQ')
  }

  if (!path.isAbsolute(pubKeyFilepath)) {
    pubKeyFilepath = path.join(cwd, pubKeyFilepath)
  }

  if (!pubKeyFilepath.endsWith('.pub')) {
    const pubExists = await fs.exists(`${pubKeyFilepath}.pub`)
    if (pubExists) {
      log.warn('W_PRIV_KEY', [
        '${libName}: ${pubKeyFilepath} seems to point to a private key file.',
        'To make sure @webboot never reads a private key file by accident,',
        'we will instead read ${pubKeyFilepath}.pub',
        'If this results in an error, please file an issue with your use case.',
        'https://github.com/webboot/core/',
      ])

      pubKeyFilepath = `${pubKeyFilepath}.pub`
    }
  }

  const content = await fs.readFile(pubKeyFilepath, 'utf8')

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
