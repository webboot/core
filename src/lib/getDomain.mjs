import path from 'path'

import error from '@magic/error'
import fs from '@magic/fs'

import { errorMessages } from '../errorMessages.mjs'

const libName = '@webboot/core.lib.getDomain'

export const errors = errorMessages(libName)

export const getDomain = async state => {
  const cwd = process.cwd()

  if (state.domain) {
    return state.domain
  }

  const pkgPath = path.join(cwd, 'package.json')
  const pkgString = await fs.readFile(pkgPath)
  const pkg = JSON.parse(pkgString)

  if (!pkg.homepage) {
    throw error(errors.HOMEPAGE_EMPTY)
  }

  return pkg.homepage
}
