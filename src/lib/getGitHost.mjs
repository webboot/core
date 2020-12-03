import cli from '@magic/cli'
import log from '@magic/log'

const libName = '@webboot/core.lib.getGitHost'

export const getGitHost = async () => {
  const gitRemote = await cli.exec('git remote -v')

  const remotes = new Set()

  gitRemote
    .toString()
    .split('\n')
    .filter(a => a.trim())
    .map(remote => {
      const [_, link] = remote.split(/( |\t)/g).filter(a => a.trim())

      let host = 'github.com'

      if (link.startsWith('http')) {
        // http(s)://githost.com/username/repository
        host = link.split('://')[1].split('/')[0]
      } else if (link.startsWith('git@')) {
        // git@githost.com:username/repository
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
