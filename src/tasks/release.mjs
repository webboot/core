import log from '@magic/log'

const libName = `@webboot/core.tasks.release`

export const release = async state => {
  if (is.empty(state)) {
    throw error(errors.STATE_EMPTY)
  }

  if (!is.objectNative(state)) {
    throw error(errors.STATE_TYPE)
  }

  log.error('E_NOT_IMPLEMENTED', `${libName} not implemented yet.`)

  // url    - url of the homepage
  // hashes - list of files and hashes for each file
  // git    - git repository url git@git(hub|lab).com/username/repository
  // user   - later, optional, online identifier of the public key.

  return state
}
