import error from '@magic/error'
import is from '@magic/types'

export const mapMessageToError = ([name, msg]) => [name, is.fn(msg) ? msg : [msg, name]]

export const errorMessages = libName =>
  Object.fromEntries(
    [
      ['STATE_EMPTY', `${libName} state must be non-empty.`],
      ['STATE_TYPE', `${libName} state must be an object.`],

      ['STATE_SRI_EMPTY', `${libName} state.sri must be non-empty.`],
      ['STATE_SRI_TYPE', `${libName} state.sri must be a string.`],

      ['STATE_DIR_EMPTY', `${libName} state.dir must be non-empty.`],
      ['STATE_DIR_TYPE', `${libName} state.dir must be a string.`],

      ['NOT_A_DIR', `${libName} expects a directory.`],

      ['STATE_PUB_KEY_EMPTY', `${libName} state.pubKey must be non-empty.`],
      ['STATE_PUB_KEY_TYPE', `${libName} state.pubKey must be a string.`],

      ['PUB_KEY_FILE_ENOENT', `${libName} state.pubKey does not point to an existing file.`],

      ['STATE_PASSPHRASE_EMPTY', `${libName} state.passphrase must be non-empty.`],
      ['STATE_PASSPHRASE_TYPE', `${libName} state.passphrase must be a string.`],

      ['PUB_IS_PRIV_KEY', `${libName} state.publicKey is a private key file. do not do that.`],
      ['PUB_NOT_A_KEY', `${libName} state.publicKey is not a public key file.`],

      ['HTTP_URL_EMPTY', `${libName} url (1st fn arg) can not be empty.`],
      ['HTTP_URL_TYPE', `${libName} url (1st fn arg) can not be empty.`],

      ['HASH_MISMATCH', arg => [`file hash mismatches:\n${arg}`, 'HASH_MISMATCH']],
    ].map(mapMessageToError),
  )
