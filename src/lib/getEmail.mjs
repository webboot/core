import is from '@magic/types'
import error from '@magic/error'

import { errorMessages } from '../errorMessages.mjs'
import { exec } from './exec.mjs'

const libName = '@webboot/core.lib.getEmail'

export const errors = errorMessages(libName)

export const getEmail = async (state = {}) => {
  let { email } = state

  // get user email from git config user.email
  if (is.empty(email)) {
    email = await exec('git config user.email')
  }

  if (is.error(email)) {
    throw email
  }

  if (is.empty(email)) {
    throw error(errors.STATE_EMAIL_EMPTY)
  }

  if (is.empty(email) || !is.string(email) || !email.includes('.') || !email.includes('@')) {
    throw error(errors.STATE_EMAIL_TYPE)
  }

  state.email = email

  return state
}
