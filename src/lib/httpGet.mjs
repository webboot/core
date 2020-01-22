import https from 'https'
import URL from 'url'

import error from '@magic/error'
import is from '@magic/types'

import { errorMessages } from '../errorMessages.mjs'

const libName = '@webboot/core.lib.httpGet'

export const errors = errorMessages(libName)

export const httpGet = (url, options = {}) =>
  new Promise((resolve, reject) => {
    if (is.empty(url)) {
      reject(errors.HTTP_URL_EMPTY)
      return
    }

    options = {
      ...options,
      headers: {
        'User-Agent': 'webboot',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    https
      .get(url, options, res => {
        if (res.statusCode > 399) {
          reject(res)
          return
        }

        let data = ''

        res.on('data', d => {
          data += d
        })

        res.on('end', () => resolve(data))
      })
      .on('error', reject)
  })
