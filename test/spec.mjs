import { is } from '@magic/test'

import webboot from '../src/index.mjs'

export default [
  { fn: () => webboot, expect: is.fn, info: 'webboot is a function' },
  {
    fn: () => webboot,
    expect: is.deep.eq(webboot.verify),
    info: 'webboot is equivalent to webboot.verify',
  },
  { fn: () => webboot.generate, expect: is.fn, info: 'webboot.generate is a function' },
  { fn: () => webboot.verify, expect: is.fn, info: 'webboot.verify is a function' },
  { fn: () => webboot.sign, expect: is.fn, info: 'webboot.sign is a function' },
  { fn: () => webboot.release, expect: is.fn, info: 'webboot.release is a function' },
  { fn: () => webboot.write, expect: is.fn, info: 'webboot.write is a function' },
]
