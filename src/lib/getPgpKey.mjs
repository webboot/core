import is from '@magic/types'
import error from '@magic/error'
import crypto from '@webboot/crypto'

import { errorMessages } from '../errorMessages.mjs'
import { prompt } from './prompt.mjs'
import { getGitPgpKeys } from './getGitPgpKeys.mjs'

const libName = '@webboot/core.lib.getPgpKey'

export const errors = errorMessages(libName)

export const getPgpKey = async (state = {}) => {
  // get users keys from https://api.github.com/users/:username/gpg_keys
  const remoteGitPgpKeys = await getGitPgpKeys(state)

  if (is.error(remoteGitPgpKeys)) {
    throw remoteGitPgpKeys
  }

  let foundKeys = []
  await Promise.all(
    remoteGitPgpKeys.map(async ({ key_id }) => {
      const keys = await crypto.gpg(`--list-keys ${key_id}`, { parse: true })
      foundKeys = [...foundKeys, ...Object.values(keys)]
    }),
  )

  if (foundKeys.length > 1) {
    log.warn('W_MORE_THAN_1_GPG_KEY', 'found more than 1 key.')
    log('using the first found key for now, TODO: implement a selection.')
    log('please select the key you want to use:')

    foundKeys.forEach((key, i) => {
      log(`${i + 1} - ${key.key}`)
    })

    // TODO: prompt for 1-x here
    const keyId = await prompt({ msg: 'Please select a number:' })
    const key = keyId - 1
  }

  return foundKeys[0]
}
