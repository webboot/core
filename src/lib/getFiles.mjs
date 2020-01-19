import fs from '@magic/fs'
import is from '@magic/types'
import error from '@magic/error'

import crypto from '@webboot/crypto'

const libName = '@webboot/core.lib.getFiles'

export const getFiles = async (state = {}) => {
  if (is.empty(state)) {
    throw error(`${libName} state can not be empty`, 'E_STATE_EMPTY')
  }

  if (!is.empty(state.files)) {
    return state.files
  }

  const stat = await fs.stat(state.dir)

  if (!stat.isDirectory()) {
    throw error(`${libName} expects a directory, not a file`, 'E_NOT_A_DIR')
  }

  const filePaths = await fs.getFiles(state.dir, true)

  const filePromises = filePaths
    .filter(file => !file.endsWith(state.sri))
    .map(async file => {
      let url = file
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
