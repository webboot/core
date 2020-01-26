import path from 'path'

import error from '@magic/error'
import fs from '@magic/fs'
import log from '@magic/log'
import is from '@magic/types'

import crypto from '@webboot/crypto'

import { errorMessages } from '../errorMessages.mjs'

import { getFiles, json, maybeThrow, threeWayVerifyFile } from '../lib/index.mjs'

const libName = '@webboot/core.tasks.verify'

export const errors = errorMessages(libName)

export const verify = async state => {
  const startTime = log.hrtime()

  if (is.empty(state)) {
    throw error(errors.STATE_EMPTY)
  }
  if (!is.objectNative(state)) {
    throw error(errors.STATE_TYPE)
  }
  if (is.empty(state.sri)) {
    throw error(errors.STATE_SRI_EMPTY)
  }
  if (!is.string(state.sri)) {
    throw error(errors.STATE_SRI_TYPE)
  }
  if (is.empty(state.dir)) {
    throw error(errors.STATE_DIR_EMPTY)
  }
  if (!is.string(state.dir)) {
    throw error(errors.STATE_DIR_TYPE)
  }

  if (!path.isAbsolute(state.sri)) {
    state.sri = path.join(state.cwd, state.sri)
  }

  if (!path.isAbsolute(state.dir)) {
    state.dir = path.join(state.cwd, state.dir)
  }

  state.files = await getFiles(state)

  const sriHashString = await fs.readFile(state.sri, 'utf8')
  const sriHashes = json.parse(sriHashString)

  const mismatches = state.files
    .filter(file => file.url === '/file.txt')
    .filter(threeWayVerifyFile(sriHashes))
    .map(f => f.file)

  if (mismatches.length) {
    const mismatchString = mismatches.join('\n')
    throw error(errors.HASH_MISMATCH(mismatchString))
  }

  log.timeTaken(startTime, '@webboot/core verify took:')

  return state
}
