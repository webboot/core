import path from 'path'

import fs from '@magic/fs'

export const write = async state => {
  const hashes = state.files
    .map(({ algorithm, file, hash }) => `"${file.replace(state.dir, '')}": "${algorithm}-${hash}"`)

  const hashString = `[
${hashes.join(',\n')}
]`

  const sriHashFile = path.join(state.dir, 'sri-hashes.json')
  const written = await fs.writeFile(sriHashFile, hashString)

  return written
}
