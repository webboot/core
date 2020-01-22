import { is, tryCatch } from '@magic/test'

import { httpGet, errors } from '../../src/lib/httpGet.mjs'

export default [
  {
    fn: tryCatch(httpGet),
    expect: errors.HTTP_URL_EMPTY,
    info: 'httpGet without an url rejects with E_HTTP_URL_EMPTY',
  },
  {
    fn: httpGet('https://www.wikipedia.org'),
    expect: is.string,
    info: 'httpGet for wikipedia.org returns 200 statuscode',
  },
  {
    fn: tryCatch(httpGet, 'https://jaeh.at/page-no-exists/'),
    expect: t => t.name === 'HTTP_STATUSCODE',
    info: 'httpGet for non-existing page throws E_HTTP_STATUSCODE',
  },
]
