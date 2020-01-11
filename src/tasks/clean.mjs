import fs from '@magic/fs'

export const clean = async state => await fs.rmrf(state.sri)
