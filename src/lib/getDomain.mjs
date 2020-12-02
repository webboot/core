import path from 'path'

import error from '@magic/error'
import fs from '@magic/fs'
import log from '@magic/log'

import { errorMessages } from '../errorMessages.mjs'

const libName = '@webboot/core.lib.getDomain'

export const errors = errorMessages(libName)

export const getDomain = async state => {
  if (state.domain) {
    return state.domain
  }

  const cwd = process.cwd()
  const cnamePath = path.join(state.dir, 'CNAME')

  try {
    const cnameContent = await fs.readFile(cnamePath, 'utf8')
    if (!cnameContent.length || !cnameContent.includes('.')) {
      throw error(`${libName} ${cnamePath} does not contain a valid HOSTNAME.`, 'E_HOSTNAME_TYPE')
    }

    return cnameContent.trim()
  } catch (e) {
    if (e.code === 'ENOENT') {
      log.info(`${cnamePath} is not defined.`)
      log.info('instead looking in package.json to get page domain.')
    } else {
      throw e
    }
  }

  const pkgPath = path.join(cwd, 'package.json')
  const pkgString = await fs.readFile(pkgPath)
  const pkg = JSON.parse(pkgString)

  if (!pkg.homepage) {
    throw error(errors.PKG_HOMEPAGE_EMPTY)
  }

  return pkg.homepage
}
