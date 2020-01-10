import path from 'path'

import log from '@magic/log'
import fs from '@magic/fs'
import is from '@magic/types'

export const getFiles = async state => {
  if (!is.empty(state.files)) {
    return state.files
  }

  const filePaths = await fs.getFiles(state.dir)

  const files = await Promise.all(filePaths.map(async file => ({
    file,
    content: await fs.readFile(file, 'utf8'),
  })))

  return files
}
