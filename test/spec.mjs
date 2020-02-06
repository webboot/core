import { is, version } from '@magic/test'

import { webboot } from '../src/index.mjs'

const spec = {
  exec: is.fn,
  getDomain: is.fn,
  getEmail: is.fn,
  getFiles: is.fn,
  getGitHost: is.fn,
  getGitPgpKeys: is.fn,
  getPassphrase: is.fn,
  getPgpKey: is.fn,
  getVersion: is.fn,
  httpRequest: is.fn,
  json: [
    is.obj,
    {
      errors: is.object,
      parse: is.fn,
      stringify: is.fn,
    },
  ],
  prompt: is.fn,
  threeWayVerifyFile: is.fn,
}

export default [
  { fn: () => version.lib(webboot, spec), expect: is.len.eq(0) },
  { fn: () => version.spec(spec, webboot), expect: is.len.eq(0) },
]
