export const maybeThrow = errors => {
  errors.filter(([e]) => e).forEach(([_, e]) => { throw e })
}
