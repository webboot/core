import path from 'path'

import fs from '@magic/fs'

export const write = async state => {
  const hashes = state.files
    .map(({ algorithm, url, hash }) => `  "${url}": "${algorithm}-${hash}"`)
    .join(',\n')

  const hashString = `[\n${hashes}\n]`

  const sriHashFile = path.join(state.dir, 'sri-hashes.json')
  const written = await fs.writeFile(sriHashFile, hashString)

  return written
}
