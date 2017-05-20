export default function expand(source, { separator = '-' } = {}) {
  const theme = {}

  Object.keys(source).forEach(path => {
    const matches = path.match(/[A-Za-z]+[^A-Z]+/g)
    if (!matches) return

    let pointer = theme
    matches.forEach(match => {
      const parts = match.split(separator)
      const namespace = parts.shift()
      const className = parts.join(separator)

      if (!pointer[namespace]) {
        pointer[namespace] = {}
      }

      if (className) {
        pointer[namespace][className] = source[path]
      } else {
        pointer = pointer[namespace]
      }
    })
  })

  return theme
}
