import http from 'http'
import https from 'https'
import URL from 'url'

import error from '@magic/error'
import is from '@magic/types'

import { errorMessages } from '../errorMessages.mjs'

const libName = '@webboot/cli.lib.httpGet'

export const errors = errorMessages(libName)

export const httpRequest = (url, options = {}) =>
  new Promise((resolve, reject) => {
    if (is.empty(url)) {
      reject(errors.HTTP_URL_EMPTY)
      return
    }

    const { body, json, headers = {}, ...opts } = options

    headers['User-Agent'] = 'webboot'

    opts.headers = headers

    const handler = url.startsWith('https') ? https : http

    const req = handler.request(url, opts, res => {
      if (res.statusCode > 399) {
        reject(error(errors.HTTP_STATUSCODE(res)))
        return
      }

      let data = ''

      res.on('data', d => {
        data += d
      })

      res.on('end', () => {
        if (json) {
          data = JSON.parse(data)
        }

        resolve(data)
      })
    })

    req.on('error', reject)

    if (body) {
      req.write(body)
    }

    req.end()
  })
