import { httpRequest } from './httpRequest.mjs'

export const getGitPgpKeys = async ({ username, host = 'github' }) => {
  const apiPath = '/'

  if (host.includes('github')) {
    host = 'https://api.github.com/users/'
  } else if (host.includes('gitlab')) {
    host = 'https://gitlab.com/api/v4/users/'

    // we need the user id instead of the name for gitlab api calls
    const userData = await httpRequest(`${host}?username=${username}`)
    username = userData.id
  } else {
    log.error('W_HOST_NOT_SUPPORTED', 'seems you input a custom git domain. support coming soon.')
    log('please open an issue to tell us about this.')
    process.exit(1)
  }

  try {
    const url = `${host}${username}/gpg_keys`
    const keys = await httpRequest(url)
    return JSON.parse(keys)
  } catch (e) {
    console.log('name', e.name, 'code', e.code)

    throw e
  }
}
