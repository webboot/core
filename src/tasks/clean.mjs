import fs from '@magic/fs'

export const clean = async state => {
  try {
    await fs.rmrf(state.sri)
    return true
  } catch(e) {
    if (e.code === 'ENOENT') {
      return true
    }

    return e
  }
}
