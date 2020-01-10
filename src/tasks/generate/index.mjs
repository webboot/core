import log from '@magic/log'
import is from '@magic/types'
import crypto from 'crypto'

import { getFiles, createFileHash } from '../lib/index.mjs'

export const generate = async state => {
  log.error('ENOTIMPLEMENTED', 'not implemented yet.')
  console.log('@webboot/core generate', state)

  const files = await getFiles(state)

  state.files = files.map(file => createFileHash({ file }))

  return state
}
