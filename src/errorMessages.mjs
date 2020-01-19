export const errorMessages = libName => ({
  E_STATE_EMPTY: [`${libName} expects state argument to be an object`, 'STATE_EMPTY'],

  E_STATE_SRI_EMPTY: [`${libName} expects state.sri to be non-empty`, 'STATE_SRI_EMPTY'],
  E_STATE_SRI_TYPE: [`${libName} expects state.sri to be a string`, 'STATE_SRI_TYPE'],

  E_STATE_DIR_MISSING: [`${libName} state.dir has to be set.`, 'E_STATE_DIR_MISSING'],
  E_STATE_DIR_TYPE: [`${libName} state.dir has to be set.`, 'E_STATE_DIR_TYPE'],

  E_NOT_A_DIR: [`${libName} expects a directory.`, 'E_NOT_A_DIR'],
})
