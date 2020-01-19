import error from '@magic/error'

import crypto from '@webboot/crypto'

const libName = '@webboot/core.lib.threeWayVerifyFile'

export const threeWayVerifyFile = sriHashes => file => {
  const fileHash = crypto.hash.create(file.content)

  let argumentValid = true

  if (file.hash) {
    const { algorithm } = file
    argumentValid = crypto.hash.check(file.content, file.hash, { algorithm })
  }

  const valid = crypto.hash.check(file.content, fileHash.hash)

  const sri = sriHashes[file.url]
  const algoHash = `${file.algorithm}-${file.hash}`

  const mismatch = sri !== algoHash

  return !valid || !argumentValid || mismatch
}
