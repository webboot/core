import crypto from 'crypto'

export const createFileHash = ({ algorithm = 'sha384', ...file }) => {
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
