import path from 'path'

import error from '@magic/error'
import fs from '@magic/fs'

import { errorMessages } from '../errorMessages.mjs'

const libName = '@webboot/cli.lib.getVersion'

export const errors = errorMessages(libName)

export const getVersion = async state => {
  if (state.version) {
    return state.version
  }

  const cwd = process.cwd()
  const pkgPath = path.join(cwd, 'package.json')
  const pkgString = await fs.readFile(pkgPath)
  const pkg = JSON.parse(pkgString)

  if (!pkg.version) {
    throw error(errors.PKG_VERSION_EMPTY)
  }

  return pkg.version
}
