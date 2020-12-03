import path from 'path'
import os from 'os'

import cli from '@magic/cli'
import fs from '@magic/fs'
import log from '@magic/log'

import crypto from '@webboot/crypto'

import { errorMessages } from '../errorMessages.mjs'

const libName = '@webboot/core.lib.getPassPhrase'

export const errors = errorMessages(libName)

export const getPassphrase = async state => {
  const homedir = os.homedir()

  const passPhraseFileName = '.webboot.secret.asc'

  const preferredPassPhraseFile = path.join(process.cwd(), passPhraseFileName)

  const configDir = os.platform() === 'win32' ? 'AppData' : '.config'

  const passPhraseFiles = [
    preferredPassPhraseFile,
    path.join(homedir, passPhraseFileName),
    path.join(homedir, configDir, 'webboot', passPhraseFileName),
  ]

  let existingPassPhraseFiles = await Promise.all(
    passPhraseFiles.map(async f => {
      if (await fs.exists(f)) {
        return f
      }
    }),
  )

  existingPassPhraseFiles = existingPassPhraseFiles.filter(a => a)

  const passPhraseFileExists = existingPassPhraseFiles.length > 0

  if (passPhraseFileExists) {
    let file = existingPassPhraseFiles[0]

    if (existingPassPhraseFiles.length > 1) {
      log.info('Found more than one passphrasefile.')

      existingPassPhraseFiles.forEach((file, i) => {
        log.warn(i + 1, ' - ', file)
      })

      log('Please select one of the files above using a number between')
      const remoteId = await cli.prompt(`${1} and ${existingPassPhraseFiles.length}: `)
      file = existingPassPhraseFiles[remoteId - 1]
    }

    log.success('Existing passphrase file found')
    const doIt = await cli.prompt(`Do you want to use this file: ${file}?`, { yesNo: true })
    if (doIt) {
      return await crypto.pgp.decrypt(file)
    }
  } else {
    log.warn(
      'W_NO_PASSPHRASE_FILE',
      `
  webboot could not find a passphrase file.
  looked in:
  ${log.paint.grey(passPhraseFiles.join('\n'))}
  if you already own a webboot.pass.gpg file, please specify the location using the --passfile option.
  `.trim(),
    )
  }

  const generate = await cli.prompt('Generate your passphrase now? (y/N): ', { yesNo: true })
  if (!generate) {
    log('no passphrase generated and no passphrase file found.')
    process.exit(1)
  }

  const words = await crypto.random.words(23)

  const wordList = words.join(' ')

  log(`
generated 23 word passphrase for you.
this passphrase will get encrypted using your public key (so only you can read the contents)
then saved on your harddisk at:
${preferredPassPhraseFile}
`)

  const show = await cli.prompt('Do you want to show your passphrase now? (y/N)', { yesNo: true })
  if (show) {
    log.success('passphrase:\n\n', wordList, '\n')
  }

  log('encrypting passphrase using your public gpg key as recipient.')

  const passphrase = await crypto.gpg(`--encrypt --armor --recipient ${state.key.key}`, {
    stdin: words.join(' '),
  })

  await fs.writeFile(preferredPassPhraseFile, passphrase)

  log(`encrypted passphrase saved at ${preferredPassPhraseFile}. passphrase: ${passphrase}`)

  log('decrypting passphrase to make sure we can.')

  const decryptedContents = await crypto.pgp.decrypt(preferredPassPhraseFile)

  if (decryptedContents !== passphrase) {
    log.error(errors.REIMPORT_PASSPHRASE)
    process.exit(1)
  }

  log.success('finished')

  return wordList
}
