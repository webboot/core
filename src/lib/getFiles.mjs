import fs from '@magic/fs'
import is from '@magic/types'
import error from '@magic/error'

import crypto from '@webboot/crypto'

import { errorMessages } from '../errorMessages.mjs'

const libName = '@webboot/cli.lib.getFiles'

export const errors = errorMessages(libName)

export const getFiles = async (state = {}) => {
  if (is.empty(state)) {
    throw error(errors.STATE_EMPTY)
  }

  if (!is.empty(state.files)) {
    return state.files
  }

  const stat = await fs.stat(state.dir)

  if (!stat.isDirectory()) {
    throw error(errors.NOT_A_DIR)
  }

  const filePaths = await fs.getFiles(state.dir, true)

  const filePromises = filePaths
    .filter(file => !file.endsWith(state.sri))
    .map(async file => {
      const url = file
        .replace(state.dir, '')
        .replace('index.html', '')
        .replace('.html', '/')

      const content = await fs.readFile(file, 'utf8')

      const { hash, algorithm } = crypto.hash.create(content)

      return {
        algorithm,
        content,
        file,
        hash,
        url,
      }
    })

  return await Promise.all(filePromises)
}
