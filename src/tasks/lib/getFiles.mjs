import path from 'path'

import log from '@magic/log'
import fs from '@magic/fs'
import is from '@magic/types'

export const getFiles = async state => {
  if (!is.empty(state.files)) {
    return state.files
  }

  const filePaths = await fs.getFiles(state.dir)

  const filePromises = filePaths
    .filter(file => !file.endsWith('sri-hashes.json'))
    .map(async file => ({
      file,
      url: file.replace(state.dir, '').replace('index.html', '') || '/',
      content: await fs.readFile(file, 'utf8'),
    }))

  return await Promise.all(filePromises)
}
