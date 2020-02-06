import { is, tryCatch } from '@magic/test'

import { httpRequest, errors } from '../../src/lib/httpRequest.mjs'

export default [
  {
    fn: tryCatch(httpRequest),
    expect: errors.HTTP_URL_EMPTY,
    info: 'httpRequest without an url rejects with E_HTTP_URL_EMPTY',
  },
  {
    fn: httpRequest('https://www.wikipedia.org'),
    expect: is.string,
    info: 'httpRequest for wikipedia.org returns 200 statuscode',
  },
  {
    fn: tryCatch(httpRequest, 'https://jaeh.at/page-no-exists/'),
    expect: t => t.name === 'HTTP_STATUSCODE',
    info: 'httpRequest for non-existing page throws E_HTTP_STATUSCODE',
  },
]
