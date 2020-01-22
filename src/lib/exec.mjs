import child_process from 'child_process'

import error from '@magic/error'

import { errorMessages } from '../errorMessages.mjs'

const libName = '@webboot/core.lib.exec'

const errors = errorMessages(libName)

export const exec = (cmd, options = {}) =>
  new Promise((resolve, reject) => {
    child_process.exec(cmd, options, (err, stdout, stderr) => {
      if (err) {
        const msg = `${libName}: ${cmd} error: ${err.message}`
        const e = error(errors.EXEC_ERR(msg))
        reject(e)
        return
      }

      if (stderr) {
        const err = error(errors.EXEC_ERR(`${libName}: ${cmd} error: ${stderr}`))
        reject(err)
        return
      }

      resolve(stdout.trim())
    })
  })
