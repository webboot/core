import crypto from 'crypto'

export const createFileHash = ({ file, algorithm = 'sha384' }) => {
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
