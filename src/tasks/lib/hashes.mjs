import crypto from 'crypto'

export const create = ({ algorithm = 'sha384', ...file }) => {
  const { content } = file

  const hashIt = crypto.createHash(algorithm)

  hashIt.update(content)

  const hash = hashIt.digest('base64')

  return {
    ...file,
    algorithm,
    hash,
  }
}

export const check = sriHashes => file => {
  const { hash, algorithm, url } = create(file)

  const fileHashValid = Object.entries(sriHashes)
    .filter(([url]) => url === file.url)
    .every(([_, h]) => h === `${algorithm}-${hash}`)

  if (!fileHashValid || hash !== file.hash) {
    log.error('EINVALIDHASH', `file with ${url} has encountered a hash mismatch.`)
    process.exit()
  }

  return true
}
