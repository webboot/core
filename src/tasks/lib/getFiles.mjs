import fs from '@magic/fs'
import is from '@magic/types'
import error from '@magic/error'

export const getFiles = async (state = {}) => {
  if (is.empty(state)) {
    throw error('state can not be empty', 'E_STATE_EMPTY')
  }

  if (!is.empty(state.files)) {
    return state.files
  }

  const stat = await fs.stat(state.dir)

  if (!stat.isDirectory()) {
    throw error('getFiles expects a directory, not a file', 'E_NOT_A_DIR')
  }

  const filePaths = await fs.getFiles(state.dir, true)

  const filePromises = filePaths
    .filter(file => !file.endsWith(state.sri))
    .map(async file => {
      let url = file
        .replace(state.dir, '')
        .replace('index.html', '')
        .replace('.html', '/')

      return {
        file,
        url,
        content: await fs.readFile(file, 'utf8'),
      }
    })

  return await Promise.all(filePromises)
}
