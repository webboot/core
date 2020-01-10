import log from '@magic/log'

import * as tasks from './tasks/index.mjs'

export const { generate, release, sign, verify } = tasks

export const webboot = tasks.verify

webboot.verify = tasks.verify
webboot.sign = tasks.sign
webboot.generate = tasks.generate
webboot.release = tasks.release

export default webboot
