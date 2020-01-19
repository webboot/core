import path from 'path'

import error from '@magic/error'
import fs from '@magic/fs'
import log from '@magic/log'
import is from '@magic/types'

import crypto from '@webboot/crypto'

import { errorMessages } from '../errorMessages.mjs'

import { getFiles, json, threeWayVerifyFile } from '../lib/index.mjs'

const libName = '@webboot/core.tasks.verify'

export const errors = errorMessages(libName)

export const verify = async state => {
  const startTime = log.hrtime()

  if (is.empty(state)) {
    throw error(...errors.E_STATE_EMPTY)
  }

  if (is.empty(state.sri)) {
    throw error(...errors.E_STATE_SRI_EMPTY)
  }

  if (!is.string(state.sri)) {
    throw error(...errors.E_STATE_SRI_TYPE)
  }

  if (!path.isAbsolute(state.sri)) {
    state.sri = path.join(state.cwd, state.sri)
  }

  state.files = await getFiles(state)

  const sriHashString = await fs.readFile(state.sri, 'utf8')
  const sriHashes = json.parse(sriHashString)

  const mismatches = state.files
    .filter(file => !file.url.startsWith('sri-') && !file.url.endsWith('.json'))
    .filter(threeWayVerifyFile(sriHashes))
    .map(f => f.file)

  if (mismatches.length) {
    const mismatchString = mismatches.join('\n')
    throw error('file hash mismatches:\n' + mismatchString, 'E_HASH_MISMATCH')
  }

  log.timeTaken(startTime, '@webboot/core verify took:')

  return state
}
