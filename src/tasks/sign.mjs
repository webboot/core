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
  const file = {
    path: state.key,
  }

  if (!file.path) {
    return error('--key is required', 'EKEYREQ')
  }

  if (!pass) {
    return error('--passphrase is required', 'EPASSREQ')
  }

  if (!path.isAbsolute(file.path)) {
    file.path = path.join(cwd, file.path)
  }

  if (!file.path.endsWith('.pub')) {
    const pubExists = await fs.exists(`${file.path}.pub`)
    if (pubExists) {
      log.warn('W_PRIV_KEY', [
        '${libName}: ${file.path} seems to point to a private key file.',
        'To make sure @webboot never reads a private key file by accident,',
        'we will instead read ${file.path}.pub',
        'If this results in an error, please file an issue with your use case.',
        'https://github.com/webboot/core/',
      ])

      file.path = `${file.path}.pub`
    }
  }

  const content = await fs.readFile(file.path, 'utf8')

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
