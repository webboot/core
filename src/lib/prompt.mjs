import readline from 'readline'

import log from '@magic/log'

export const prompt = ({ msg = '', yesNo = false }) =>
  new Promise((resolve, reject) => {
    if (msg) {
      log(msg)
    }
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    rl.on('line', line => {
      if (yesNo) {
        line = line.trim().toLowerCase() === 'y' || line.trim().toLowerCase() === 'yes'
      }

      resolve(line)
      rl.close()
    })

    rl.on('error', reject)
  })
