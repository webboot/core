import path from 'path'

import error from '@magic/error'
import fs from '@magic/fs'
import log from '@magic/log'
import is from '@magic/types'

import crypto from '@webboot/crypto'

import { getFiles, json } from '../lib/index.mjs'

const libName = '@webboot/core.tasks.verify'

export const verifyFile = sriHashes => file => {
  const fileHash = crypto.hash.create(file.content)

  let argumentValid = true

  if (file.hash) {
    const { algorithm } = file
    argumentValid = crypto.hash.check(file.content, file.hash, { algorithm })
  }

  const valid = crypto.hash.check(file.content, fileHash.hash)

  const sri = sriHashes[file.url]
  const algoHash = `${file.algorithm}-${file.hash}`

  const mismatch = sri !== algoHash

  return !valid || !argumentValid || mismatch
}

export const verify = async state => {
  const startTime = log.hrtime()

  if (is.empty(state)) {
    throw error(`${libName} state can not be empty.`, 'E_STATE_EMPTY')
  }

  if (!is.string(state.sri)) {
    throw error(`${libName} expects state.sri to be set.`, 'E_STATE_KEY_MISSING')
  }

  if (!path.isAbsolute(state.sri)) {
    state.sri = path.join(state.cwd, state.sri)
  }

  state.files = await getFiles(state)

  const sriHashString = await fs.readFile(state.sri, 'utf8')
  const sriHashes = json.parse(sriHashString)

  const mismatches = state.files
    .filter(file => !file.url.startsWith('sri-') && !file.url.endsWith('.json'))
    .filter(verifyFile(sriHashes))
    .map(f => f.file)

  if (mismatches.length) {
    const mismatchString = mismatches.join('\n')
    throw error('file hash mismatches:\n' + mismatchString, 'E_HASH_MISMATCH')
  }

  log.timeTaken(startTime, '@webboot/core verify took:')

  return state
}
