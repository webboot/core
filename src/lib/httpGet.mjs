import https from 'https'
import URL from 'url'

import { errorMessages } from '../errorMessages.mjs'

const libName = '@webboot/core.lib.httpGet'

export const errors = errorMessages(libName)

export const httpGet = url =>
  new Promise((resolve, reject) => {
    if (is.empty(url)) {
      throw error(errors.HTTP_URL_EMPTY)
    }

    https
      .get(url, res => {
        if (res.statusCode > 399) {
          reject(res)
        }

        let data = ''

        res.on('data', d => {
          data += d
        })

        res.on('end', () => resolve(data))
      })
      .on('error', reject)
  })
