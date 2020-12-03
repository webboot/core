import crypto from '@webboot/crypto'

export const threeWayVerifyFile = ({ file, hashes }) => {
  const fileHash = crypto.hash.create(file.content)

  let argumentValid = true

  if (file.hash) {
    const { algorithm } = file
    argumentValid = crypto.hash.check(file.content, file.hash, { algorithm })
  }

  const valid = crypto.hash.check(file.content, fileHash.hash)

  const sri = hashes[file.url]
  const algoHash = `${file.algorithm}-${file.hash}`

  const mismatch = sri !== algoHash

  return !valid || !argumentValid || mismatch
}
