export const errorMessages = libName => ({
  E_STATE_EMPTY: [`${libName} state must be non-empty.`, 'STATE_EMPTY'],
  E_STATE_TYPE: [`${libName} state must be an object.`, 'STATE_TYPE'],

  E_STATE_SRI_EMPTY: [`${libName} state.sri must be non-empty.`, 'STATE_SRI_EMPTY'],
  E_STATE_SRI_TYPE: [`${libName} state.sri must be a string.`, 'STATE_SRI_TYPE'],

  E_STATE_DIR_EMPTY: [`${libName} state.dir must be non-empty.`, 'STATE_DIR_EMPTY'],
  E_STATE_DIR_TYPE: [`${libName} state.dir must be a string.`, 'STATE_DIR_TYPE'],

  E_NOT_A_DIR: [`${libName} expects a directory.`, 'NOT_A_DIR'],

  E_STATE_PUB_KEY_EMPTY: ['${libName} state.pubKey must be non-empty.', 'STATE_PUB_KEY_EMPTY'],
  E_STATE_PUB_KEY_TYPE: ['${libName} state.pubKey must be a string.', 'STATE_PUB_KEY_TYPE'],

  E_PUB_KEY_FILE_ENOENT: [
    '${libName} state.pubKey does not point to an existing file.',
    'PUB_KEY_FILE_ENOENT',
  ],

  E_STATE_PASSPHRASE_EMPTY: [
    '${libName} state.passphrase must be non-empty.',
    'STATE_PASSPHRASE_EMPTY',
  ],
  E_STATE_PASSPHRASE_TYPE: [
    '${libName} state.passphrase must be a string.',
    'STATE_PASSPHRASE_TYPE',
  ],

  E_PUB_IS_PRIV_KEY: ['state.publicKey is a private key file. do not do that again please.', 'E_PUB_IS_PRIV_KEY'],
  E_PUB_NOT_A_KEY: ['state.publicKey is not a public key file.', 'E_PUB_NOT_A_KEY'],
})
