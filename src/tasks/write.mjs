import path from 'path'

import fs from '@magic/fs'

export const write = async state => {
  const hashes = state.files
    .map(({ algorithm, url, hash }) => `  "${url}": "${algorithm}-${hash}"`)
    .join(',\n')

  const hashString = `{\n${hashes}\n}`

  return await fs.writeFile(state.sri, hashString)
}
