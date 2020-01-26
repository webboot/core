import log from '@magic/log'

import * as tasks from './tasks/index.mjs'

export const { clean, generate, release, sign, verify, write } = tasks

export const webboot = tasks.verify

webboot.verify = tasks.verify
webboot.sign = tasks.sign
webboot.generate = tasks.generate
webboot.release = tasks.release
webboot.write = tasks.write
webboot.clean = tasks.clean

export default webboot
