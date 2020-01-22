import readline from 'readline'
import fs from 'fs'

export const prompt = (std, firstLineOnly = true) =>
  new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: stdin,
      output: stdout,
    })

    rl.on('line', line => {
      resolve(line)

      // only get first line
      if (firstLineOnly) {
        rl.close()
      }
    })

    rl.on('error', reject)
  })
