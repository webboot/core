import error from '@magic/error'

import { httpRequest } from './httpRequest.mjs'

import { errorMessages } from '../errorMessages.mjs'
const libName = '@webboot/core.lib.getGitPgpKeys'
export const errors = errorMessages(libName)

export const getGitPgpKeys = async state => {
  const { username, host = 'github.com' } = state

  let url = host

  if (host.includes('github.com')) {
    url = 'https://api.github.com/users/'
  } else if (host.includes('gitlab.com')) {
    url = 'https://gitlab.com/api/v4/users/'

    // we need the user id instead of the name for gitlab api calls
    const userData = await httpRequest(`${host}?username=${username}`)
    username = userData.id
  } else {
    throw error(errors.GIT_HOST_NOT_SUPPORTED)
  }

  if (!url.endsWith('/')) {
    url += '/'
  }

  try {
    const gpgKeyUrl = `${url}${username}/gpg_keys`
    const keys = await httpRequest(gpgKeyUrl)
    return JSON.parse(keys)
  } catch (e) {
    throw e
  }
}
