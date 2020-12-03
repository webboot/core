import log from '@magic/log'

import crypto from '@webboot/crypto'

import { getGitPgpKeys } from './getGitPgpKeys.mjs'
import { numericPrompt } from './numericPrompt.mjs'

// import { errorMessages } from '../errorMessages.mjs'
// const libName = '@webboot/core.lib.getPgpKey'
// export const errors = errorMessages(libName)

export const getPgpKey = async (state = {}) => {
  // get users keys from github/gitlab
  const remoteGitPgpKeys = await getGitPgpKeys(state)

  let foundKeys = []
  await Promise.all(
    remoteGitPgpKeys.map(async ({ key_id }) => {
      const keys = await crypto.gpg(`--list-keys ${key_id}`, { parse: true })
      foundKeys = [...foundKeys, ...Object.values(keys)]
    }),
  )

  let key = foundKeys[0]

  if (foundKeys.length > 1) {
    const itemLoop = (key, i) => {
      const { name, email } = key.users[0]
      log.warn(i + 1, ` - ${key.key} - ${name} - ${email}`)
    }

    key = await numericPrompt({ items: foundKeys, itemLoop, msg: 'Found more than 1 gpg key' })
  }

  return key
}
