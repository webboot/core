import child_process from 'child_process'

import cli from '@magic/cli'
import log from '@magic/log'

const libName = '@webboot/cli.lib.getGitPgpKeys'

export const getGitHost = async () => {
  const gitRemote = child_process.execSync('git remote -v').toString()

  const remotes = new Set()

  gitRemote
    .split('\n')
    .filter(a => a.trim())
    .map(remote => {
      const [_, link] = remote.split(/( |\t)/g).filter(a => a.trim())

      let host = 'github.com'

      if (link.startsWith('http')) {
        host = link.replace('https://', '').split('/')[0]
      } else if (link.startsWith('git@')) {
        host = link.split('@')[1].split(':')[0]
      }

      remotes.add(host)
    })

  const remoteArray = Array.from(remotes)

  let host = remoteArray[0]

  if (remoteArray.length > 1) {
    log.warn('W_MANY_REMOTES', 'found more than one remote.')

    remoteArray.forEach((remote, i) => {
      log.warn(i + 1, ' - ', remote)
    })

    log('Please select one of the remotes above using a number between')
    const remoteId = await cli.prompt(`${1} and ${remoteArray.length}: `)
    host = remoteArray[remoteId - 1]
  }

  return host
}
